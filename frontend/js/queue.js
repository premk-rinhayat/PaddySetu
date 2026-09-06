function avgQueueQty(q) {
  return (Number(q.minQuantity) + Number(q.maxQuantity)) / 2;
}
function minutesToClock(base, mins) {
  const d = new Date(base.getTime() + mins * 60000);
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}
function queueMetrics() {
  const queue = Storage.get("queue", []);
  const slot = Storage.get("slot", {});
  const token = Storage.get("token", { number: "P-027" }).number;
  const speed = Number(
    slot.processingSpeed || DEMO_CONFIG.queue.defaultProcessingSpeedQph,
  );
  let weight = 0,
    ahead = 0,
    current =
      queue.find((q) => q.status === "processing")?.token ||
      queue.find((q) => q.status !== "done")?.token ||
      "—";
  for (const q of queue) {
    if (q.token === token) break;
    if (q.status !== "done") {
      weight += avgQueueQty(q);
      ahead++;
    }
  }
  const waitHours = weight / speed;
  const base = new Date();
  const midMins = waitHours * 60;
  const start = Math.max(0, midMins - 20),
    end = midMins + 25;
  const recommended = Math.max(
    0,
    start - DEMO_CONFIG.queue.arrivalBufferMinutes,
  );
  return {
    queue,
    token,
    speed,
    weight: Math.round(weight),
    ahead,
    current,
    window: `${minutesToClock(base, start)} – ${minutesToClock(base, end)}`,
    recommended: minutesToClock(base, recommended),
    waitMinutes: midMins,
  };
}
function guidance(m) {
  if (m.ahead <= 2 || m.waitMinutes <= 45)
    return {
      stage: "Arrival Recommended",
      text: "Please proceed to the procurement centre and try to arrive before the recommended time.",
    };
  if (m.ahead <= 5 || m.waitMinutes <= 120)
    return {
      stage: "Approaching",
      text: "Your turn is approaching. Please start preparing to leave for the procurement centre.",
    };
  return {
    stage: "Early Stage",
    text: "Your token is in queue. Keep monitoring the live status and remain prepared for travel.",
  };
}
function renderQueue() {
  const m = queueMetrics(),
    g = guidance(m),
    q = Storage.get("quantity", {}),
    slot = Storage.get("slot", {});
  const root = document.querySelector("#liveQueueRoot");
  if (!root) return;
  root.innerHTML = `<section class="queue-hero"><div class="eyebrow" style="color:#d8ecdf">Live Queue / लाइव कतार</div><h1 class="page-title" style="color:#fff">${slot.centreName || "Procurement Centre"}</h1><div class="stat-grid"><div class="stat-card"><div class="label">Current Token</div><div class="value">${m.current}</div></div><div class="stat-card"><div class="label">Your Token</div><div class="value">${m.token}</div></div><div class="stat-card"><div class="label">Farmers Ahead</div><div class="value">${m.ahead}</div></div><div class="stat-card"><div class="label">Weight Before You</div><div class="value">${m.weight} Q</div></div></div></section><section class="card"><div class="eyebrow">Expected Arrival Window</div><div class="arrival-window">${m.window}</div><p class="muted">Range-based estimate using demo queue quantities and centre processing speed. Not a government formula.</p><div class="progress-track"><div class="progress-bar" style="width:${Math.max(8, 100 - Math.min(92, m.ahead * 9))}%"></div></div></section><section class="guidance-card"><div class="row-between"><div><div class="eyebrow">Smart Arrival Guidance</div><h2 class="section-title mt-1">${g.stage}</h2></div><span class="badge badge-info">Recommended arrival: before ${m.recommended}</span></div><p class="mb-0">${g.text}</p><p class="helper">Your expected procurement turn is approaching based on live demo estimates. Please plan to reach the centre safely before the suggested arrival window.</p></section><section class="card"><div class="row-between"><h2 class="section-title">Queue details</h2><span class="demo-label">DEMO processing speed ${m.speed} Q/hour</span></div><div class="queue-list">${m.queue
    .slice(0, 12)
    .map(
      (x) =>
        `<div class="queue-item ${x.token === m.token ? "current" : ""}"><strong>${x.token}</strong><div>${x.minQuantity}–${x.maxQuantity} Q <span class="helper">avg ${avgQueueQty(x).toFixed(1)} Q</span></div><span class="badge ${x.status === "processing" ? "badge-warn" : "badge-info"}">${x.status}</span></div>`,
    )
    .join(
      "",
    )}</div><div class="button-row"><button class="btn btn-secondary" id="simulateQueue">Simulate Queue Update</button><a class="btn btn-primary" href="procurement-status.html">I have reached the centre</a></div></section>`;
  document
    .querySelector("#simulateQueue")
    ?.addEventListener("click", simulateQueueStep);
}
function simulateQueueStep() {
  let queue = Storage.get("queue", []);
  const currentIndex = queue.findIndex((q) => q.status === "processing");
  if (currentIndex >= 0) {
    queue[currentIndex].status = "done";
    const next = queue.findIndex(
      (q, i) => i > currentIndex && q.status !== "done" && !q.isUser,
    );
    if (next >= 0) queue[next].status = "processing";
  }
  Storage.set("queue", queue);
  renderQueue();
}
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#liveQueueRoot")) {
    renderQueue();
    window.fppQueueTimer = setInterval(() => {
      simulateQueueStep();
    }, 8000);
  }
  initProcurementStatus();
});
window.addEventListener("beforeunload", () =>
  clearInterval(window.fppQueueTimer),
);
function initProcurementStatus() {
  const timeline = document.querySelector("#statusTimeline");
  if (!timeline) return;
  const statuses = [
    "Token Booked",
    "Waiting",
    "Farmer Arrived",
    "Document Verification",
    "Quality Check",
    "Weighing",
    "Procurement Accepted",
    "Receipt Generated",
    "Payment Processing",
    "Completed",
  ];
  function draw() {
    const i = Storage.get("status", { index: 1 }).index;
    timeline.innerHTML = statuses
      .map(
        (name, n) =>
          `<div class="status-step ${n < i ? "done" : n === i ? "active" : ""}"><div class="status-marker"><div class="status-dot"></div></div><div class="status-content"><strong>${name}</strong><span class="helper">${n < i ? "Completed" : n === i ? "Current stage" : "Pending"}</span></div></div>`,
      )
      .join("");
    const action = document.querySelector("#statusAction");
    action.innerHTML =
      i >= 9
        ? "<strong>Procurement Completed.</strong><br>Your demo receipt is ready."
        : `Current stage: <strong>${statuses[i]}</strong>`;
    document.querySelector("#advanceStatus").textContent =
      i >= 9 ? "View Receipt" : "Advance Demo Status";
  }
  document.querySelector("#advanceStatus")?.addEventListener("click", () => {
    let st = Storage.get("status", { index: 1 });
    if (st.index >= 9) {
      location.href = "receipt.html";
      return;
    }
    st.index++;
    Storage.set("status", st);
    draw();
  });
  draw();
}
