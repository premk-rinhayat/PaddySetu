# PaddySetu — Farmer Procurement Prototype

Frontend-only hackathon prototype inspired by the high-level workflow of digital paddy procurement systems such as MP e-Uparjan. It is **not** a government system, does not connect to Aadhaar, and does not use government APIs.

## Stack
- HTML5
- CSS3
- Vanilla JavaScript
- Browser LocalStorage / SessionStorage
- Mock data only

## Main innovation
Traditional broad-date procurement booking is extended with:
1. expected quantity **range** instead of one exact quantity,
2. quantity-aware token queue,
3. total expected crop weight before the farmer,
4. arrival **time range** rather than exact time,
5. live demo queue updates,
6. cautious smart-arrival guidance that encourages safe early arrival.

## Demo configuration
Open `js/app.js` and edit `DEMO_CONFIG`.

```js
const DEMO_CONFIG = {
  procurementRule: { quintalPerAcre: 20 }, // DEMO ONLY
  queue: { defaultProcessingSpeedQph: 20, arrivalBufferMinutes: 30 },
  demoMSPRate: 2400
};
```

The `20 quintal/acre` eligibility rule and processing speeds are prototype assumptions, **not actual government rules**.

## Run
Open `index.html` with a local static server (recommended) or directly in a modern browser. For VS Code, Live Server works well.

## Demo farmer
- Name: Ramesh Patel
- District: Bhopal
- Village: Berasia
- Farmer ID: `MP-BPL-FRM-2026-10245`
- Crop: Paddy
- Eligible quantity: 60 Quintal
- Expected range: 50–60 Quintal
- Token: `P-027`

## Mock OTP
Use `123456` on the OTP verification page.

## Folder structure
The project intentionally separates page HTML, shared CSS, page-specific CSS and modular JavaScript. No frameworks or backend are used.
