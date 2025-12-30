// Health Dashboard 3 - Core App Skeleton with Oct 29 Comparison
// Date: 2025-12-30

const healthData = {
  dailyLogs: [], // Daily log objects: { date, walk, treadmill, strength, calories, avgHR, maxHR, bp }
  oct29Reference: {
    walk: 14,
    treadmill: 10,
    strength: 6,
    calories: 120,
    avgHR: 90,
    maxHR: 120,
    bp: { systolic: 122, diastolic: 67, pulse: 90 }
  }
};

// ----- Utilities -----
function formatDate(date) { return date.toISOString().split('T')[0]; }

function getHRZone(avgHR) {
  if (avgHR < 100) return 'green';
  if (avgHR < 140) return 'yellow';
  return 'red';
}

function getComparisonColor(value, reference) {
  if (value > reference) return 'green';   // Better than Oct29
  if (value < reference) return 'red';     // Worse than Oct29
  return 'gray';                            // Same as Oct29
}

// ----- Rolling 7-Day Summary -----
function getRolling7DaySummary() {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const logs = healthData.dailyLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= sevenDaysAgo && logDate <= today;
  });

  const summary = { walk: 0, treadmill: 0, strength: 0, calories: 0, avgHR: 0, maxHR: 0, bp: { systolic:0, diastolic:0, pulse:0 }, count: logs.length };

  logs.forEach(log => {
    summary.walk += log.walk || 0;
    summary.treadmill += log.treadmill || 0;
    summary.strength += log.strength || 0;
    summary.calories += log.calories || 0;
    summary.avgHR += log.avgHR || 0;
    summary.maxHR = Math.max(summary.maxHR, log.maxHR || 0);
    summary.bp.systolic += log.bp?.systolic || 0;
    summary.bp.diastolic += log.bp?.diastolic || 0;
    summary.bp.pulse += log.bp?.pulse || 0;
  });

  if (summary.count > 0) {
    summary.avgHR = Math.round(summary.avgHR / summary.count);
    summary.bp.systolic = Math.round(summary.bp.systolic / summary.count);
    summary.bp.diastolic = Math.round(summary.bp.diastolic / summary.count);
    summary.bp.pulse = Math.round(summary.bp.pulse / summary.count);
  }

  return summary;
}

// ----- Render Dashboard -----
function renderDashboard() {
  const container = document.getElementById('dashboard');
  container.innerHTML = '';

  const latestLog = healthData.dailyLogs[healthData.dailyLogs.length - 1] || {};

  // --- Daily Summary ---
  const dailyDiv = document.createElement('div');
  dailyDiv.innerHTML = `
    <h2>Daily Summary for ${latestLog.date || 'N/A'}</h2>
    <p>Walk Duration: <span style="color:${getComparisonColor(latestLog.walk || 0, healthData.oct29Reference.walk)}">${latestLog.walk || 0} min</span></p>
    <p>Treadmill Duration: <span style="color:${getComparisonColor(latestLog.treadmill || 0, healthData.oct29Reference.treadmill)}">${latestLog.treadmill || 0} min</span></p>
    <p>Strength Duration: <span style="color:${getComparisonColor(latestLog.strength || 0, healthData.oct29Reference.strength)}">${latestLog.strength || 0} reps</span></p>
    <p>Calories Burned: <span style="color:${getComparisonColor(latestLog.calories || 0, healthData.oct29Reference.calories)}">${latestLog.calories || 0}</span></p>
    <p>Average Heart Rate: <span style="color:${getComparisonColor(latestLog.avgHR || 0, healthData.oct29Reference.avgHR)}">${latestLog.avgHR || 'N/A'}</span></p>
    <p>Blood Pressure: <span style="color:${getComparisonColor(latestLog.bp?.systolic || 0, healthData.oct29Reference.bp.systolic)}">${latestLog.bp?.systolic || 'N/A'}/${latestLog.bp?.diastolic || 'N/A'} (${latestLog.bp?.pulse || 'N/A'})</span></p>
  `;
  container.appendChild(dailyDiv);

  // --- 7-Day Summary ---
  const weekly = getRolling7DaySummary();
  const weeklyDiv = document.createElement('div');
  weeklyDiv.innerHTML = `
    <h2>Rolling 7-Day Summary</h2>
    <p>Total Walk: <span style="color:${getComparisonColor(weekly.walk, healthData.oct29Reference.walk)}">${weekly.walk} min</span></p>
    <p>Total Treadmill: <span style="color:${getComparisonColor(weekly.treadmill, healthData.oct29Reference.treadmill)}">${weekly.treadmill} min</span></p>
    <p>Total Strength: <span style="color:${getComparisonColor(weekly.strength, healthData.oct29Reference.strength)}">${weekly.strength} reps</span></p>
    <p>Total Calories: <span style="color:${getComparisonColor(weekly.calories, healthData.oct29Reference.calories)}">${weekly.calories}</span></p>
    <p>Average HR: <span style="color:${getComparisonColor(weekly.avgHR, healthData.oct29Reference.avgHR)}">${weekly.avgHR}</span></p>
    <p>Average BP: <span style="color:${getComparisonColor(weekly.bp.systolic, healthData.oct29Reference.bp.systolic)}">${weekly.bp.systolic}/${weekly.bp.diastolic} (${weekly.bp.pulse})</span></p>
  `;
  container.appendChild(weeklyDiv);

  // --- Monthly Summary ---
  const monthlyDiv = document.createElement('div');
  monthlyDiv.innerHTML = `<h2>Monthly Summary</h2><p>Coming soon...</p>`;
  container.appendChild(monthlyDiv);

  // --- Oct 29 Comparison ---
  const compareDiv = document.createElement('div');
  compareDiv.innerHTML = `<h2>Comparison to Oct 29, 2025</h2><p>See colored indicators above in daily and 7-day summaries.</p>`;
  container.appendChild(compareDiv);
}

// ----- Initial Render -----
renderDashboard();
