// =======================
// Import Daily Logs
// =======================
import { dailyLogs } from './data/dailyLogs.js';

// =======================
// Pre-fill Today's Entries
// =======================
const today = "2025-12-31";
if (!dailyLogs[today]) dailyLogs[today] = { bloodPressure: [], glucose: [], walk:0, treadmill:0, strength:0, calories:0, heartRate:0 };

// Add sample entries for today
dailyLogs[today].bloodPressure.push(
  { systolic: 130, diastolic: 69, heartRate: 80 },
  { systolic: 121, diastolic: 67, heartRate: 80 },
  { systolic: 144, diastolic: 75, heartRate: 87 },
  { systolic: 137, diastolic: 72, heartRate: 86 },
  { systolic: 125, diastolic: 59, heartRate: 88 }
);
dailyLogs[today].glucose.push({ value: 5.4 });

// =======================
// Helpers
// =======================
const baselineDate = "2024-10-29";

function getBPCategory(s,d){ if(s>=140||d>=90)return"H"; if(s>=120||d>=80)return"M"; return"L"; }
function getBPColor(cat){ return cat==="H"?"red":cat==="M"?"orange":"green"; }
function getLastNDates(endDate,n){ const allDates=Object.keys(dailyLogs).sort(); const idx=allDates.indexOf(endDate); if(idx===-1)return[]; return allDates.slice(Math.max(0,idx-n+1),idx+1); }

function get7DayRolling(date){
  const windowDates=getLastNDates(date,7);
  let sums={ sys:0, dia:0, bpCount:0, glucose:0, glucoseCount:0, walk:0, treadmill:0, strength:0, calories:0, heartRate:0, hrCount:0 };
  windowDates.forEach(d=>{
    const day=dailyLogs[d];
    day.bloodPressure.forEach(bp=>{ sums.sys+=bp.systolic; sums.dia+=bp.diastolic; sums.bpCount++; });
    day.glucose.forEach(g=>{ sums.glucose+=g.value??g; sums.glucoseCount++; });
    sums.walk+=day.walk??0; sums.treadmill+=day.treadmill??0; sums.strength+=day.strength??0; sums.calories+=day.calories??0;
    if(day.heartRate){ sums.heartRate+=day.heartRate; sums.hrCount++; }
  });
  return {
    bpSys: sums.bpCount ? (sums.sys/sums.bpCount).toFixed(1) : "—",
    bpDia: sums.bpCount ? (sums.dia/sums.bpCount).toFixed(1) : "—",
    glucose: sums.glucoseCount ? (sums.glucose/sums.glucoseCount).toFixed(1) : "—",
    walk: sums.walk, treadmill: sums.treadmill, strength: sums.strength, calories: sums.calories,
    heartRate: sums.hrCount ? (sums.heartRate/sums.hrCount).toFixed(0) : "—"
  };
}

// =======================
// Render Daily Summary
// =======================
export function renderDailySummary(date){
  const out=document.getElementById("dailySummaryOutput");
  const d=dailyLogs[date];
  if(!d){ out.innerHTML=`<div>No data for ${date}</div>`; return; }

  let html=`<h3>${date}</h3><h4>Blood Pressure</h4>`;
  if(d.bloodPressure.length){
    d.bloodPressure.forEach((bp,i)=>{
      const cat=getBPCategory(bp.systolic,bp.diastolic);
      html+=`<div style="color:${getBPColor(cat)}">BP #${i+1}: ${bp.systolic}/${bp.diastolic} HR:${bp.heartRate} (${cat})</div>`;
    });
  } else html+="<div>No BP recorded</div>";

  html+=`<h4>Glucose</h4>`;
  if(d.glucose.length){ d.glucose.forEach(g=> html+=`<div>${g.value??g} mmol/L${g.time? " (Time:"+g.time+")":""}</div>`); }
  else html+="<div>No glucose</div>";

  html+=`<h4>Activity</h4>
    <div>Walk: ${d.walk} min</div>
    <div>Treadmill: ${d.treadmill} min</div>
    <div>Strength: ${d.strength} reps</div>
    <div>Calories: ${d.calories}</div>
    <div>Avg HR: ${d.heartRate}</div>`;

  const r=get7DayRolling(date);
  html+=`<h4>7-Day Rolling Averages</h4>
    <div>BP: ${r.bpSys}/${r.bpDia}</div>
    <div>Glucose: ${r.glucose}</div>
    <div>Walk: ${r.walk} min</div>
    <div>Treadmill: ${r.treadmill} min</div>
    <div>Strength: ${r.strength} reps</div>
    <div>Calories: ${r.calories}</div>
    <div>Avg HR: ${r.heartRate}</div>`;

  out.innerHTML=html;
}

// =======================
// Render BP Trends
// =======================
export function renderBPTrends(endDate,days=7){
  const lastDays=getLastNDates(endDate,days);
  const datasets=[];
  lastDays.forEach(date=>{
    const day=dailyLogs[date]||{bloodPressure:[]};
    day.bloodPressure.forEach((bp,i)=>{
      if(!datasets[i]) datasets[i]={ label:`BP Reading ${i+1}`, data:[], borderColor:i%2===0?'red':'blue', backgroundColor:'rgba(0,0,0,0)', pointBackgroundColor:[] };
      datasets[i].data.push({x:date,y:bp.systolic});
      datasets[i].pointBackgroundColor.push(getBPColor(getBPCategory(bp.systolic,bp.diastolic)));
    });
    for(let j=day.bloodPressure.length;j<datasets.length;j++){ datasets[j].data.push({x:date,y:null}); datasets[j].pointBackgroundColor.push('gray'); }
  });
  const ctx=document.getElementById("trendChart").getContext("2d");
  if(window.bpChart) window.bpChart.destroy();
  window.bpChart=new Chart(ctx,{ type:'line', data:{ datasets }, options:{ responsive:true, plugins:{legend:{position:'top'}}, scales:{ x:{type:'category', labels:lastDays}, y:{beginAtZero:false,suggestedMin:50,suggestedMax:160} } } });
}

// =======================
// Export CSV
// =======================
export function exportSelectedCSV(date){
  const day=dailyLogs[date];
  const rows=[['Type','Systolic','Diastolic','Heart Rate','Note','Glucose','Time','Walk','Treadmill','Strength','Calories','Avg HR']];
  day.bloodPressure.forEach(bp=>rows.push(['BP', bp.systolic, bp.diastolic, bp.heartRate, bp.note||'', '', '', '', '', '', '', '']));
  day.glucose.forEach(g=>rows.push(['Glucose','','','','', g.value, g.time||'', '', '', '', '', '']));
  rows.push(['Activity','','','','','', '', day.walk, day.treadmill, day.strength, day.calories, day.heartRate]);
  const csvContent=rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
  const blob=new Blob([csvContent],{type:"text/csv"});
  const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`health_log_${date}.csv`;
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

// =======================
// Initialize Dashboard
// =======================
const picker=document.getElementById("datePicker");
const history=document.getElementById("historyList");
const exportContainer=document.getElementById("exportContainer");

// Render today and add history button
picker.value=today;
renderDailySummary(today);
renderBPTrends(today,7);

if (![...history.children].some(b=>b.dataset.date===today)){
  const btn=document.createElement('button');
  btn.textContent=today; btn.dataset.date=today;
  btn.onclick=()=>{ renderDailySummary(today); renderBPTrends(today,7); };
  history.prepend(btn);
}

// Date picker change
picker.addEventListener("change",e=>{
  const date=e.target.value;
  renderDailySummary(date); renderBPTrends(date,7);
  if(![...history.children].some(b=>b.dataset.date===date)){
    const btn=document.createElement('button');
    btn.textContent=date; btn.dataset.date=date;
    btn.onclick=()=>{ renderDailySummary(date); renderBPTrends(date,7); };
    history.prepend(btn);
  }
});

// Export buttons
const exportJSONBtn=document.createElement('button');
exportJSONBtn.textContent='Export All JSON';
exportJSONBtn.onclick=()=>{
  const blob=new Blob([JSON.stringify(dailyLogs,null,2)],{type:"application/json"});
  const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download='health_logs.json';
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
};
exportContainer.appendChild(exportJSONBtn);

const exportCSVBtn=document.createElement('button');
exportCSVBtn.textContent='Export Selected Date CSV';
exportCSVBtn.onclick=()=>{ exportSelectedCSV(picker.value); };
exportContainer.appendChild(exportCSVBtn);

// Apple Health import
const appleInput=document.createElement('input');
appleInput.type='file'; appleInput.accept='.json';
appleInput.onchange=(e)=>{
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=(event)=>{
    try{
      const jsonData=JSON.parse(event.target.result);
      if(typeof window.mapAppleHealthData==="function"){
        window.mapAppleHealthData(jsonData); alert("Apple Health data imported!");
      } else alert("mapAppleHealthData function not defined");
    } catch(err){ alert("Error parsing JSON: "+err.message); }
  };
  reader.readAsText(file);
};
exportContainer.appendChild(appleInput);
