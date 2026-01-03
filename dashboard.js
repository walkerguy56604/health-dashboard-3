// =======================
// Dashboard Controller
// =======================
import { renderDailySummary } from './main.js';
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
});

// ====== Render History Buttons ======
historyList.innerHTML = ""; // clear any old content
allDates.slice().reverse().forEach(date => {
  const btn = document.createElement("button");
  btn.textContent = date;
  btn.addEventListener("click", () => {
    datePicker.value = date;
    renderDailySummary(date);
  });
  historyList.appendChild(btn);
});

// ====== Optional: Trend Chart Setup ======
let trendChart = null;
if (trendCanvas) {
  const ctx = trendCanvas.getContext("2d");
  trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: allDates,
      datasets: [
        {
          label: "Systolic BP",
          data: allDates.map(d => dailyLogs[d].bloodPressure.length ? dailyLogs[d].bloodPressure[0].systolic : null),
          borderColor: "red",
          fill: false
        },
        {
          label: "Diastolic BP",
          data: allDates.map(d => dailyLogs[d].bloodPressure.length ? dailyLogs[d].bloodPressure[0].diastolic : null),
          borderColor: "orange",
          fill: false
        },
        {
          label: "Glucose",
          data: allDates.map(d => dailyLogs[d].glucose.length ? (dailyLogs[d].glucose[0].value ?? dailyLogs[d].glucose[0]) : null),
          borderColor: "blue",
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Health Trends (placeholder)' }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

// ====== Optional: Future Updates ======
// You can dynamically update trendChart.data and call trendChart.update() whenever needed
