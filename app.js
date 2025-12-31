async function loadHealthData() {
  try {
    const res = await fetch('/.netlify/functions/netlify-functions-health');
    const data = await res.json();

    const dailySummaryOutput = document.getElementById('dailySummaryOutput');
    dailySummaryOutput.innerHTML = `
      <h3>Daily Summary for ${data.date}</h3>
      <div>Walk Duration: ${data.walk.minutes} min (${data.walk.distance_km} km)</div>
      <div>Treadmill Duration: ${data.treadmill.minutes} min @ ${data.treadmill.speed}</div>
      <div>Strength: ${data.strength.exercises.join(', ')}</div>
      <div>BP: ${data.blood_pressure.systolic}/${data.blood_pressure.diastolic} (${data.blood_pressure.label})</div>
    `;
  } catch (err) {
    console.error('Failed to load health data:', err);
  }
}

// Call the function
loadHealthData();
