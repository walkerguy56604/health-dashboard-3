export const dailyLogs = {
  "2026-01-01": {
    bloodPressure: [
      { systolic: 117, diastolic: 69, heartRate: 88, note: "Morning, pre-exercise, low hypertension" },
      { systolic: 135, diastolic: 71, heartRate: 88, note: "5 min after treadmill/strength training, high hypertension" }
      // We'll add your post-strength BP here once you take it
    ],
    glucose: [
      { value: 6.4, time: "08:15" } // morning glucose test
    ],
    walk: 45,       // outside walk including treadmill
    treadmill: 10,  // 10 min treadmill
    strength: {
      lateral: [3,3,3],
      biceps: [3,3,3,10],
      duration: 14   // minutes
    },
    calories: 11,   // calories burned during treadmill (we can add strength calories later)
    heartRate: 111  // average HR from treadmill session
  }
};
