document.addEventListener("DOMContentLoaded", () => {
  const landSelect = document.querySelector("#landId");
  const lands = Storage.get("lands", []);
  if (landSelect)
    landSelect.innerHTML = lands
      .map(
        (l) =>
          `<option value="${l.id}" data-area="${l.area}" data-unit="${l.unit}" data-khasra="${l.khasra}">Khasra ${l.khasra} — ${l.area} ${l.unit}</option>`,
      )
      .join("");
  const area = document.querySelector("#cultivatedArea"),
    result = document.querySelector("#eligibleResult");
  function calc() {
    const a = Number(area?.value || 0);
    const eligible = Math.max(
      0,
      a * DEMO_CONFIG.procurementRule.quintalPerAcre,
    );
    if (result) result.textContent = eligible.toFixed(0) + " Quintal";
    return eligible;
  }
  area?.addEventListener("input", calc);
  calc();
  const form = document.querySelector("#procurementForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    if (!fd.get("consent")) {
      document.querySelector("#procMessage").textContent =
        "Please accept the demo consent.";
      return;
    }
    const opt = landSelect.options[landSelect.selectedIndex];
    const proc = {
      id: "PROC-K26-" + Math.floor(1000 + Math.random() * 8999),
      season: fd.get("season"),
      crop: fd.get("crop"),
      landId: fd.get("landId"),
      khasra: opt.dataset.khasra,
      registeredArea: Number(opt.dataset.area),
      cultivatedArea: Number(fd.get("cultivatedArea")),
      eligibleQuantity: calc(),
      harvestPeriod: fd.get("harvestPeriod"),
      bankLast4: fd.get("bankLast4"),
    };
    Storage.set("procurement", proc);
    location.href = "slot-booking.html";
  });
});
