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

// Your daily logs (example for 2025-12-30)
const dailyLogs = {
  '2025-12-30': {
    walk: 40,
    treadmill: 10,
    strength: 30,
    calories: 22,
    heartRate: 103,
    bloodPressure: { systolic: 131, diastolic: 74, iHB: 95 }
  }
};

// Function to determine color based on comparison
function getBPColor(systolic, diastolic) {
  if (systolic < 120 && diastolic < 80) return 'green';
  if (systolic <= 139 || diastolic <= 89) return 'yellow';
  return 'red';
}

// Render daily summary with Oct 29 comparison
function renderDailySummary(date) {
  const dailySummaryOutput = document.getElementById('dailySummaryOutput');
  const summary = dailyLogs[date] || {
    walk: 0, treadmill: 0, strength: 0, calories: 0, heartRate: 'N/A',
    bloodPressure: { systolic: 0, diastolic: 0, iHB: 0 }
  };

  const bpColor = getBPColor(summary.bloodPressure.systolic, summary.bloodPressure.diastolic);

  dailySummaryOutput.innerHTML = `
    <h3>Daily Summary for ${date}</h3>
    <div>Walk Duration: ${summary.walk} min</div>
    <div>Treadmill Duration: ${summary.treadmill} min</div>
    <div>Strength Duration: ${summary.strength} reps</div>
    <div>Calories Burned: ${summary.calories}</div>
    <div>Average Heart Rate: ${summary.heartRate}</div>
    <div>
      <strong>Blood Pressure:</strong> 
      <span style="color:${bpColor};">
        ${summary.bloodPressure.systolic}/${summary.bloodPressure.diastolic}/${summary.bloodPressure.iHB} 
        ${bpColor === 'green' ? 'N' : bpColor === 'yellow' ? 'M' : 'H'}
      </span>
      &nbsp;<em>(Oct 29: ${referenceDay.bloodPressure.systolic}/${referenceDay.bloodPressure.diastolic}/${referenceDay.bloodPressure.iHB})</em>
    </div>
  `;
}

// History list logic
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
