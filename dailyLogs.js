export const dailyLogs = {
  "2026-01-01": {
    bloodPressure: [
      { systolic: 117, diastolic: 69, heartRate: 88, note: "Early morning after Siri walk, low hypertension" },
      { systolic: 128, diastolic: 71, heartRate: 93, note: "After treadmill 5-min wait, medium hypertension" },
      { systolic: 135, diastolic: 71, heartRate: 88, note: "After morning strength training 5-min wait, high hypertension" }
      // afternoon BP can be added later
    ],
    glucose: [
      { value: 6.4, time: "morning" }
    ],
    walk: [
      { time: "early morning", duration: 5, type: "Siri walk" },
      { time: "morning", duration: 40, type: "regular walk including treadmill" }
    ],
    treadmill: 10,  // treadmill minutes
    strength: [
      { time: "morning", duration: 10, type: "general" },
      { time: "afternoon", duration: 14, details: { lateral: 3, biceps: 3 } }
    ],
    calories: 11, // treadmill calories
    heartRate: 103 // treadmill average HR
  }
};
