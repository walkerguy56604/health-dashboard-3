// main.js

// Load JSON daily logs
async function loadDailyLogs() {
  try {
    const response = await fetch('dailyLogs.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading daily logs:', error);
    return {};
  }
}

// Populate the date dropdown
function populateDates(dailyLogs) {
  const dateSelect = document.getElementById('date-select');
  Object.keys(dailyLogs).forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    dateSelect.appendChild(option);
  });
  // Trigger update for the first date
  if (Object.keys(dailyLogs).length > 0) {
    updateDashboard(Object.keys(dailyLogs)[0], dailyLogs);
  }
}

// Update the dashboard when a date is selected
function updateDashboard(selectedDate, dailyLogs) {
  const statsContainer = document.getElementById('daily-stats');
  statsContainer.innerHTML = ''; // Clear previous stats

  const dayData = dailyLogs[selectedDate];
  if (!dayData) return;

  // Display main stats
  ['walk', 'strength', 'treadmill', 'calories', 'heartRate'].forEach(key => {
    const statDiv = document.createElement('div');
    statDiv.className = 'stat';
    const value = dayData[key] !== null && dayData[key] !== undefined ? dayData[key] : 'N/A';
    statDiv.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
    statsContainer.appendChild(statDiv);
  });

  // Display blood pressure readings
  if (dayData.bloodPressure && dayData.bloodPressure.length > 0) {
    dayData.bloodPressure.forEach((bp, index) => {
      const bpDiv = document.createElement('div');
      bpDiv.className = 'stat';
      bpDiv.textContent = `BP ${index + 1}: ${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate}) - ${bp.note || ''}`;
      statsContainer.appendChild(bpDiv);
    });
  }

  // Render chart
  renderChart(dayData);
}

// Render bar chart using Chart.js
let healthChart = null;
function renderChart(dayData) {
  const ctx = document.getElementById('healthChart').getContext('2d');

  const labels = ['Walk', 'Strength', 'Treadmill', 'Calories', 'Heart Rate'];
  const values = [
    dayData.walk || 0,
    dayData.strength || 0,
    dayData.treadmill || 0,
    dayData.calories || 0,
    dayData.heartRate || 0
  ];

  if (healthChart) healthChart.destroy(); // Destroy previous chart

  healthChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Daily Metrics',
        data: values,
        backgroundColor: ['green', 'red', 'orange', 'blue', 'purple']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Main
async function init() {
  const dailyLogs = await loadDailyLogs();
  populateDates(dailyLogs);

  document.getElementById('date-select').addEventListener('change', (e) => {
    updateDashboard(e.target.value, dailyLogs);
  });
}

// Run
init();
