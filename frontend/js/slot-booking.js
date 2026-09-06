document.addEventListener("DOMContentLoaded", () => {
  const centresRoot = document.querySelector("#centreList");
  if (centresRoot) {
    centresRoot.innerHTML = DEMO_CONFIG.centres
      .map(
        (c) =>
          `<label class="centre-card"><div class="row-between"><div><input type="radio" name="centre" value="${c.id}"> <strong>${c.name}</strong></div><span class="badge ${c.currentLoad === "High" ? "badge-warn" : "badge-success"}">${c.currentLoad} load</span></div><p class="helper">${c.location} • ${c.distance}</p><div class="grid-2"><div><span class="muted">Processing speed</span><br><strong>${c.processingSpeed} Q/hour</strong></div><div><span class="muted">Waiting condition</span><br><strong>${c.waiting}</strong></div></div></label>`,
      )
      .join("");
    centresRoot.addEventListener("change", (e) => {
      document
        .querySelectorAll(".centre-card")
        .forEach((x) => x.classList.remove("selected"));
      e.target.closest(".centre-card").classList.add("selected");
      const c = DEMO_CONFIG.centres.find(
        (x) => x.id === Number(e.target.value),
      );
      sessionStorage.setItem("fpp_selected_centre", JSON.stringify(c));
    });
  }
  const centreBtn = document.querySelector("#continueCentre");
  centreBtn?.addEventListener("click", () => {
    const c = JSON.parse(
      sessionStorage.getItem("fpp_selected_centre") || "null",
    );
    if (!c) {
      document.querySelector("#centreMessage").textContent =
        "Please select a procurement centre.";
      return;
    }
    Storage.set("slot", {
      centreId: c.id,
      centreName: c.name,
      location: c.location,
      distance: c.distance,
      processingSpeed: c.processingSpeed,
    });
    location.href = "crop-quantity.html";
  });
  const dateRoot = document.querySelector("#dateList");
  if (dateRoot) {
    const base = new Date("2026-11-05T00:00:00");
    let html = "";
    for (let i = 0; i < 6; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      html += `<button type="button" class="date-option" data-date="${iso}"><strong>${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</strong><br><span class="helper">${d.toLocaleDateString("en-IN", { weekday: "short" })}</span></button>`;
    }
    dateRoot.innerHTML = html;
    dateRoot.addEventListener("click", (e) => {
      const b = e.target.closest(".date-option");
      if (!b) return;
      document
        .querySelectorAll(".date-option")
        .forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
      sessionStorage.setItem("fpp_selected_date", b.dataset.date);
    });
  }
  document.querySelector("#continueDate")?.addEventListener("click", () => {
    const date = sessionStorage.getItem("fpp_selected_date");
    if (!date) {
      document.querySelector("#dateMessage").textContent =
        "Please select an available procurement date.";
      return;
    }
    const slot = Storage.get("slot", {});
    slot.date = date;
    Storage.set("slot", slot);
    location.href = "centre-selection.html";
  });
});
