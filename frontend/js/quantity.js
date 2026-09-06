document.addEventListener("DOMContentLoaded", () => {
  const p = Storage.get("procurement", {});
  const limit = Number(p.eligibleQuantity || 0);
  const limitEl = document.querySelector("#eligibleLimit");
  if (limitEl) limitEl.textContent = limit + " Quintal";
  const form = document.querySelector("#quantityForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const min = Number(document.querySelector("#minQuantity").value),
      max = Number(document.querySelector("#maxQuantity").value),
      msg = document.querySelector("#quantityMessage");
    let err = "";
    if (min <= 0 || max <= 0) err = "Enter quantities greater than zero.";
    else if (min > max)
      err = "Minimum quantity cannot be greater than maximum quantity.";
    else if (max > limit)
      err = `Maximum quantity cannot exceed your eligible limit of ${limit} Quintal.`;
    if (err) {
      msg.textContent = err;
      return;
    }
    Storage.set("quantity", { min, max });
    location.href = "token-booking.html";
  });
});
