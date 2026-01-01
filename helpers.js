// helpers.js
export function getTotalWalkMinutes(dayLog) {
  if (!dayLog) return 0;

  let total = 0;

  if (dayLog.walk) total += dayLog.walk;
  if (dayLog.siriWalk) total += dayLog.siriWalk;
  if (dayLog.extraWalk) total += dayLog.extraWalk;

  return total;
}
