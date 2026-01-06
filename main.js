out.innerHTML = `
  <h3>${date}</h3>
  <div><b>Walk:</b> ${d.walk} min</div>
  <div><b>Strength:</b> ${d.strength} min</div>
  <div><b>Treadmill:</b> ${d.treadmill} min</div>
  <div><b>Calories:</b> ${d.calories}</div>
  <div><b>Heart Rate:</b> ${d.heartRate ?? "—"}</div>
  <div><b>Weight:</b> ${d.weight ?? "—"} lbs</div>

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
