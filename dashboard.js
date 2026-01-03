// =======================
// Dashboard Controller
// =======================
import { renderDailySummary, get7DayRolling } from './main.js';
import { dailyLogs } from './data/dailyLogs.js';

// ====== Elements ======
const datePicker = document.getElementById("datePicker");
const historyList = document.getElementById("historyList");
const trendCanvas = document.getElementById("trendChart");

// ====== Initialize Date Picker ======
const allDates = Object.keys(dailyLogs).sort();
const today = new Date().toISOString().split('T')[0];

// Set date picker to today (or latest available date)
datePicker.value = allDates.includes(today) ? today : allDates[allDates.length - 1];

// Render initial summary
renderDailySummary(datePicker.value);

// ====== Handle Date Picker Change ======
datePicker.addEventListener("change", (e) => {
  const selectedDate = e.target.value;
  renderDailySummary(selectedDate);
  updateTrendChart(selectedDate);
});

// ====== Render History Buttons ======
historyList.innerHTML = ""; // clear old content
allDates.slice().reverse().forEach(date => {
  const btn = document.createElement("button");
  btn.textContent = date;
  btn.addEventListener("click", () => {
    datePicker.value = date;
    renderDailySummary(date);
    updateTrendChart(date);
  });
  historyList.appendChild(btn);
});

// ====== Helper: Extract 7-Day Rolling Data for Chart ======
function getRollingDataset(metric) {
  return allDates.map(date => {
    const r = get7DayRolling(date);
    return r[metric] !== "—" ? Number(r[metric]) : null;
  });
}

// ====== Trend Chart ======
let trendChart = null;
function initTrendChart() {
  if (!trendCanvas) return;
  const ctx = trendCanvas.getContext("2d");
  trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: allDates,
      datasets: [
        {
          label: "BP Systolic (7-day avg)",
          data: getRollingDataset("bpSys"),
          borderColor: "red",
          fill: false,
          tension: 0.3
        },
        {
          label: "BP Diastolic (7-day avg)",
          data: getRollingDataset("bpDia"),
          borderColor: "orange",
          fill: false,
          tension: 0.3
        },
        {
          label: "Glucose (7-day avg)",
          data: getRollingDataset("glucose"),
          borderColor: "blue",
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: '7-Day Rolling Health Trends' }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}
initTrendChart();

// ====== Update Trend Chart Highlighting Today ======
function updateTrendChart(selectedDate) {
  if (!trendChart) return;

  trendChart.data.datasets.forEach(ds => {
    // Reset point background colors
    ds.pointBackgroundColor = ds.data.map(() => "transparent");
  });

  const todayIdx = allDates.indexOf(selectedDate);
  if (todayIdx !== -1) {
    trendChart.data.datasets.forEach(ds => {
      ds.pointBackgroundColor[todayIdx] = "limegreen"; // highlight today's point
      ds.pointRadius = 6;
    });
  }

  trendChart.update();
}

// Initialize with today highlighted
updateTrendChart(datePicker.value);

// ====== Optional: Future Updates ======
// You can add more metrics or interactions here
