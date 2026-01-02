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
"2026-01-01": {
  bloodPressure: [
    { systolic: 117, diastolic: 69, heartRate: 88, note: "Early morning, low hypertension" },
    { systolic: 135, diastolic: 71, heartRate: 88, note: "5 min after AM treadmill/strength, high hypertension" },
    { systolic: 128, diastolic: 71, heartRate: 93, note: "5 min after PM treadmill, medium hypertension" }
  ],
  glucose: [
    { value: 6.4, note: "Early morning test" }
  ],
  walk: [
    { type: "Siri walk", duration: 5, note: "Early morning" },
    { type: "Non-Siri walk", duration: 40, note: "AM session" }
  ],
  treadmill: [
    { start: "10:35", end: "10:45", speed: 1.4, distance: 0.24, avgHR: 111, maxHR: 182, calories: 11, note: "AM session" },
    { start: "17:15", end: "17:25", speed: 1.4, distance: 0.24, avgHR: 103, maxHR: 157, calories: 11, note: "PM session" }
  ],
  strength: [
    { start: "10:46", end: "11:00", lateral: 3, biceps: 3, reps: 10, note: "AM session" },
    { start: "16:02", end: "16:16", lateral: 3, biceps: 3, reps: 10, note: "PM session" }
  ]
};
