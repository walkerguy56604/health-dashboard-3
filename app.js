console.log("Health Dashboard 3 is alive 👊");

/* =========================
   Health Dashboard 3
   Core App Skeleton
   ========================= */

/* ---- In-memory store (later can save to JSON/CSV) ---- */
const healthData = {
  walks: [],
  treadmill: [],
  strength: [],
  bp: []
};

/* ---- Utility: timestamp ---- */
function now() {
  return new Date().toISOString();
}

/* ---- Log a walk ---- */
function logWalk(durationMinutes, notes = "") {
  healthData.walks.push({
    time: now(),
    duration_minutes: durationMinutes,
    notes
  });
}

/* ---- Log treadmill ---- */
function logTreadmill({
  duration,
  distance,
  speed,
  calories,
  avgHR,
  maxHR,
  notes = ""
}) {
  healthData.treadmill.push({
    time: now(),
    duration,
    distance,
    speed,
    calories,
    avgHR,
    maxHR,
    notes
  });
}

/* ---- Log strength training ---- */
function logStrength({
  start,
  end,
  exercises,
  notes = ""
}) {
  healthData.strength.push({
    start,
    end,
    exercises,
    notes
  });
}

/* ---- Log blood pressure ---- */
function logBP(systolic, diastolic, pulse, tag = "") {
  healthData.bp.push({
    time: now(),
    systolic,
    diastolic,
    pulse,
    tag
  });
}

/* ---- Debug helper ---- */
function showData() {
  console.log("Health Dashboard 3 Data:", healthData);
}

/* ---- Example usage (safe to delete later) ---- */
// logWalk(5, "Short walk after strength training");
// logBP(128, 67, 96, "post-strength");
