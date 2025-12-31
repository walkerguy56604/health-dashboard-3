// data/dailyLogs.js
export const dailyLogs = {
  "2024-10-29": {
    bloodPressure: [
      { systolic: 108, diastolic: 62, heartRate: 69, note: "IHB" },
      { systolic: 118, diastolic: 59, heartRate: 72, note: "IHB" }
    ],
    glucose: [],
    walk: 40,
    treadmill: 0,
    strength: 30,
    calories: 0,
    heartRate: 75
  },
  "2024-11-01": {
    bloodPressure: [
      { systolic: 114, diastolic: 65, heartRate: 77 },
      { systolic: 112, diastolic: 59, heartRate: 75 }
    ],
    glucose: [],
    walk: 30,
    treadmill: 0,
    strength: 30,
    calories: 0,
    heartRate: 76
  },
  "2024-11-04": {
    bloodPressure: [
      { systolic: 111, diastolic: 58, heartRate: 78 },
      { systolic: 122, diastolic: 68, heartRate: 76 }
    ],
    glucose: [{ value: 6.7 }],
    walk: 20,
    treadmill: 0,
    strength: 30,
    calories: 0,
    heartRate: 77
  },
  // =======================
  // Today example
  // =======================
  "2025-12-31": {
    bloodPressure: [
      { systolic: 130, diastolic: 69, heartRate: 80 },
      { systolic: 121, diastolic: 67, heartRate: 80 },
      { systolic: 144, diastolic: 75, heartRate: 87 } // after strength training
    ],
    glucose: [{ value: 5.4 }],
    walk: 5,
    treadmill: 10,
    strength: 16,
    calories: 12,
    heartRate: 85
  }
};
