// Load JSON data dynamically
async function loadDailyLogs() {
  const res = await fetch('dailyLogs.json');
  const data = await res.json();
  return data;
}

// Colors for metrics
const metricColors = {
  walk: 'green',
  strength: 'red',
  treadmill: 'orange',
  calories: 'green',
  heartRate: 'blue',
  weight: 'purple',
  glucose: 'brown',
  sleep: 'teal',
  HRV: 'magenta',
  mood: 'gray'
};

let dailyLogs = {};

async function initDashboard() {
  dailyLogs = await loadDailyLogs();

  const dates = Object.keys(dailyLogs).sort();
  const selectDate = document.getElementById('selectDate');

  // Populate date selector
  dates.forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    selectDate.appendChild(option);
  });

  // Initial render
  renderCards(dates[dates.length - 1]);
  renderCharts(dates);
}

// Render metric cards with arrows
function renderCards(selectedDate) {
  const container = document.getElementById('cards');
  container.innerHTML = '';

  const dayData = dailyLogs[selectedDate];

  for (const key in dayData) {
    if (key === 'bloodPressure' || key === 'notes') continue;

    const value = dayData[key];
    let previousValue = getPreviousValue(selectedDate, key);

    const arrow = previousValue != null ? (value > previousValue ? '↑' : (value < previousValue ? '↓' : '→')) : '';
    const arrowClass = arrow === '↑' ? 'arrow-up' : arrow === '↓' ? 'arrow-down' : '';

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>${key}</div>
      <div class="metric" style="color:${metricColors[key] || 'black'}">
        ${value != null ? value : 'N/A'} <span class="${arrowClass}">${arrow}</span>
      </div>
    `;
    container.appendChild(card);
  }
}

// Helper to get previous day's value
function getPreviousValue(date, key) {
  const dates = Object.keys(dailyLogs).sort();
  const idx = dates.indexOf(date);
  if (idx > 0) {
    const prevData = dailyLogs[dates[idx - 1]];
    return prevData[key] != null ? prevData[key] : null;
  }
  return null;
}

// Render charts
function renderCharts(dates) {
  const trendCtx = document.getElementById('trendChart').getContext('2d');
  const barCtx = document.getElementById('barChart').getContext('2d');

  // Metrics for charts
  const chartMetrics = Object.keys(metricColors);

  // Line chart datasets
  const lineDatasets = chartMetrics.map(metric => ({
    label: metric,
    data: dates.map(date => dailyLogs[date][metric] != null ? dailyLogs[date][metric] : null),
    borderColor: metricColors[metric],
    backgroundColor: 'transparent',
    tension: 0.3
  }));

  // Destroy previous charts if they exist
  if (window.trendChartInstance) window.trendChartInstance.destroy();
  if (window.barChartInstance) window.barChartInstance.destroy();

  // Trend line chart
  window.trendChartInstance = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: lineDatasets
    },
    options: {
      responsive: true,
      plugins: { tooltip: { mode: 'index', intersect: false } },
      interaction: { mode: 'nearest', intersect: false },
      scales: { y: { beginAtZero: true } }
    }
  });

  // Bar chart for selected day
  const selectedDate = document.getElementById('selectDate').value || dates[dates.length - 1];
  const dayData = dailyLogs[selectedDate];
  const barData = chartMetrics.map(metric => dayData[metric] != null ? dayData[metric] : 0);

  window.barChartInstance = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: chartMetrics,
      datasets: [{
        label: selectedDate,
        data: barData,
        backgroundColor: chartMetrics.map(metric => metricColors[metric] || 'black')
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  // Update cards when date changes
  document.getElementById('selectDate').addEventListener('change', e => {
    renderCards(e.target.value);
    renderCharts(dates);
  });
}

// Initialize
initDashboard();
