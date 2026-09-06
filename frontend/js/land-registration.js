function renderLands() {
  const root = document.querySelector("#landList");
  if (!root) return;
  const lands = Storage.get("lands", []);
  root.innerHTML = lands.length
    ? lands
        .map(
          (l) =>
            `<div class="land-card"><div class="row-between"><div><strong>Khasra ${l.khasra}</strong><div class="helper">${l.village}, ${l.tehsil}, ${l.district}</div></div><div><strong>${l.area} ${l.unit}</strong></div></div><div class="mt-2"><span class="badge badge-success">Land Record Found</span> <span class="badge badge-success">Ownership Verified</span></div></div>`,
        )
        .join("")
    : '<p class="muted">No land added yet.</p>';
}
document.addEventListener("DOMContentLoaded", () => {
  renderLands();
  const form = document.querySelector("#landForm");
  if (!form) return;
  const verify = document.querySelector("#verificationPanel");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const land = {
      id: "L" + Date.now(),
      state: fd.get("state"),
      district: fd.get("district"),
      tehsil: fd.get("tehsil"),
      village: fd.get("village"),
      khasra: fd.get("khasra"),
      area: Number(fd.get("area")),
      unit: fd.get("unit"),
      owner: fd.get("owner"),
      relation: fd.get("relation"),
      irrigation: fd.get("irrigation"),
      landType: fd.get("landType"),
      verified: true,
    };
    const lands = Storage.get("lands", []);
    lands.push(land);
    Storage.set("lands", lands);
    verify.classList.remove("hidden");
    renderLands();
    form.reset();
    setTimeout(() => verify.scrollIntoView({ behavior: "smooth" }), 50);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector("#farmerIdCard");
  if (!card) return;
  let farmerId = Storage.get("farmerId");
  if (!farmerId) {
    farmerId = {
      id: "MP-BPL-FRM-2026-" + Math.floor(10000 + Math.random() * 89999),
      verified: true,
    };
    Storage.set("farmerId", farmerId);
  }
  const d = getCoreData();
  const total = totalLandAcres(d.lands).toFixed(1);
  const cells = Array.from(
    { length: 25 },
    (_, i) =>
      `<span class="qr-cell ${i % 3 === 0 || i % 5 === 0 ? "qr-dark" : "qr-light"}"></span>`,
  ).join("");
  card.innerHTML = `<div class="id-card-grid"><div><div class="eyebrow">Digital Farmer ID</div><h2 class="farmer-id-name">${d.farmer.name || "Farmer"}</h2><p class="farmer-id-number">${farmerId.id}</p><div class="grid-2"><div><small>District</small><br><strong>${d.farmer.district || "—"}</strong></div><div><small>Village</small><br><strong>${d.farmer.village || "—"}</strong></div><div><small>Total Registered Land</small><br><strong>${total} Acre</strong></div><div><small>Land Parcels</small><br><strong>${d.lands.length}</strong></div></div><p><span class="badge badge-success">✓ Verification Complete</span></p></div><div class="qr-placeholder">${cells}</div></div>`;
});
