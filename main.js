// main.js

// Path to your JSON file
const dailyLogsPath = 'dailyLogs.json';

let dailyLogs = {};
let barChart, lineChart;

// Load JSON data
async function loadDailyLogs() {
  try {
    const res = await fetch(dailyLogsPath);
    dailyLogs = await res.json();
    populateDateDropdown();
  } catch (err) {
    console.error("Failed to load daily logs:", err);
  }
}

// Populate date dropdown
function populateDateDropdown() {
  const select = document.getElementById('select-date');
  select.innerHTML = '';
  Object.keys(dailyLogs).forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    select.appendChild(option);
  });

  // Automatically select first date
  if (select.options.length > 0) {
    select.selectedIndex = 0;
    updateDashboard(select.value);
  }

  select.addEventListener('change', () => {
    updateDashboard(select.value);
  });
}

// Update dashboard for a given date
function updateDashboard(date) {
  const log = dailyLogs[date];

  if (!log) return;

  updateBarChart(log);
  updateLineChart(log);
  updateLogs(log);
}

// Bar Chart
function updateBarChart(log) {
  const ctx = document.getElementById('barChart').getContext('2d');

  const data = {
    labels: ['Walk', 'Strength', 'Treadmill', 'Calories'],
    datasets: [{
      label: 'Activity',
      data: [log.walk, log.strength, log.treadmill, log.calories],
      backgroundColor: ['green', 'red', 'blue', 'orange']
    }]
  };

  if (barChart) {
    barChart.data = data;
    barChart.update();
  } else {
    barChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

// Line Chart (for BP, HR, Weight, Glucose)
function updateLineChart(log) {
  const ctx = document.getElementById('lineChart').getContext('2d');

  // Placeholder arrays
  const bpSystolic = log.bloodPressure.map(bp => bp.systolic || 0);
  const bpDiastolic = log.bloodPressure.map(bp => bp.diastolic || 0);
  const hr = log.bloodPressure.map(bp => bp.heartRate || log.heartRate || 0);
  const weight = log.weight ? [log.weight] : [0];
  const glucose = log.glucose ? [log.glucose] : [0];

  const data = {
    labels: log.bloodPressure.map((_, i) => `Reading ${i + 1}`),
    datasets: [
      { label: 'Systolic', data: bpSystolic, borderColor: 'blue', fill: false },
      { label: 'Diastolic', data: bpDiastolic, borderColor: 'purple', fill: false },
      { label: 'Heart Rate', data: hr, borderColor: 'red', fill: false },
      { label: 'Weight', data: weight, borderColor: 'green', fill: false },
      { label: 'Glucose', data: glucose, borderColor: 'orange', fill: false }
    ]
  };

  if (lineChart) {
    lineChart.data = data;
    lineChart.update();
  } else {
    lineChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

// Update logs below chart
function updateLogs(log) {
  const container = document.getElementById('logEntries');
  container.innerHTML = '';

  // Blood Pressure Entries
  if (log.bloodPressure.length > 0) {
    log.bloodPressure.forEach((bp, i) => {
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `<span>BP Reading ${i + 1}:</span> ${bp.systolic}/${bp.diastolic} HR:${bp.heartRate} Note: ${bp.note || '-'}`;
      container.appendChild(div);
    });
  } else {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.textContent = 'No blood pressure recorded';
    container.appendChild(div);
  }

  // Notes
  if (log.notes.length > 0) {
    log.notes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `<span>Note:</span> ${note}`;
      container.appendChild(div);
    });
  }
}

// Initialize
window.addEventListener('DOMContentLoaded', loadDailyLogs);
