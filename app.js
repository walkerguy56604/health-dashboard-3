// =======================
// Historical Data
// =======================
const dailyLogs = {
  "2024-10-29": {
    bloodPressure: [
      { systolic: 108, diastolic: 62, heartRate: 69, note: "IHB" },
      { systolic: 118, diastolic: 59, heartRate: 72, note: "IHB" }
    ],
    glucose: [],
    walk: 40,
    treadmill: 0,
    strength: 30,
    calories: 0,
    heartRate: 75
  },
  "2024-11-01": {
    bloodPressure: [
      { systolic: 114, diastolic: 65, heartRate: 77 },
      { systolic: 112, diastolic: 59, heartRate: 75 }
    ],
    glucose: [],
    walk: 30,
    treadmill: 0,
    strength: 30,
    calories: 0,
    heartRate: 76
  },
  "2024-11-04": {
    bloodPressure: [
      { systolic: 111, diastolic: 58, heartRate: 78 },
      { systolic: 122, diastolic: 68, heartRate: 76 }
    ],
    glucose: [{ value: 6.7 }],
    walk: 20,
    treadmill: 0,
    strength: 30,
    calories: 0,
    heartRate: 77
  },
  "2024-11-07": {
    bloodPressure: [],
    glucose: [{ value: 5.1 }],
    walk: 20,
    treadmill: 0,
    strength: 0,
    calories: 0,
    heartRate: 72
  },
  "2024-11-08": {
    bloodPressure: [
      { systolic: 112, diastolic: 61, heartRate: 77 },
      { systolic: 119, diastolic: 71, heartRate: 74 }
    ],
    glucose: [],
    walk: 25,
    treadmill: 0,
    strength: 30,
    calories: 0,
    heartRate: 75
  },
  "2024-11-11": {
    bloodPressure: [
      { systolic: 117, diastolic: 58, heartRate: 76 },
      { systolic: 132, diastolic: 69, heartRate: 76 }
    ],
    glucose: [{ value: 6 }],
    walk: 30,
    treadmill: 0,
    strength: 30,
    calories: 0,
    heartRate: 76
  },
  "2024-11-12": {
    bloodPressure: [],
    glucose: [{ value: 6.1, time: "morning" }],
    walk: 20,
    treadmill: 0,
    strength: 0,
    calories: 0,
    heartRate: 73
  },
  "2024-11-15": {
    bloodPressure: [
      { systolic: 118, diastolic: 69, heartRate: 83 },
      { systolic: 120, diastolic: 66, heartRate: 82 }
    ],
    glucose: [
      { value: 7.7, time: "5:00 AM" },
      { value: 4.6, time: "6:30 AM" }
    ],
    walk: 40,
    treadmill: 10,
    strength: 30,
    calories: 11,
    heartRate: 100
  }
};

// =======================
// Baseline
// =======================
const baselineDate = "2024-10-29";

// =======================
// BP helpers
// =======================
function getBPCategory(s, d) {
  if (s >= 140 || d >= 90) return "H";
  if (s >= 120 || d >= 80) return "M";
  return "L";
}

function getBPColor(cat) {
  return cat === "H" ? "red" : cat === "M" ? "orange" : "green";
}

// =======================
// 7-Day Rolling Averages
// =======================
function get7DayRolling(date) {
  const dates = Object.keys(dailyLogs).sort();
  const idx = dates.indexOf(date);
  if (idx === -1) return null;

  const window = dates.slice(Math.max(0, idx - 6), idx + 1);

  let sums = {
    sys: 0, dia: 0, bpCount: 0,
    glucose: 0, glucoseCount: 0,
    walk: 0, treadmill: 0,
    strength: 0, calories: 0,
    heartRate: 0, hrCount: 0
  };

  window.forEach(d => {
    const day = dailyLogs[d];

    day.bloodPressure.forEach(bp => {
      sums.sys += bp.systolic;
      sums.dia += bp.diastolic;
      sums.bpCount++;
    });

    day.glucose.forEach(g => {
      sums.glucose += g.value ?? g;
      sums.glucoseCount++;
    });

    if (day.walk) sums.walk += day.walk;
    if (day.treadmill) sums.treadmill += day.treadmill;
    if (day.strength) sums.strength += day.strength;
    if (day.calories) sums.calories += day.calories;
    if (day.heartRate) {
      sums.heartRate += day.heartRate;
      sums.hrCount++;
    }
  });

  return {
    bpSys: sums.bpCount ? (sums.sys / sums.bpCount).toFixed(1) : "—",
    bpDia: sums.bpCount ? (sums.dia / sums.bpCount).toFixed(1) : "—",
    glucose: sums.glucoseCount ? (sums.glucose / sums.glucoseCount).toFixed(1) : "—",
    walk: sums.walk,
    treadmill: sums.treadmill,
    strength: sums.strength,
    calories: sums.calories,
    heartRate: sums.hrCount ? (sums.heartRate / sums.hrCount).toFixed(0) : "—"
  };
}

// =======================
// Render Daily Summary
// =======================
function renderDailySummary(date) {
  const out = document.getElementById("dailySummaryOutput");
  const d = dailyLogs[date];
  if (!d) return;

  let html = `<h3>${date}</h3><h4>Blood Pressure</h4>`;

  d.bloodPressure.length
    ? d.bloodPressure.forEach((bp, i) => {
        const cat = getBPCategory(bp.systolic, bp.diastolic);
        html += `<div style="color:${getBPColor(cat)}">
          BP #${i+1}: ${bp.systolic}/${bp.diastolic} HR:${bp.heartRate} (${cat})
        </div>`;
      })
    : html += `<div>No BP recorded</div>`;

  html += `<h4>Glucose</h4>`;
  d.glucose.length
    ? d.glucose.forEach(g => html += `<div>${g.value ?? g} mmol/L</div>`)
    : html += `<div>No glucose</div>`;

  html += `
    <h4>Activity</h4>
    <div>Walk: ${d.walk} min</div>
    <div>Treadmill: ${d.treadmill} min</div>
    <div>Strength: ${d.strength} reps</div>
    <div>Calories: ${d.calories}</div>
    <div>Avg HR: ${d.heartRate}</div>
  `;

  const r = get7DayRolling(date);
  if (r) {
    html += `
      <h4>7‑Day Rolling Averages</h4>
      <div>BP: ${r.bpSys}/${r.bpDia}</div>
      <div>Glucose: ${r.glucose}</div>
      <div>Walk: ${r.walk} min</div>
      <div>Treadmill: ${r.treadmill} min</div>
      <div>Strength: ${r.strength} reps</div>
      <div>Calories: ${r.calories}</div>
      <div>Avg HR: ${r.heartRate}</div>
    `;
  }

  out.innerHTML = html;
}

// =======================
// Date Picker + History
// =======================
const picker = document.getElementById("datePicker");
const history = document.getElementById("historyList");

picker.addEventListener("change", e => {
  const date = e.target.value;
  renderDailySummary(date);

  if (![...history.children].some(b => b.dataset.date === date)) {
    const btn = document.createElement("button");
    btn.textContent = date;
    btn.dataset.date = date;
    btn.onclick = () => renderDailySummary(date);
    history.prepend(btn);
  }
});
