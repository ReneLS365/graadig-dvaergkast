/* ================= BOOT ================= */
resize();
buildStars();
drawIdle();
ensureDailyMissions();
ensureDailyRun();
$('soundBtn').textContent = save.sound ? '🔊' : '🔇';
const bootParams=new URLSearchParams(location.search);
if(!parseDuelHash() && bootParams.get('seed')){
  setTimeout(function(){ startGame('random', Number(bootParams.get('seed'))>>>0); }, 300);
}
refreshMenu();

if('serviceWorker' in navigator && location.protocol !== 'file:'){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./src/pwa/sw.js').catch(err=>console.warn('Service worker ikke registreret:', err));
  });
}

// Live nedtælling i Laboratoriet (kun når fanen er åben i menuen)
setInterval(function(){
  if(state==='menu' && activeTab==='research' && $('menu').style.display!=='none'){ renderTab(); }
}, 1000);
