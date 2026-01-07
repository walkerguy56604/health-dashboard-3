// =======================
// Config
// =======================
const DATA_URL = "./dailyLogs.json";
let dailyLogs = {};

const thresholds = {
  bloodPressure: { systolic: 130, diastolic: 80 },
  heartRate: { min: 60, max: 100 },
  glucose: { min: 70, max: 140 },
  weight: { min: 60, max: 80 },    // kg
  sleep: { min: 6, max: 8 },       // hours
  HRV: { min: 50, max: 100 },      // arbitrary units
  mood: ["😞", "😐", "🙂", "😃"]
};

// =======================
// Load JSON Data
// =======================
async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    dailyLogs = await res.json();
    populateDatePicker();
  } catch (err) {
    console.error("Error loading daily logs:", err);
    document.getElementById("dailySummaryOutput").innerHTML = "<p>Failed to load data</p>";
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
  if (dates.length > 0) render(dates[dates.length - 1]);
}

// =======================
// Trend helper
// =======================
function trendArrow(date, metric) {
  const dates = Object.keys(dailyLogs).sort();
  const idx = dates.indexOf(date);
  if (idx <= 0) return ""; // no previous day
  const prevValue = dailyLogs[dates[idx - 1]][metric];
  const currValue = dailyLogs[date][metric];
  if (currValue == null || prevValue == null) return "";
  if (currValue > prevValue) return "↑";
  if (currValue < prevValue) return "↓";
  return "→";
}

// =======================
// Color coding helper
// =======================
function colorValue(metric, value) {
  if (value === null || value === undefined) return "—";

  switch(metric) {
    case "heartRate":
      if (value < thresholds.heartRate.min) return `<span style="color:blue">${value}</span>`;
      if (value > thresholds.heartRate.max) return `<span style="color:red">${value}</span>`;
      return `<span style="color:green">${value}</span>`;
    case "glucose":
      if (value < thresholds.glucose.min) return `<span style="color:blue">${value}</span>`;
      if (value > thresholds.glucose.max) return `<span style="color:red">${value}</span>`;
      return `<span style="color:green">${value}</span>`;
    case "bloodPressure":
      const { systolic, diastolic } = value;
      if (systolic > thresholds.bloodPressure.systolic || diastolic > thresholds.bloodPressure.diastolic)
        return `<span style="color:red">${systolic}/${diastolic}</span>`;
      return `<span style="color:green">${systolic}/${diastolic}</span>`;
    case "weight":
      if (value < thresholds.weight.min) return `<span style="color:blue">${value}</span>`;
      if (value > thresholds.weight.max) return `<span style="color:red">${value}</span>`;
      return `<span style="color:green">${value}</span>`;
    case "sleep":
      if (value < thresholds.sleep.min) return `<span style="color:red">${value}</span>`;
      if (value > thresholds.sleep.max) return `<span style="color:blue">${value}</span>`;
      return `<span style="color:green">${value}</span>`;
    case "HRV":
      if (value < thresholds.HRV.min) return `<span style="color:red">${value}</span>`;
      if (value > thresholds.HRV.max) return `<span style="color:blue">${value}</span>`;
      return `<span style="color:green">${value}</span>`;
    case "mood":
      return `<span>${value ?? "—"}</span>`;
    default:
      return value;
  }
}

// =======================
// Render Dashboard
// =======================
function render(date) {
  const out = document.getElementById("dailySummaryOutput");
  const d = dailyLogs[date];
  if (!d) {
    out.innerHTML = "<p>No data</p>";
    return;
  }

  out.innerHTML = `
    <h3>${date}</h3>
    <div><b>Walk:</b> ${d.walk ?? "—"} min ${trendArrow(date, "walk")}</div>
    <div><b>Strength:</b> ${d.strength ?? "—"} min ${trendArrow(date, "strength")}</div>
    <div><b>Treadmill:</b> ${d.treadmill ?? "—"} min ${trendArrow(date, "treadmill")}</div>
    <div><b>Calories:</b> ${d.calories ?? "—"} ${trendArrow(date, "calories")}</div>
    <div><b>Heart Rate:</b> ${colorValue("heartRate", d.heartRate)} ${trendArrow(date, "heartRate")}</div>
    <div><b>Weight:</b> ${colorValue("weight", d.weight)} ${trendArrow(date, "weight")}</div>
    <div><b>Glucose:</b> ${colorValue("glucose", d.glucose)} ${trendArrow(date, "glucose")}</div>
    <div><b>Sleep:</b> ${colorValue("sleep", d.sleep)} ${trendArrow(date, "sleep")}</div>
    <div><b>HRV:</b> ${colorValue("HRV", d.HRV)} ${trendArrow(date, "HRV")}</div>
    <div><b>Mood:</b> ${colorValue("mood", d.mood)}</div>

    <h4>Blood Pressure</h4>
    ${
      d.bloodPressure.length
        ? d.bloodPressure.map(bp => `${colorValue("bloodPressure", bp)} (HR ${bp.heartRate}) – ${bp.note}`).join("<br>")
        : "No BP readings"
    }

    <h4>Notes</h4>
    ${
      d.notes.length
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
// Init
// =======================
loadData();
