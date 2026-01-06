// =======================
// Config
// =======================

const DATA_URL = "PASTE_YOUR_RAW_JSON_URL_HERE";

let dailyLogs = {};

// =======================
// Init
// =======================

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

// =======================
// Fetch JSON
// =======================

async function fetchData() {
  try {
    const res = await fetch(DATA_URL);
    dailyLogs = await res.json();

    populateDatePicker();
  } catch (err) {
    console.error("Failed to load JSON", err);
  }
}

// =======================
// Date Picker
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
    render(picker.value);
  }

  picker.addEventListener("change", e => {
    render(e.target.value);
  });
}

// =======================
// Render
// =======================

function render(date) {
  const out = document.getElementById("output");
  const d = dailyLogs[date];

  if (!d) {
    out.innerHTML = `<h3>${date}</h3><div>No data</div>`;
    return;
  }

  const bp = d.bloodPressure?.[0];

  out.innerHTML = `
    <h3>${date}</h3>

    <h4>Activity</h4>
    <div>Walk: ${d.walk ?? 0} min</div>
    <div>Strength: ${d.strength ?? 0} min</div>
    <div>Treadmill: ${d.treadmill ?? 0} min</div>
    <div>Calories: ${d.calories ?? 0}</div>

    <h4>Vitals</h4>
    <div>Heart Rate: ${d.heartRate ?? "—"}</div>
    <div>Blood Pressure: ${
      bp ? `${bp.systolic}/${bp.diastolic}` : "—"
    }</div>

    <h4>Notes</h4>
    <ul>
      ${(d.notes || []).map(n => `<li>${n}</li>`).join("")}
    </ul>
  `;
}
