// =======================
// Daily Logs (Data)
// =======================

const dailyLogs = {
  "2026-01-02": {
    walk: 30,
    strength: 18,
    treadmill: 10,
    calories: 220,
    bp: { sys: 135, dia: 72 },
    hr: 110
  },
  "2026-01-03": {
    walk: 25,
    strength: 0,
    treadmill: 10,
    calories: 180,
    bp: { sys: 132, dia: 70 },
    hr: 105
  },
  "2026-01-05": {
    walk: 10,
    strength: 18,
    treadmill: 10,
    calories: 12,
    bp: { sys: 131, dia: 67 },
    hr: 138
  }
};

// =======================
// Rolling Window Control
// =======================

function getRollingDays() {
  return 3; // change to 7, 14, 30 later if you want
}

// =======================
// Rolling Calculations
// =======================

function getRolling(date, days) {
  const keys = Object.keys(dailyLogs).sort();
  const end = keys.indexOf(date);
  const slice = keys.slice(Math.max(0, end - days + 1), end + 1);

  let totals = {
    walk: 0,
    strength: 0,
    treadmill: 0,
    calories: 0,
    hr: 0,
    bpSys: 0,
    bpDia: 0,
    count: 0
  };

  slice.forEach(d => {
    const x = dailyLogs[d];
    totals.walk += x.walk ?? 0;
    totals.strength += x.strength ?? 0;
    totals.treadmill += x.treadmill ?? 0;
    totals.calories += x.calories ?? 0;
    totals.hr += x.hr ?? 0;
    totals.bpSys += x.bp?.sys ?? 0;
    totals.bpDia += x.bp?.dia ?? 0;
    totals.count++;
  });

  return {
    walk: totals.walk,
    strength: totals.strength,
    treadmill: totals.treadmill,
    calories: totals.calories,
    hr: Math.round(totals.hr / totals.count),
    bpSys: Math.round(totals.bpSys / totals.count),
    bpDia: Math.round(totals.bpDia / totals.count)
  };
}

// =======================
// Render (Display)
// =======================

function render(date) {
  const out = document.getElementById("output");

  if (!dailyLogs[date]) {
    out.innerHTML = `<h3>${date}</h3><div>No data logged</div>`;
    return;
  }

  const d = dailyLogs[date];
  const days = getRollingDays();
  const r = getRolling(date, days);

  out.innerHTML = `
    <h3>${date}</h3>

    <h4>Daily</h4>
    <div>Walk: ${d.walk} min</div>
    <div>Strength: ${d.strength} min</div>
    <div>Treadmill: ${d.treadmill} min</div>
    <div>Calories: ${d.calories}</div>
    <div>BP: ${d.bp.sys}/${d.bp.dia}</div>
    <div>HR: ${d.hr}</div>

    <h4>${days}-Day Rolling</h4>
    <div>Walk: ${r.walk} min</div>
    <div>Strength: ${r.strength} min</div>
    <div>Treadmill: ${r.treadmill} min</div>
    <div>Calories: ${r.calories}</div>
    <div>BP: ${r.bpSys}/${r.bpDia}</div>
    <div>Avg HR: ${r.hr}</div>
  `;
}

// =======================
// Hook Date Picker
// =======================

document.getElementById("datePicker").addEventListener("change", e => {
  render(e.target.value);
});
// Hook Date Picker and populate options
const datePicker = document.getElementById("datePicker");
const output = document.getElementById("dailySummaryOutput");

// Populate dropdown
Object.keys(dailyLogs).sort().forEach(date => {
  const opt = document.createElement("option");
  opt.value = date;
  opt.textContent = date;
  datePicker.appendChild(opt);
});

// Render initially
render(Object.keys(dailyLogs).sort()[0]);

// Handle change
datePicker.addEventListener("change", e => {
  render(e.target.value);
});
