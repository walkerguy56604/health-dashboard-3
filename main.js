// =======================
// Config
// =======================

// RAW GitHub JSON or local file path
// If using local: "./dailylogs.json"
// If using GitHub raw URL: "https://raw.githubusercontent.com/yourusername/yourrepo/main/dailylogs.json"
const DATA_URL = "./dailylogs.json";

let dailyLogs = {};

// =======================
// Load JSON Data
// =======================
async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    dailyLogs = await res.json();

    populateDatePicker();
  } catch (err) {
    console.error("Failed to load daily logs:", err);
    const out = document.getElementById("dailySummaryOutput");
    out.innerHTML = "<p style='color:red;'>Failed to load data. Check console for details.</p>";
  }
}

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

  // Show the most recent date by default
  if (dates.length > 0) {
    picker.value = dates[dates.length - 1];
    render(dates[dates.length - 1]);
  }
}

// =======================
// Render Dashboard
// =======================
function render(date) {
  const out = document.getElementById("dailySummaryOutput");
  const d = dailyLogs[date];

  if (!d) {
    out.innerHTML = "<p>No data available for this date.</p>";
    return;
  }

  out.innerHTML = `
    <h3>${date}</h3>

    <div><b>Walk:</b> ${d.walk} min</div>
    <div><b>Strength:</b> ${d.strength} min</div>
    <div><b>Treadmill:</b> ${d.treadmill} min</div>
    <div><b>Calories:</b> ${d.calories}</div>
    <div><b>Heart Rate:</b> ${d.heartRate ?? "—"}</div>

    <h4>Blood Pressure</h4>
    ${
      d.bloodPressure && d.bloodPressure.length
        ? d.bloodPressure
            .map(bp => `${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate}) – ${bp.note}`)
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
// Event Listener
// =======================
document.getElementById("datePicker").addEventListener("change", e => render(e.target.value));

// =======================
// Initialize
// =======================
loadData();
