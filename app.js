function renderDailySummary(date) {
  const dashboard = document.getElementById("dailySummaryOutput");
  dashboard.innerHTML = ""; // clear previous content

  const dayData = healthHistory[date];
  if (!dayData) {
    dashboard.innerHTML = `<p>No data for ${date}</p>`;
    return;
  }

  // --- Walks ---
  let totalWalkDuration = 0;
  let totalWalkDistance = 0;
  dayData.walks.forEach(w => {
    totalWalkDuration += w.duration;
    totalWalkDistance += w.distance || 0;
  });
  const walkDiv = document.createElement("div");
  walkDiv.textContent = `Walk Duration: ${totalWalkDuration} min (${totalWalkDistance.toFixed(2)} km)`;
  dashboard.appendChild(walkDiv);

  // --- Treadmill ---
  let totalTreadmillDuration = 0;
  let totalTreadmillDistance = 0;
  dayData.treadmill.forEach(t => {
    totalTreadmillDuration += t.duration;
    totalTreadmillDistance += t.distance || 0;
  });
  const treadmillDiv = document.createElement("div");
  treadmillDiv.textContent = `Treadmill Duration: ${totalTreadmillDuration} min (${totalTreadmillDistance.toFixed(2)} km)`;
  dashboard.appendChild(treadmillDiv);

  // --- Strength ---
  let totalReps = 0;
  dayData.strength.forEach(s => {
    s.exercises.forEach(ex => totalReps += ex.sets * ex.reps);
  });
  const totalStrengthExercises = dayData.strength.length;
  const strengthDiv = document.createElement("div");
  strengthDiv.textContent = `Strength Duration: ${totalReps} reps (${totalStrengthExercises} exercises)`;
  dashboard.appendChild(strengthDiv);

  // --- Blood Pressure ---
  dayData.bp.forEach((bp, i) => {
    const bpDiv = document.createElement("div");
    bpDiv.textContent = `BP ${i+1}: ${bp.systolic}/${bp.diastolic}/${bp.pulse} ${bp.category} ${bp.notes ? "- " + bp.notes : ""}`;
    dashboard.appendChild(bpDiv);
  });

  // --- Optional: Calories & Heart Rate if available ---
  let totalCalories = 0;
  let hrSum = 0, hrCount = 0;
  dayData.walks.concat(dayData.treadmill).forEach(act => {
    if (act.calories) totalCalories += act.calories;
    if (act.avgHR) { hrSum += act.avgHR; hrCount++; }
  });
  const caloriesDiv = document.createElement("div");
  caloriesDiv.textContent = `Calories Burned: ${totalCalories}`;
  dashboard.appendChild(caloriesDiv);
  const hrDiv = document.createElement("div");
  hrDiv.textContent = `Average Heart Rate: ${hrCount ? Math.round(hrSum / hrCount) : "N/A"}`;
  dashboard.appendChild(hrDiv);
}
