// =======================
// Daily Logs (Embedded)
// =======================
const dailyLogs = {
  "2026-01-02": {
    "walk": 0,
    "strength": 29,
    "treadmill": 20,
    "calories": 22,
    "heartRate": 92,
    "bloodPressure": [
      { "systolic": 127, "diastolic": 57, "heartRate": 91, "note": "Post AM strength" },
      { "systolic": 128, "diastolic": 72, "heartRate": 97, "note": "Post treadmill" },
      { "systolic": 136, "diastolic": 67, "heartRate": 93, "note": "Post PM strength" },
      { "systolic": 116, "diastolic": 64, "heartRate": 92, "note": "Post PM treadmill" }
    ],
    "notes": []
  },
  "2026-01-03": {
    "walk": 5,
    "strength": 0,
    "treadmill": 0,
    "calories": 0,
    "heartRate": null,
    "bloodPressure": [],
    "notes": [
      "Morning 5-minute walk, non-Siri"
    ]
  },
  "2026-01-04": {
    "walk": 35,
    "strength": 30,
    "treadmill": 10,
    "calories": 12,
    "heartRate": 102,
    "bloodPressure": [
      { "systolic": 132, "diastolic": 80, "heartRate": 66, "note": "Post strength training" }
    ],
    "notes": [
      "Morning Siri walk",
      "Afternoon treadmill"
    ]
  },
  "2026-01-05": {
    "walk": 10,
    "strength": 18,
    "treadmill": 10,
    "calories": 160,
    "heartRate": 85,
    "bloodPressure": [
      { "systolic": 139, "diastolic": 70, "heartRate": 84, "note": "Post strength" },
      { "systolic": 131, "diastolic": 67, "heartRate": 85, "note": "Post treadmill" }
    ],
    "notes": [
      "Morning Siri walk",
      "Morning non-Siri walk"
    ]
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
    render(picker.value);
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

    <div><b>Walk:</b> ${d.walk} min</div>
    <div><b>Strength:</b> ${d.strength} min</div>
    <div><b>Treadmill:</b> ${d.treadmill} min</div>
    <div><b>Calories:</b> ${d.calories}</div>
    <div><b>Heart Rate:</b> ${d.heartRate ?? "—"}</div>

    <h4>Blood Pressure</h4>
    ${
      d.bloodPressure.length
        ? d.bloodPressure
            .map(bp => `${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate}) – ${bp.note}`)
            .join("<br>")
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
// Event Listeners
// =======================
document
  .getElementById("datePicker")
  .addEventListener("change", e => render(e.target.value));

// =======================
// Initialize
// =======================
populateDatePicker();
