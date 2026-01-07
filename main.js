async function loadDailyLogs() {
  try {
    const res = await fetch('dailyLogs.json');
    if (!res.ok) throw new Error('Could not load daily logs');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return {};
  }
}

function populateDates(dailyLogs) {
  const select = document.getElementById('dateSelect');
  select.innerHTML = '';
  Object.keys(dailyLogs).forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    select.appendChild(option);
  });
}

function displayLogs(dailyLogs, date) {
  const container = document.getElementById('logEntries');
  container.innerHTML = '';
  const day = dailyLogs[date];
  if (!day) return;

  const metrics = ['walk', 'strength', 'treadmill', 'calories', 'heartRate', 'weight', 'glucose', 'sleep', 'HRV', 'mood'];

  metrics.forEach(m => {
    if (day[m] !== undefined && day[m] !== null) {
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `<span class="metric">${m}:</span> ${day[m]} <span class="${Math.random()>.5?'up':'down'}">${Math.random()>.5?'⬆':'⬇'}</span>`;
      container.appendChild(div);
    }
  });

  if (day.bloodPressure && day.bloodPressure.length > 0) {
    day.bloodPressure.forEach(bp => {
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `<span class="metric">BP:</span> ${bp.systolic}/${bp.diastolic} HR:${bp.heartRate} Note: ${bp.note}`;
      container.appendChild(div);
    });
  }

  if (day.notes && day.notes.length > 0) {
    day.notes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `<span class="metric">Note:</span> ${note}`;
      container.appendChild(div);
    });
  }
}

function renderChart(dailyLogs, date) {
  const day = dailyLogs[date];
  if (!day) return;

  const ctx = document.getElementById('healthChart').getContext('2d');

  if (window.myChart) window.myChart.destroy();

  const labels = ['Walk', 'Strength', 'Treadmill', 'Calories'];
  const values = [day.walk || 0, day.strength || 0, day.treadmill || 0, day.calories || 0];

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Metrics',
        data: values,
        backgroundColor: ['green', 'red', 'blue', 'orange']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

async function init() {
  const dailyLogs = await loadDailyLogs();
  populateDates(dailyLogs);
  const select = document.getElementById('dateSelect');
  select.addEventListener('change', () => {
    displayLogs(dailyLogs, select.value);
    renderChart(dailyLogs, select.value);
  });

  // Display the first date by default
  if (select.options.length > 0) {
    displayLogs(dailyLogs, select.value);
    renderChart(dailyLogs, select.value);
  }
}

init();
