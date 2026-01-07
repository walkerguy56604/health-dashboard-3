// Main JS for Health Dashboard with Arrows
(async function() {
  const dailyLogsUrl = `dailyLogs.json?v=${Date.now()}`; // Cache-busting

  let dailyLogs = {};
  try {
    const res = await fetch(dailyLogsUrl);
    dailyLogs = await res.json();
  } catch (err) {
    console.error("Failed to load dailyLogs.json:", err);
    return;
  }

  const dateSelect = document.getElementById("dateSelect");
  const metricsCard = document.getElementById("metricsCard");

  // Sort dates ascending
  const dates = Object.keys(dailyLogs).sort((a,b)=> new Date(a) - new Date(b));

  // Populate dropdown
  dates.forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    dateSelect.appendChild(option);
  });

  function getArrow(current, previous) {
    if(previous === undefined) return ""; 
    if(current > previous) return "⬆️"; 
    if(current < previous) return "⬇️"; 
    return "➡️";
  }

  function renderMetrics(date) {
    const dayIndex = dates.indexOf(date);
    const prevDay = dates[dayIndex - 1] ? dailyLogs[dates[dayIndex - 1]] : {};
    const day = dailyLogs[date];

    metricsCard.innerHTML = ""; // Clear previous

    const metrics = [
      { key: "walk", label: "Walk", color: "green" },
      { key: "strength", label: "Strength", color: "red" },
      { key: "treadmill", label: "Treadmill", color: "green" },
      { key: "calories", label: "Calories", color: "green" },
      { key: "heartRate", label: "Heart Rate", color: "blue" },
      { key: "weight", label: "Weight", color: "blue" },
      { key: "glucose", label: "Glucose", color: "blue" },
      { key: "sleep", label: "Sleep", color: "blue" },
      { key: "HRV", label: "HRV", color: "blue" },
      { key: "mood", label: "Mood", color: "blue" }
    ];

    metrics.forEach(m => {
      if(day[m.key] !== undefined && day[m.key] !== null) {
        const div = document.createElement("div");
        div.classList.add("metric", m.color);
        div.innerHTML = `<span>${m.label}:</span> ${day[m.key]} ${getArrow(day[m.key], prevDay[m.key])}`;
        metricsCard.appendChild(div);
      }
    });

    if(day.bloodPressure && day.bloodPressure.length) {
      day.bloodPressure.forEach((bp, idx) => {
        const prevBP = prevDay.bloodPressure ? prevDay.bloodPressure[idx] : {};
        const div = document.createElement("div");
        div.classList.add("metric", "blue");
        const systolicArrow = getArrow(bp.systolic, prevBP.systolic);
        const diastolicArrow = getArrow(bp.diastolic, prevBP.diastolic);
        div.textContent = `BP: ${bp.systolic}/${bp.diastolic} ${systolicArrow}${diastolicArrow} HR:${bp.heartRate} (${bp.note || ""})`;
        metricsCard.appendChild(div);
      });
    }

    if(day.notes && day.notes.length) {
      day.notes.forEach(note => {
        const div = document.createElement("div");
        div.classList.add("metric");
        div.textContent = `Note: ${note}`;
        metricsCard.appendChild(div);
      });
    }
  }

  // Initialize default
  const defaultDate = dates[dates.length - 1];
  dateSelect.value = defaultDate;
  renderMetrics(defaultDate);

  dateSelect.addEventListener("change", e => {
    renderMetrics(e.target.value);
  });
})();
