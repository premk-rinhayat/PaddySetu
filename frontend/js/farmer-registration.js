document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#farmerRegistrationForm");
  if (!form) return;
  const msg = document.querySelector("#formMessage");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const aadhaar = (fd.get("aadhaar") || "").replace(/\D/g, "");
    const mobile = (fd.get("mobile") || "").replace(/\D/g, "");
    const pass = fd.get("password");
    const confirm = fd.get("confirmPassword");
    let errors = [];
    if (aadhaar.length !== 12)
      errors.push("Aadhaar number must contain 12 digits.");
    if (!/^[6-9]\d{9}$/.test(mobile))
      errors.push("Enter a valid 10-digit mobile number.");
    if (pass.length < 6) errors.push("Password must be at least 6 characters.");
    if (pass !== confirm) errors.push("Passwords do not match.");
    if (errors.length) {
      msg.className = "error";
      msg.textContent = errors.join(" ");
      return;
    }
    [
      "lands",
      "farmerId",
      "procurement",
      "slot",
      "quantity",
      "token",
      "queue",
      "status",
      "receipt",
    ].forEach((k) => Storage.remove(k));
    Storage.set("farmer", {
      name: fd.get("name"),
      aadhaar: "XXXX XXXX " + aadhaar.slice(-4),
      mobile: mobile.slice(0, 2) + "XXXXXX" + mobile.slice(-2),
      state: fd.get("state"),
      district: fd.get("district"),
      tehsil: fd.get("tehsil"),
      village: fd.get("village"),
      verified: false,
    });
    sessionStorage.setItem("fpp_mock_otp", "123456");
    location.href = "otp-verification.html";
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const boxes = [...document.querySelectorAll("#otpBoxes input")];
  if (!boxes.length) return;
  boxes.forEach((b, i) =>
    b.addEventListener("input", () => {
      b.value = b.value.replace(/\D/g, "").slice(0, 1);
      if (b.value && boxes[i + 1]) boxes[i + 1].focus();
    }),
  );
  document.querySelector("#verifyOtp")?.addEventListener("click", () => {
    const otp = boxes.map((b) => b.value).join("");
    const msg = document.querySelector("#otpMessage");
    if (otp !== "123456") {
      msg.textContent = "Incorrect demo OTP. Use 123456.";
      return;
    }
    const f = Storage.get("farmer", {});
    f.verified = true;
    Storage.set("farmer", f);
    document.querySelector("#successScreen").classList.remove("hidden");
    setTimeout(() => (location.href = "land-registration.html"), 700);
  });
});
