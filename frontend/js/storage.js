const Storage = {
  keys: {
    farmer: "fpp_farmer",
    lands: "fpp_lands",
    farmerId: "fpp_farmer_id",
    procurement: "fpp_procurement",
    slot: "fpp_slot",
    quantity: "fpp_quantity",
    token: "fpp_token",
    queue: "fpp_queue",
    status: "fpp_status",
    receipt: "fpp_receipt",
  },
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this.keys[key] || key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(this.keys[key] || key, JSON.stringify(value));
    return value;
  },
  remove(key) {
    localStorage.removeItem(this.keys[key] || key);
  },
  resetPrototype() {
    Object.values(this.keys).forEach((k) => localStorage.removeItem(k));
    this.seedDemoData();
  },
  seedDemoData() {
    if (this.get("farmer")) return;
    const farmer = {
      name: "Ramesh Patel",
      aadhaar: "XXXX XXXX 4821",
      mobile: "98XXXXXX12",
      state: "Madhya Pradesh",
      district: "Bhopal",
      tehsil: "Berasia",
      village: "Berasia",
      verified: true,
    };
    const lands = [
      {
        id: "L101",
        state: "Madhya Pradesh",
        district: "Bhopal",
        tehsil: "Berasia",
        village: "Berasia",
        khasra: "101",
        area: 2.5,
        unit: "Acre",
        owner: "Ramesh Patel",
        relation: "Self",
        irrigation: "Tube Well",
        landType: "Irrigated",
        verified: true,
      },
      {
        id: "L205",
        state: "Madhya Pradesh",
        district: "Bhopal",
        tehsil: "Berasia",
        village: "Berasia",
        khasra: "205",
        area: 3,
        unit: "Acre",
        owner: "Ramesh Patel",
        relation: "Self",
        irrigation: "Canal",
        landType: "Irrigated",
        verified: true,
      },
    ];
    const farmerId = {
      id: "MP-BPL-FRM-2026-10245",
      createdAt: new Date().toISOString(),
      verified: true,
    };
    const procurement = {
      id: "PROC-K26-7842",
      season: "Kharif 2026",
      crop: "Paddy",
      landId: "L205",
      khasra: "205",
      registeredArea: 3,
      cultivatedArea: 3,
      eligibleQuantity: 60,
      harvestPeriod: "10 Oct – 25 Oct 2026",
      bankLast4: "3812",
    };
    const slot = {
      centreId: 1,
      centreName: "Berasia Procurement Centre",
      location: "Berasia Mandi Road, Bhopal",
      distance: "4.2 km",
      date: "2026-11-05",
    };
    const quantity = { min: 50, max: 60 };
    const queue = [
      {
        token: "P-018",
        minQuantity: 15,
        maxQuantity: 20,
        status: "processing",
      },
      { token: "P-019", minQuantity: 20, maxQuantity: 25, status: "waiting" },
      { token: "P-020", minQuantity: 10, maxQuantity: 15, status: "waiting" },
      { token: "P-021", minQuantity: 14, maxQuantity: 18, status: "waiting" },
      { token: "P-022", minQuantity: 8, maxQuantity: 12, status: "waiting" },
      { token: "P-023", minQuantity: 12, maxQuantity: 16, status: "waiting" },
      { token: "P-024", minQuantity: 15, maxQuantity: 20, status: "waiting" },
      { token: "P-025", minQuantity: 10, maxQuantity: 14, status: "waiting" },
      { token: "P-026", minQuantity: 9, maxQuantity: 13, status: "waiting" },
      {
        token: "P-027",
        minQuantity: 50,
        maxQuantity: 60,
        status: "booked",
        isUser: true,
      },
    ];
    const token = {
      number: "P-027",
      booked: true,
      bookedAt: new Date().toISOString(),
    };
    this.set("farmer", farmer);
    this.set("lands", lands);
    this.set("farmerId", farmerId);
    this.set("procurement", procurement);
    this.set("slot", slot);
    this.set("quantity", quantity);
    this.set("queue", queue);
    this.set("token", token);
    this.set("status", { index: 1 });
  },
};
window.Storage = Storage;
