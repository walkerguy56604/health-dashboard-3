console.log("✅ dashboard.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const out = document.getElementById("dailySummaryOutput");
  if (!out) {
    console.error("❌ dailySummaryOutput not found");
    return;
  }

  out.innerHTML = `
    <h3>Netlify Test</h3>
    <div>If you see this, JS is working.</div>
  `;
});
