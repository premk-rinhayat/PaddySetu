const DEMO_CONFIG = {
  procurementRule: {
    quintalPerAcre: 20,
    label: "DEMO procurement eligibility rule",
  },
  queue: {
    defaultProcessingSpeedQph: 20,
    arrivalBufferMinutes: 30,
    simulationStepMinutes: 10,
  },
  demoMSPRate: 2400,
  centres: [
    {
      id: 1,
      name: "Berasia Procurement Centre",
      district: "Bhopal",
      location: "Berasia Mandi Road, Bhopal",
      distance: "4.2 km",
      processingSpeed: 20,
      currentLoad: "High",
      waiting: "Busy — queue moving steadily",
    },
    {
      id: 2,
      name: "Phanda Procurement Centre",
      district: "Bhopal",
      location: "Phanda Main Road, Bhopal",
      distance: "18.6 km",
      processingSpeed: 25,
      currentLoad: "Medium",
      waiting: "Moderate wait expected",
    },
    {
      id: 3,
      name: "Eintkhedi Procurement Centre",
      district: "Bhopal",
      location: "Eintkhedi, Bhopal",
      distance: "13.4 km",
      processingSpeed: 22,
      currentLoad: "Low",
      waiting: "Lighter queue",
    },
  ],
};
function qs(s, p = document) {
  return p.querySelector(s);
}
function qsa(s, p = document) {
  return [...p.querySelectorAll(s)];
}
function fmtDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function totalLandAcres(lands) {
  return (lands || []).reduce(
    (sum, l) =>
      sum + (l.unit === "Hectare" ? Number(l.area) * 2.47105 : Number(l.area)),
    0,
  );
}
function header(active = "") {
  return `<header class="site-header"><div class="container header-inner"><a class="brand" href="../index.html"><span class="brand-mark">🌾</span><span>PaddySetu <small>Digital Procurement Prototype</small></span></a><nav class="top-nav"><a href="dashboard.html">Dashboard</a><a href="land-registration.html">Land</a><a href="procurement-registration.html">Procurement</a><a href="live-queue.html">Live Queue</a></nav></div></header>`;
}
function mountHeader() {
  const el = qs("[data-header]");
  if (el) el.innerHTML = header();
}
function getCoreData() {
  return {
    farmer: Storage.get("farmer", {}),
    lands: Storage.get("lands", []),
    farmerId: Storage.get("farmerId", {}),
    procurement: Storage.get("procurement", {}),
    slot: Storage.get("slot", {}),
    quantity: Storage.get("quantity", {}),
    token: Storage.get("token", {}),
  };
}
function renderDashboard() {
  const root = qs("#dashboardData");
  if (!root) return;
  const d = getCoreData();
  const acres = totalLandAcres(d.lands).toFixed(1);
  root.innerHTML = `

<div class="card">
    <h2 class="section-title">Next action</h2>

    <p class="muted">
        Continue procurement or monitor your live queue.
    </p>

    <div class="quick-actions">

        <a class="action-tile" href="profile.html">
            <span class="icon-circle">👤</span>
            My Profile
        </a>

        <a class="action-tile" href="procurement-registration.html">
            <span class="icon-circle">📝</span>
            Procurement Registration
        </a>

        <a class="action-tile" href="slot-booking.html">
            <span class="icon-circle">📍</span>
            Book Slot
        </a>

        <a class="action-tile" href="live-queue.html">
            <span class="icon-circle">⏱️</span>
            Live Queue
        </a>

        <a class="action-tile" href="procurement-status.html">
            <span class="icon-circle">✅</span>
            Procurement Status
        </a>

    </div>
</div>`;
}
document.addEventListener("DOMContentLoaded", () => {
  Storage.seedDemoData();
  mountHeader();
  renderDashboard();
  const loginForm = qs("#loginForm");
  if (loginForm)
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      location.href = "dashboard.html";
    });
  qsa("[data-reset-demo]").forEach((b) =>
    b.addEventListener("click", () => {
      Storage.resetPrototype();
      location.href = "dashboard.html";
    }),
  );
});
window.DEMO_CONFIG = DEMO_CONFIG;
window.fmtDate = fmtDate;
window.getCoreData = getCoreData;
