let dailyLogs = {};

fetch("dailyLogs.json")
  .then(response => response.json())
  .then(data => {
    dailyLogs = data;
    populateDates();
  })
  .catch(error => {
    console.error("Failed to load dailyLogs.json", error);
  });

function populateDates() {
  const select = document.getElementById("dateSelect");
  select.innerHTML = "";

  Object.keys(dailyLogs).forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    showLog(select.value);
  });

  // load first date automatically
  const firstDate = Object.keys(dailyLogs)[0];
  if (firstDate) {
    select.value = firstDate;
    showLog(firstDate);
  }
}

function showLog(date) {
  const log = dailyLogs[date];
  if (!log) return;

  document.getElementById("calories").textContent = log.calories ?? "—";
  document.getElementById("walk").textContent = log.walk ?? "—";
  document.getElementById("strength").textContent = log.strength ?? "—";
  document.getElementById("treadmill").textContent = log.treadmill ?? "—";
  document.getElementById("bp").textContent = log.bloodPressure ?? "—";
  document.getElementById("notes").textContent = log.notes ?? "—";
}
