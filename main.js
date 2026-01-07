// =======================
// Daily Logs
// =======================
const dailyLogs = {
  "2026-01-02": {
    walk: 0, strength: 29, treadmill: 20, calories: 22, heartRate: 92,
    weight: 180, glucose: 95, HRV: 50, mood: 3,
    bloodPressure: [
      { systolic: 127, diastolic: 57, heartRate: 91, note: "Post AM strength" },
      { systolic: 128, diastolic: 72, heartRate: 97, note: "Post treadmill" },
      { systolic: 136, diastolic: 67, heartRate: 93, note: "Post PM strength" },
      { systolic: 116, diastolic: 64, heartRate: 92, note: "Post PM treadmill" }
    ],
    notes: []
  },
  "2026-01-03": {
    walk: 5, strength: 0, treadmill: 0, calories: 0, heartRate: null,
    weight: 181, glucose: 98, HRV: 48, mood: 4,
    bloodPressure: [], notes: ["Morning 5-minute walk, non-Siri"]
  },
  "2026-01-04": {
    walk: 35, strength: 30, treadmill: 10, calories: 12, heartRate: 102,
    weight: 179, glucose: 96, HRV: 52, mood: 4,
    bloodPressure: [{ systolic: 132, diastolic: 80, heartRate: 66, note: "Post strength training" }],
    notes: ["Morning Siri walk", "Afternoon treadmill"]
  },
  "2026-01-05": {
    walk: 10, strength: 18, treadmill: 10, calories: 160, heartRate: 85,
    weight: 180, glucose: 100, HRV: 50, mood: 3,
    bloodPressure: [
      { systolic: 139, diastolic: 70, heartRate: 84, note: "Post strength" },
      { systolic: 131, diastolic: 67, heartRate: 85, note: "Post treadmill" }
    ],
    notes: ["Morning Siri walk", "Morning non-Siri walk"]
  }
};

// =======================
// Populate Date Picker
// =======================
function populateDatePicker() {
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
    renderSummary(picker.value);
    updateChart();
  }
}

// =======================
// Render Daily Summary
// =======================
function renderSummary(date) {
  const out = document.getElementById("dailySummaryOutput");
  const d = dailyLogs[date];
  if (!d) {
    out.innerHTML = "<p>No data</p>";
    return;
  }

  // Calculate average BP and HR if readings exist
  let avgBP = "No BP readings";
  let avgHR = "—";
  if (d.bloodPressure.length) {
    const totalSystolic = d.bloodPressure.reduce((sum, bp) => sum + bp.systolic, 0);
    const totalDiastolic = d.bloodPressure.reduce((sum, bp) => sum + bp.diastolic, 0);
    const totalHR = d.bloodPressure.reduce((sum, bp) => sum + bp.heartRate, 0);
    const count = d.bloodPressure.length;
    avgBP = `${(totalSystolic / count).toFixed(0)}/${(totalDiastolic / count).toFixed(0)}`;
    avgHR = (totalHR / count).toFixed(0);
  }

  out.innerHTML = `
    <h3>${date}</h3>
    <div><b>Walk:</b> ${d.walk ?? "—"} min</div>
    <div><b>Strength:</b> ${d.strength ?? "—"} min</div>
    <div><b>Treadmill:</b> ${d.treadmill ?? "—"} min</div>
    <div><b>Calories:</b> ${d.calories ?? "—"}</div>
    <div><b>Heart Rate:</b> ${d.heartRate ?? "—"}</div>
    <div><b>Weight:</b> ${d.weight ?? "—"} lbs</div>
    <div><b>Glucose:</b> ${d.glucose ?? "—"} mg/dL</div>
    <div><b>HRV:</b> ${d.HRV ?? "—"}</div>
    <div><b>Mood:</b> ${d.mood ?? "—"}</div>

    <h4>Blood Pressure</h4>
    ${d.bloodPressure.length 
        ? d.bloodPressure.map(bp => `${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate}) – ${bp.note}`).join("<br>")
        : "No BP readings"
    }
    <div><b>Avg BP:</b> ${avgBP} (HR ${avgHR})</div>

    <h4>Notes</h4>
    ${d.notes.length ? d.notes.map(n => `• ${n}`).join("<br>") : "No notes"}
  `;
}

// =======================
// Chart Setup
// =======================
const ctx = document.getElementById("healthChart").getContext("2d");
let healthChart = new Chart(ctx, {
  type: "line",
  data: { labels: [], datasets: [] },
  options: {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: true } }
  }
});

function updateChart() {
  const dates = Object.keys(dailyLogs).sort();
  const metrics = ["walk","strength","treadmill","calories","heartRate","weight","glucose","HRV","mood"];
  const colors = ["green","red","orange","lime","blue","purple","brown","pink","cyan"];
  const datasets = metrics.map((metric,i) => ({
    label: metric,
    data: dates.map(d => dailyLogs[d][metric] ?? 0),
    borderColor: colors[i],
    backgroundColor: colors[i],
    tension: 0.3,
    fill: false
  }));
  
  healthChart.data.labels = dates;
  healthChart.data.datasets = datasets;
  healthChart.update();
}

// =======================
// Event Listener
// =======================
document.getElementById("datePicker").addEventListener("change", e => {
  renderSummary(e.target.value);
  updateChart();
});

// =======================
// Initialize
// =======================
populateDatePicker();
