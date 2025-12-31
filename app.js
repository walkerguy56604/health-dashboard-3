// Reference day: Oct 29
const referenceDay = {
  date: '2025-10-29',
  walk: 0,
  treadmill: 0,
  strength: 30,  // 3×10
  calories: 0,
  heartRate: 'N/A',
  bloodPressure: { systolic: 102, diastolic: 62, iHB: 75 }
};

// Example daily logs
const dailyLogs = {
  function ensureDailyLog(date) {
  if (!dailyLogs[date]) {
    dailyLogs[date] = {
      walk: 0,
      treadmill: 0,
      strength: 0,
      calories: 0,
      heartRate: 0,
      bloodPressure: {
        systolic: 0,
        diastolic: 0,
        iHB: 0
      }
    };
  }
}
  '2025-12-30': {
    walk: 40,
    treadmill: 10,
    strength: 30,
    calories: 22,
    heartRate: 103,
    bloodPressure: { systolic: 131, diastolic: 74, iHB: 95 }
  }
};

// Helper: determine color based on value vs reference
function getColor(value, reference, lowerBetter = false) {
  if (typeof value === 'number' && typeof reference === 'number') {
    if ((lowerBetter && value <= reference) || (!lowerBetter && value >= reference)) return 'green';
    if ((lowerBetter && value <= reference * 1.2) || (!lowerBetter && value <= reference * 1.2)) return 'yellow';
    return 'red';
  }
  return 'black'; // fallback
}

function getBPColor(systolic, diastolic) {
  if (systolic < 120 && diastolic < 80) return 'green';
  if (systolic <= 139 || diastolic <= 89) return 'yellow';
  return 'red';
}

// Render daily summary
function renderDailySummary(date) {
  const dailySummaryOutput = document.getElementById('dailySummaryOutput');
  const summary = dailyLogs[date] || {
    walk: 0, treadmill: 0, strength: 0, calories: 0, heartRate: 0,
    bloodPressure: { systolic: 0, diastolic: 0, iHB: 0 }
  };

  const walkColor = getColor(summary.walk, referenceDay.walk);
  const treadmillColor = getColor(summary.treadmill, referenceDay.treadmill);
  const strengthColor = getColor(summary.strength, referenceDay.strength);
  const caloriesColor = getColor(summary.calories, referenceDay.calories);
  const hrColor = getColor(summary.heartRate, referenceDay.heartRate, true); // lower better
  const bpColor = getBPColor(summary.bloodPressure.systolic, summary.bloodPressure.diastolic);

  dailySummaryOutput.innerHTML = `
    <h3>Daily Summary for ${date}</h3>
    <div>Walk Duration: <span style="color:${walkColor}">${summary.walk} min</span> (Ref: ${referenceDay.walk})</div>
    <div>Treadmill Duration: <span style="color:${treadmillColor}">${summary.treadmill} min</span> (Ref: ${referenceDay.treadmill})</div>
    <div>Strength Duration: <span style="color:${strengthColor}">${summary.strength} reps</span> (Ref: ${referenceDay.strength})</div>
    <div>Calories Burned: <span style="color:${caloriesColor}">${summary.calories}</span> (Ref: ${referenceDay.calories})</div>
    <div>Average Heart Rate: <span style="color:${hrColor}">${summary.heartRate}</span> (Ref: ${referenceDay.heartRate})</div>
    <div>
      <strong>Blood Pressure:</strong> 
      <span style="color:${bpColor};">
        ${summary.bloodPressure.systolic}/${summary.bloodPressure.diastolic}/${summary.bloodPressure.iHB} 
        ${bpColor === 'green' ? 'N' : bpColor === 'yellow' ? 'M' : 'H'}
      </span>
      &nbsp;<em>(Ref: ${referenceDay.bloodPressure.systolic}/${referenceDay.bloodPressure.diastolic}/${referenceDay.bloodPressure.iHB})</em>
    </div>
  `;
}

// History list & date picker
const historyList = document.getElementById('historyList');
const datePicker = document.getElementById('datePicker');

datePicker.addEventListener('change', (e) => {
  const selectedDate = e.target.value;
  renderDailySummary(selectedDate);

  if (![...historyList.children].some(btn => btn.dataset.date === selectedDate)) {
    const btn = document.createElement('button');
    btn.textContent = selectedDate;
    btn.dataset.date = selectedDate;
    btn.addEventListener('click', () => renderDailySummary(selectedDate));
    historyList.prepend(btn); // newest on top
  }
});
// Helper: get last 7 days from a given date
function getLast7Days(date) {
  const result = [];
  const current = new Date(date);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(current);
    d.setDate(current.getDate() - i);
    result.push(d.toISOString().split('T')[0]);
  }
  return result;
}

// Render 7-day rolling summary
function render7DaySummary(endDate) {
  const dailySummaryOutput = document.getElementById('dailySummaryOutput');
  const last7 = getLast7Days(endDate);
  
  let html = `<h3>7-Day Rolling Summary ending ${endDate}</h3><table border="1" style="border-collapse:collapse;width:100%;text-align:center;">
    <tr>
      <th>Date</th><th>Walk</th><th>Treadmill</th><th>Strength</th><th>Calories</th><th>HR</th><th>BP</th>
    </tr>`;
  
  last7.forEach(date => {
    const summary = dailyLogs[date] || {
      walk: 0, treadmill: 0, strength: 0, calories: 0, heartRate: 0,
      bloodPressure: { systolic: 0, diastolic: 0, iHB: 0 }
    };

    const walkColor = getColor(summary.walk, referenceDay.walk);
    const treadmillColor = getColor(summary.treadmill, referenceDay.treadmill);
    const strengthColor = getColor(summary.strength, referenceDay.strength);
    const caloriesColor = getColor(summary.calories, referenceDay.calories);
    const hrColor = getColor(summary.heartRate, referenceDay.heartRate, true);
    const bpColor = getBPColor(summary.bloodPressure.systolic, summary.bloodPressure.diastolic);

    html += `<tr>
      <td>${date}</td>
      <td style="color:${walkColor}">${summary.walk}</td>
      <td style="color:${treadmillColor}">${summary.treadmill}</td>
      <td style="color:${strengthColor}">${summary.strength}</td>
      <td style="color:${caloriesColor}">${summary.calories}</td>
      <td style="color:${hrColor}">${summary.heartRate}</td>
      <td style="color:${bpColor}">${summary.bloodPressure.systolic}/${summary.bloodPressure.diastolic}/${summary.bloodPressure.iHB}</td>
    </tr>`;
  });

  html += `</table>`;
  dailySummaryOutput.innerHTML = html;
}

// Optional: call 7-day summary when date is selected
datePicker.addEventListener('change', (e) => {
  const selectedDate = e.target.value;
  render7DaySummary(selectedDate);
});
