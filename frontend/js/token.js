function avg(q) {
  return (Number(q.minQuantity) + Number(q.maxQuantity)) / 2;
}
function weightAhead(queue, userToken) {
  let total = 0,
    count = 0;
  for (const q of queue) {
    if (q.token === userToken) break;
    if (q.status !== "done") {
      total += avg(q);
      count++;
    }
  }
  return { total: Math.round(total), count };
}
document.addEventListener("DOMContentLoaded", () => {
  const d = getCoreData();
  let queue = Storage.get("queue", []);
  if (!queue.some((x) => x.token === "P-027"))
    queue.push({
      token: "P-027",
      minQuantity: d.quantity.min,
      maxQuantity: d.quantity.max,
      status: "booked",
      isUser: true,
    });
  const ahead = weightAhead(queue, "P-027");
  const root = document.querySelector("#tokenSummary");
  if (root)
    root.innerHTML = `<div class="summary-row"><span>Farmer Name</span><strong>${d.farmer.name}</strong></div><div class="summary-row"><span>Farmer ID</span><strong>${d.farmerId.id}</strong></div><div class="summary-row"><span>Crop</span><strong>${d.procurement.crop}</strong></div><div class="summary-row"><span>Procurement Centre</span><strong>${d.slot.centreName}</strong></div><div class="summary-row"><span>Procurement Date</span><strong>${fmtDate(d.slot.date)}</strong></div><div class="summary-row"><span>Expected Quantity Range</span><strong>${d.quantity.min}–${d.quantity.max} Q</strong></div><div class="summary-row"><span>Farmers Ahead</span><strong>${ahead.count}</strong></div><div class="summary-row"><span>Estimated Weight Before You</span><strong>${ahead.total} Quintal</strong></div>`;
  document.querySelector("#bookToken")?.addEventListener("click", () => {
    const token = {
      number: "P-027",
      booked: true,
      bookedAt: new Date().toISOString(),
    };
    Storage.set("token", token);
    queue = queue.map((x) =>
      x.token === "P-027"
        ? {
            ...x,
            status: "waiting",
            minQuantity: d.quantity.min,
            maxQuantity: d.quantity.max,
          }
        : x,
    );
    Storage.set("queue", queue);
    location.href = "live-queue.html";
  });
});
window.weightAhead = weightAhead;
