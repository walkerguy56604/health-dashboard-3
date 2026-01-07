// =======================
// main.js with graphs
// =======================

// Load the daily logs JSON
async function loadDailyLogs() {
  try {
    const response = await fetch("dailyLogs.json");
    if (!response.ok) throw new Error("Failed to load dailyLogs.json");
    return await response.json();
  } catch (err) {
    console.error(err);
    return {};
  }
}

// Populate the date picker
function populateDatePicker(dailyLogs) {
  const picker = document.getElementById("datePicker");
  picker.innerHTML = "";
  const dates = Object.keys(dailyLogs).sort();
  dates.forEach(date => {
    const opt = document.createElement("option");
    opt.value = date;
    opt.textContent = date;
    picker.appendChild(opt);
  });

  if (dates.length > 0) {
    picker.value = dates[dates.length - 1];
    renderDashboard(dailyLogs, picker.value);
    renderCharts(dailyLogs);
  }
}

// Render the dashboard
function renderDashboard(dailyLogs, date) {
  const out = document.getElementById("dailySummaryOutput");
  const d = dailyLogs[date];

  if (!d) {
    out.innerHTML = "<p>No data available for this date.</p>";
    return;
  }

  const colorValue = (label, value) => {
    if (value === null || value === undefined) return `<span>${label}: —</span>`;
    const color = typeof value === "number" && value > 100 ? "red" : "green";
    return `<span style="color:${color}"><b>${label}:</b> ${value}</span>`;
  };

  out.innerHTML = `
    <h3>${date}</h3>
    <div>${colorValue("Walk (min)", d.walk)}</div>
    <div>${colorValue("Strength (min)", d.strength)}</div>
    <div>${colorValue("Treadmill (min)", d.treadmill)}</div>
    <div>${colorValue("Calories", d.calories)}</div>
    <div>${colorValue("Heart Rate", d.heartRate)}</div>
    <div>${colorValue("Weight", d.weight)}</div>
    <div>${colorValue("Glucose", d.glucose)}</div>
    <div>${colorValue("Sleep (hrs)", d.sleep)}</div>
    <div>${colorValue("HRV", d.hrv)}</div>
    <div>${colorValue("Mood", d.mood)}</div>

    <h4>Blood Pressure</h4>
    ${
      d.bloodPressure && d.bloodPressure.length
        ? d.bloodPressure
            .map(bp => `<span style="color:blue">${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate}) – ${bp.note}</span>`)
            .join("<br>")
        : "No BP readings"
    }

    <h4>Notes</h4>
    ${
      d.notes && d.notes.length
        ? d.notes.map(n => `• ${n}`).join("<br>")
        : "No notes"
    }
  `;
}

// =======================
// Render Charts
// =======================
function renderCharts(dailyLogs) {
  const dates = Object.keys(dailyLogs).sort();
  const metrics = ["walk", "strength", "treadmill", "calories", "heartRate", "weight", "glucose", "sleep", "hrv"];
  
  // Prepare data for metrics chart
  const metricDataSets = metrics.map(metric => ({
    label: metric,
    data: dates.map(date => dailyLogs[date][metric] ?? null),
    borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    fill: false,
    tension: 0.2
  }));

  const metricsCtx = document.getElementById("metricsChart").getContext("2d");
  new Chart(metricsCtx, {
    type: "line",
    data: {
      labels: dates,
      datasets: metricDataSets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { mode: "index", intersect: false }
      },
      interaction: { mode: "nearest", axis: "x", intersect: false },
      scales: { y: { beginAtZero: true } }
    }
  });

  // Prepare data for blood pressure chart
  const systolicData = dates.map(date => {
    const bps = dailyLogs[date].bloodPressure;
    return bps.length ? bps[bps.length - 1].systolic : null;
  });
  const diastolicData = dates.map(date => {
    const bps = dailyLogs[date].bloodPressure;
    return bps.length ? bps[bps.length - 1].diastolic : null;
  });

  const bpCtx = document.getElementById("bpChart").getContext("2d");
  new Chart(bpCtx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        { label: "Systolic", data: systolicData, borderColor: "red", fill: false },
        { label: "Diastolic", data: diastolicData, borderColor: "blue", fill: false }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" }, tooltip: { mode: "index" } },
      interaction: { mode: "nearest", axis: "x", intersect: false },
      scales: { y: { beginAtZero: false } }
    }
  });
}

// =======================
// Initialize
// =======================
(async function init() {
  const dailyLogs = await loadDailyLogs();
  populateDatePicker(dailyLogs);
  document.getElementById("datePicker").addEventListener("change", e => renderDashboard(dailyLogs, e.target.value));
})();
