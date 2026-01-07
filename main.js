// main.js

// Load daily logs
async function loadDailyLogs() {
  const response = await fetch('dailyLogs.json');
  const logs = await response.json();
  return logs;
}

// Function to generate trend arrow
function trendArrow(value, previous) {
  if (previous === null || previous === undefined) return '';
  if (value > previous) return '↑';
  if (value < previous) return '↓';
  return '→';
}

// Function to render daily metrics
function renderDailyMetrics(logs) {
  const container = document.getElementById('dashboard');
  container.innerHTML = '';

  const dates = Object.keys(logs).sort();
  let prev = {};

  dates.forEach(date => {
    const day = logs[date];
    const div = document.createElement('div');
    div.className = 'daily-entry';
    
    const walkArrow = trendArrow(day.walk, prev.walk);
    const strengthArrow = trendArrow(day.strength, prev.strength);
    const treadmillArrow = trendArrow(day.treadmill, prev.treadmill);
    const caloriesArrow = trendArrow(day.calories, prev.calories);
    const hrArrow = trendArrow(day.heartRate, prev.heartRate);

    div.innerHTML = `
      <h3>${date}</h3>
      <p><span style="color:green;">Walk: ${day.walk} ${walkArrow}</span></p>
      <p><span style="color:red;">Strength: ${day.strength} ${strengthArrow}</span></p>
      <p><span style="color:blue;">Treadmill: ${day.treadmill} ${treadmillArrow}</span></p>
      <p><span style="color:orange;">Calories: ${day.calories} ${caloriesArrow}</span></p>
      <p><span style="color:purple;">Heart Rate: ${day.heartRate || '—'} ${hrArrow}</span></p>
      <p><span style="color:blue;">Blood Pressure: ${
        day.bloodPressure.length > 0
          ? day.bloodPressure.map(bp => `${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate}) • ${bp.note}`).join(' • ')
          : 'No readings'
      }</span></p>
      <p>Weight: ${day.weight || '—'}</p>
      <p>Glucose: ${day.glucose || '—'}</p>
      <p>Sleep: ${day.sleep || '—'}</p>
      <p>HRV: ${day.HRV || '—'}</p>
      <p>Mood: ${day.mood || '—'}</p>
      <hr/>
    `;

    container.appendChild(div);

    // Save current metrics for trend comparison
    prev = {
      walk: day.walk,
      strength: day.strength,
      treadmill: day.treadmill,
      calories: day.calories,
      heartRate: day.heartRate
    };
  });
}

// Initialize dashboard
async function initDashboard() {
  const logs = await loadDailyLogs();
  renderDailyMetrics(logs);
}

initDashboard();
