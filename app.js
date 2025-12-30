console.log("Health Dashboard 3 is alive 👊");

// =======================
// In-memory store
// =======================
const healthData = {
  walks: [],
  treadmill: [],
  strength: [],
  bp: []
};

// =======================
// Timestamp helper
// =======================
function now() {
  return new Date().toISOString();
}

// =======================
// Log activities
// =======================
function logWalk(date, durationMinutes, distanceKm = 0, avgHR = null, maxHR = null, calories = 0, speed = 0) {
  const entry = { date, durationMinutes, distanceKm, avgHR, maxHR, calories, speed };
  healthData.walks.push(entry);
  console.log("Walk logged:", entry);
}

function logTreadmill(date, durationMinutes, distanceKm = 0, avgHR = null, maxHR = null, calories = 0, speed = 0) {
  const entry = { date, durationMinutes, distanceKm, avgHR, maxHR, calories, speed };
  healthData.treadmill.push(entry);
  console.log("Treadmill logged:", entry);
}

function logStrength(date, exercises = []) {
  const entry = { date, exercises };
  healthData.strength.push(entry);
  console.log("Strength session logged:", entry);
}

// =======================
// Log blood pressure
// =======================
function logBP(date, systolic, diastolic, pulse, tag = "") {
  const entry = { date, systolic, diastolic, pulse, tag };
  healthData.bp.push(entry);
  console.log("BP logged:", entry);
}

// =======================
// Daily Summary
// =======================
function getDailySummary(date) {
  const summary = {
    walkDuration: 0,
    treadmillDuration: 0,
    strengthDuration: 0,
    walkDistance: 0,
    treadmillDistance: 0,
    strengthExercises: 0,
    caloriesBurned: 0,
    avgHeartRate: null
  };

  let hrSum = 0, hrCount = 0;

  healthData.walks.forEach(w => {
    if (w.date === date) {
      summary.walkDuration += w.durationMinutes;
      summary.walkDistance += w.distanceKm;
      summary.caloriesBurned += w.calories;
      if (w.avgHR) { hrSum += w.avgHR; hrCount++; }
    }
  });

  healthData.treadmill.forEach(t => {
    if (t.date === date) {
      summary.treadmillDuration += t.durationMinutes;
      summary.treadmillDistance += t.distanceKm;
      summary.caloriesBurned += t.calories;
      if (t.avgHR) { hrSum += t.avgHR; hrCount++; }
    }
  });

  healthData.strength.forEach(s => {
    if (s.date === date) {
      summary.strengthDuration += s.exercises.reduce((acc, ex) => acc + (ex.sets * ex.reps), 0); // total reps as duration proxy
      summary.strengthExercises += s.exercises.length;
    }
  });

  summary.avgHeartRate = hrCount ? Math.round(hrSum / hrCount) : "N/A";
  return summary;
}

// =======================
// Button listener
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const dailyBtn = document.getElementById("dailySummaryBtn");
  const outputDiv = document.getElementById("dailySummaryOutput");

  dailyBtn.addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    const summary = getDailySummary(today);

    outputDiv.innerHTML = `
      <h3>Daily Summary for ${today}</h3>
      <p><strong>Walk Duration:</strong> ${summary.walkDuration} min (${summary.walkDistance} km)</p>
      <p><strong>Treadmill Duration:</strong> ${summary.treadmillDuration} min (${summary.treadmillDistance} km)</p>
      <p><strong>Strength Duration:</strong> ${summary.strengthDuration} reps (${summary.strengthExercises} exercises)</p>
      <p><strong>Calories Burned:</strong> ${summary.caloriesBurned}</p>
      <p><strong>Average Heart Rate:</strong> ${summary.avgHeartRate}</p>
    `;
  });
});

// =======================
// Example usage (delete later)
// =======================
logWalk("2025-12-29", 5, 0.2, 107, 117, 12, 1.4);
logTreadmill("2025-12-29", 10, 0.24, 107, 119, 12, 1.4);
logStrength("2025-12-29", [
  { name: "biceps", sets: 3, reps: 10 },
  { name: "laterals", sets: 3, reps: 10 }
]);
logBP("2025-12-29", 122, 67, 90, "M Hypertension");

console.log("Current Health Data:", healthData);
