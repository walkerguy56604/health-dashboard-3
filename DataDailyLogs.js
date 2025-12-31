// =======================
// Daily Logs
// =======================
export const dailyLogs = {
  "2024-10-29": { 
    bloodPressure: [
      { systolic: 108, diastolic: 62, heartRate: 69, note: "IHB" },
      { systolic: 118, diastolic: 59, heartRate: 72, note: "IHB" }
    ], 
    glucose: [], 
    walk: 40, treadmill: 0, strength: 30, calories: 0, heartRate: 75 
  },
  "2024-11-01": { 
    bloodPressure: [
      { systolic: 114, diastolic: 65, heartRate: 77 },
      { systolic: 112, diastolic: 59, heartRate: 75 }
    ], 
    glucose: [], walk: 30, treadmill: 0, strength: 30, calories: 0, heartRate: 76 
  },
  "2024-11-04": { 
    bloodPressure: [
      { systolic: 111, diastolic: 58, heartRate: 78 },
      { systolic: 122, diastolic: 68, heartRate: 76 }
    ], 
    glucose: [{ value: 6.7 }], walk: 20, treadmill: 0, strength: 30, calories: 0, heartRate: 77 
  },
  "2024-11-07": { 
    bloodPressure: [], glucose: [{ value: 5.1 }], walk: 20, treadmill: 0, strength: 0, calories: 0, heartRate: 72 
  },
  "2024-11-08": { 
    bloodPressure: [
      { systolic: 112, diastolic: 61, heartRate: 77 },
      { systolic: 119, diastolic: 71, heartRate: 74 }
    ], 
    glucose: [], walk: 25, treadmill: 0, strength: 30, calories: 0, heartRate: 75 
  },
  "2024-11-11": { 
    bloodPressure: [
      { systolic: 117, diastolic: 58, heartRate: 76 },
      { systolic: 132, diastolic: 69, heartRate: 76 }
    ], 
    glucose: [{ value: 6 }], walk: 30, treadmill: 0, strength: 30, calories: 0, heartRate: 76 
  },
  "2024-11-12": { 
    bloodPressure: [], glucose: [{ value: 6.1, time: "morning" }], walk: 20, treadmill: 0, strength: 0, calories: 0, heartRate: 73 
  },
  "2024-11-15": { 
    bloodPressure: [
      { systolic: 118, diastolic: 69, heartRate: 83 },
      { systolic: 120, diastolic: 66, heartRate: 82 }
    ], 
    glucose: [
      { value: 7.7, time: "5:00 AM" },
      { value: 4.6, time: "6:30 AM" }
    ], 
    walk: 40, treadmill: 10, strength: 30, calories: 11, heartRate: 100 
  },
  "2024-11-16": { 
    bloodPressure: [
      { systolic: 125, diastolic: 71, heartRate: 91 }
    ], 
    glucose: [{ value: 6.3 }], walk: 35, treadmill: 15, strength: 20, calories: 12, heartRate: 92 
  },
  "2025-12-30": { 
    bloodPressure: [
      { systolic: 125, diastolic: 71, heartRate: 91 }
    ], 
    glucose: [], walk: 0, treadmill: 0, strength: 15, calories: 0, heartRate: 91 
  },
  // =======================
  // Today: 2025-12-31
  // =======================
  "2025-12-31": {
    bloodPressure: [
      { systolic: 130, diastolic: 69, heartRate: 80 },
      { systolic: 121, diastolic: 67, heartRate: 80 },
      { systolic: 144, diastolic: 75, heartRate: 87 }, // after strength
      { systolic: 137, diastolic: 72, heartRate: 86 }, // final post-strength
      { systolic: 132, diastolic: 73, heartRate: 86 }, // after treadmill
      { systolic: 128, diastolic: 68, heartRate: 85 }  // 2nd post treadmill
    ],
    glucose: [{ value: 5.4 }],
    walk: 10,       // morning walk
    treadmill: 10,  // treadmill
    strength: 12,   // reps from strength training
    calories: 12,   // treadmill calories
    heartRate: 141  // avg HR from treadmill
  }
};
