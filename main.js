// =======================
// main.js
// =======================

// Load the daily logs JSON
async function loadDailyLogs() {
  try {
    const response = await fetch("dailyLogs.json"); // Ensure this is your JSON file
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

  // Helper function for colored values
  const colorValue = (label, value) => {
    if (value === null || value === undefined) return `<span>${label}: —</span>`;
    const color = typeof value === "number" && value > 100 ? "red" : "green"; // example
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

// Initialize
(async function init() {
  const dailyLogs = await loadDailyLogs();
  populateDatePicker(dailyLogs);
  document.getElementById("datePicker").addEventListener("change", e => renderDashboard(dailyLogs, e.target.value));
})();
