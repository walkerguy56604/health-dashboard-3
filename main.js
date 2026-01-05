// =======================
// Imports
// =======================
import { dailyLogs } from "./dailyLogs.js";

// =======================
// DOM Ready
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const datePicker = document.getElementById("datePicker");
  const output = document.getElementById("dailySummaryOutput");

  if (!datePicker) {
    output.innerHTML = "❌ datePicker element not found";
    return;
  }

  const dates = Object.keys(dailyLogs).sort();

  if (!dates.length) {
    output.innerHTML = "❌ dailyLogs loaded but contains no dates";
    return;
  }

  // Populate dropdown
  dates.forEach(date => {
    const opt = document.createElement("option");
    opt.value = date;
    opt.textContent = date;
    datePicker.appendChild(opt);
  });

  // =======================
  // Rolling Window Control
  // =======================
  function getRollingDays() {
    return 3; // rolling 3-day average
  }

  // =======================
  // Rolling Calculations
  // =======================
  function getRolling(date, days) {
    const keys = Object.keys(dailyLogs).sort();
    const end = keys.indexOf(date);
    const slice = keys.slice(Math.max(0, end - days + 1), end + 1);

    let totals = { walk: 0, strength: 0, treadmill: 0, calories: 0, hr: 0, bpSys: 0, bpDia: 0, count: 0 };

    slice.forEach(d => {
      const x = dailyLogs[d];
      totals.walk += x.walk ?? 0;
      totals.strength += x.strength ?? 0;
      totals.treadmill += x.treadmill ?? 0;
      totals.calories += x.calories ?? 0;
      totals.hr += x.heartRate ?? 0;
      totals.bpSys += x.bloodPressure?.length ? Math.round(x.bloodPressure.reduce((a,b)=>a+b.systolic,0)/x.bloodPressure.length) : 0;
      totals.bpDia += x.bloodPressure?.length ? Math.round(x.bloodPressure.reduce((a,b)=>a+b.diastolic,0)/x.bloodPressure.length) : 0;
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
  // Render Function
  // =======================
  function render(date) {
    const d = dailyLogs[date];
    if (!d) {
      output.innerHTML = `<h3>${date}</h3><div>No data</div>`;
      return;
    }

    const rollingDays = getRollingDays();
    const r = getRolling(date, rollingDays);

    // Blood pressure display
    let bpHTML = "<div>BP: —</div>";
    if (d.bloodPressure?.length) {
      bpHTML = "<div><strong>BP readings:</strong></div>";
      d.bloodPressure.forEach(bp => {
        bpHTML += `<div>${bp.systolic}/${bp.diastolic} HR: ${bp.heartRate} (${bp.note})</div>`;
      });
    }

    // Strength details display
    let strengthHTML = `<div>Strength: ${d.strength} min</div>`;
    if (d.strengthDetails?.length) {
      strengthHTML += "<div><strong>Details:</strong></div>";
      d.strengthDetails.forEach(s => {
        strengthHTML += `<div>${s.time} – ${s.exercises} (${s.duration} min, rest ${s.restAfter} min)</div>`;
      });
    }

    // Treadmill display
    let treadmillHTML = `<div>Treadmill: ${d.treadmill?.reduce((a,b)=>a+b.duration??0,0) ?? d.treadmill ?? 0} min</div>`;
    if (d.treadmill?.length) {
      treadmillHTML += "<div><strong>Sessions:</strong></div>";
      d.treadmill.forEach(t => {
        treadmillHTML += `<div>${t.time} – ${t.distance ?? 0} km, ${t.calories ?? 0} cal, avg HR: ${t.avgHR ?? "—"}, max HR: ${t.maxHR ?? "—"}</div>`;
      });
    }

    // Notes display
    let notesHTML = "";
    if (d.notes?.length) {
      notesHTML = "<div><strong>Notes:</strong></div>";
      d.notes.forEach(n => { notesHTML += `<div>${n}</div>`; });
    }

    // Output HTML
    output.innerHTML = `
      <h3>${date}</h3>

      <h4>Daily</h4>
      <div>Walk: ${d.walk ?? 0} min</div>
      ${strengthHTML}
      ${treadmillHTML}
      <div>Calories: ${d.calories ?? 0}</div>
      ${bpHTML}
      <div>Avg HR: ${d.heartRate ?? "—"}</div>
      ${notesHTML}

      <h4>${rollingDays}-Day Rolling Average</h4>
      <div>Walk: ${r.walk} min</div>
      <div>Strength: ${r.strength} min</div>
      <div>Treadmill: ${r.treadmill} min</div>
      <div>Calories: ${r.calories}</div>
      <div>BP: ${r.bpSys}/${r.bpDia}</div>
      <div>Avg HR: ${r.hr}</div>
    `;
  }

  // =======================
  // Initial render
  // =======================
  render(dates[0]);

  // =======================
  // Date picker change
  // =======================
  datePicker.addEventListener("change", e => render(e.target.value));
});
