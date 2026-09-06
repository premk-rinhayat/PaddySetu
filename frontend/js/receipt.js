document.addEventListener("DOMContentLoaded", () => {
  const d = getCoreData();
  let receipt = Storage.get("receipt");
  if (!receipt) {
    const actual = Math.max(1, Math.min(Number(d.quantity.max || 55), 54.6));
    receipt = {
      actualWeight: actual,
      mspRate: DEMO_CONFIG.demoMSPRate,
      totalPayment: Math.round(actual * DEMO_CONFIG.demoMSPRate),
      date: d.slot.date,
      status: "Completed",
    };
    Storage.set("receipt", receipt);
  }
  const root = document.querySelector("#receiptData");
  if (root)
    root.innerHTML = `<div class="receipt-grid"><div class="receipt-item"><span>Farmer Name</span><strong>${d.farmer.name}</strong></div><div class="receipt-item"><span>Farmer ID</span><strong>${d.farmerId.id}</strong></div><div class="receipt-item"><span>Token Number</span><strong>${d.token.number}</strong></div><div class="receipt-item"><span>Procurement Registration ID</span><strong>${d.procurement.id}</strong></div><div class="receipt-item"><span>Crop</span><strong>${d.procurement.crop}</strong></div><div class="receipt-item"><span>Procurement Centre</span><strong>${d.slot.centreName}</strong></div><div class="receipt-item"><span>Actual Weight</span><strong>${receipt.actualWeight} Quintal</strong></div><div class="receipt-item"><span>Procurement Date</span><strong>${fmtDate(receipt.date)}</strong></div><div class="receipt-item"><span>Status</span><strong>${receipt.status}</strong></div><div class="receipt-item"><span>Rate Type</span><strong>Hackathon Demo Value</strong></div></div><div class="payment-box"><div class="row-between"><div><span class="demo-label">DEMO MSP RATE</span><p class="mb-0">₹${receipt.mspRate.toLocaleString("en-IN")} per Quintal</p></div><div class="text-center"><div class="muted">Total Demo Payment</div><div class="payment-total">₹${receipt.totalPayment.toLocaleString("en-IN")}</div></div></div></div>`;
  document
    .querySelector("#printReceipt")
    ?.addEventListener("click", () => window.print());
});
