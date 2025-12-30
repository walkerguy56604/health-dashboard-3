// ------------------------------
// Health Dashboard 3 - Core App
// ------------------------------

// In-memory store (later saved to JSON/CSV)
const healthData = {
  dailySummary: {
    date: "2025-12-30",
    walkDuration: 0,   // minutes
    walkDistance: 0,   // km
    treadmillDuration: 0, // minutes
    treadmillDistance: 0, // km
    strengthDuration: 0, // reps
    strengthExercises: 0,
    caloriesBurned: 0,
    avgHeartRate: null
  },
  bloodPressure: [],
  walks: [],
  treadmill: [],
  strength: []
};

// ------------------------------
// Functions to update dashboard
// ------------------------------

function updateDailySummary() {
  const dashDiv = document.getElementById('dashboard');
  if (!dashDiv) return;

  const summary = healthData.dailySummary;
  dashDiv.innerHTML = `
    <h2>Daily Summary for ${summary.date}</h2>
    <p>Walk Duration: ${summary.walkDuration} min (${summary.walkDistance} km)</p>
    <p>Treadmill Duration: ${summary.treadmillDuration} min (${summary.treadmillDistance} km)</p>
    <p>Strength Duration: ${summary.strengthDuration} reps (${summary.strengthExercises} exercises)</p>
    <p>Calories Burned: ${summary.caloriesBurned}</p>
    <p>Average Heart Rate: ${summary.avgHeartRate || "N/A"}</p>
  `;
}

function addBloodPressure(systolic, diastolic, heartRate, type) {
  healthData.bloodPressure.push({ systolic, diastolic, heartRate, type, time: new Date() });
}

function addWalk(duration, distance, calories, avgHR, maxHR) {
  healthData.walks.push({ duration, distance, calories, avgHR, maxHR, time: new Date() });
  healthData.dailySummary.walkDuration += duration;
  healthData.dailySummary.walkDistance += distance;
}

function addTreadmill(duration, distance, calories, avgHR, maxHR) {
  healthData.treadmill.push({ duration, distance, calories, avgHR, maxHR, time: new Date() });
  healthData.dailySummary.treadmillDuration += duration;
  healthData.dailySummary.treadmillDistance += distance;
}

function addStrength(reps, exercises, calories, avgHR) {
  healthData.strength.push({ reps, exercises, calories, avgHR, time: new Date() });
  healthData.dailySummary.strengthDuration += reps;
  healthData.dailySummary.strengthExercises += exercises;
}

function logMessage(msg) {
  // Display message in a dashboard log (create div#log in HTML if needed)
  const logDiv = document.getElementById('log');
  if (logDiv) {
    const p = document.createElement('p');
    p.textContent = msg;
    logDiv.appendChild(p);
  } else {
    console.log(msg);
  }
}

// ------------------------------
// Iframe Section for Platforms
// ------------------------------

function setupIframes() {
  const platformsDiv = document.getElementById('platforms');
  if (!platformsDiv) return;

  const platformUrls = [
    { name: "Cloudflare", url: "https://dash.cloudflare.com/" },
    { name: "Netlify", url: "https://app.netlify.com/" }
    // Add more platforms here if needed
  ];

  platformUrls.forEach(p => {
    const wrapper = document.createElement('div');
    wrapper.style.margin = "10px 0";
    wrapper.style.border = "1px solid #000";

    const label = document.createElement('p');
    label.textContent = p.name;
    label.style.fontWeight = "bold";

    const iframe = document.createElement('iframe');
    iframe.src = p.url;
    iframe.width = "100%";
    iframe.height = "300px";
    iframe.style.border = "none";

    wrapper.appendChild(label);
    wrapper.appendChild(iframe);
    platformsDiv.appendChild(wrapper);
  });
}

// Optional: toggle iframe visibility for debugging
function togglePlatforms() {
  const pf = document.getElementById('platforms');
  if (pf) pf.style.display = pf.style.display === 'none' ? 'block' : 'none';
}

// ------------------------------
// Initialize Dashboard
// ------------------------------

document.addEventListener('DOMContentLoaded', () => {
  updateDailySummary();
  setupIframes();
  logMessage("Dashboard loaded");
});
