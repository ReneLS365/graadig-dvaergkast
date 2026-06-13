/* ================= UI-BINDINGS ================= */
['pilotSel','coreSel','chipSel','abilitySel'].forEach(id=>{
  $(id).addEventListener('change',e=>{
    const prop=id==='pilotSel'?'pilot':id==='coreSel'?'core':id==='chipSel'?'chip':'ability';
    save.selected[prop]=e.target.value; persist(); refreshMenu();
  });
});
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{activeTab=b.dataset.tab; sfx.ui(); renderTab();});
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{ audioEnsure(); audioResume(); engineStart(); startMode(b.dataset.mode); });
$('retryBtn').onclick=()=>{ sfx.ui(); retryRun(); };
$('newBtn').onclick=()=>{ sfx.ui(); hideGameOver(); startMode('random'); };
$('menuBtn').onclick=()=>{ sfx.ui(); hideGameOver(); showMenu(); };
$('shareBtn').onclick=()=>{ if(currentMode==='campaign' && lastCampaignClear){ const next=(activeCampaignLevel?activeCampaignLevel.id+1:1); if(next<=CAMPAIGN_LEVELS.length){ hideGameOver(); startCampaignLevel(next); } else showMenu(); } else shareChallenge(); };
$('resumeBtn').onclick=()=>resumeGame();
$('quitBtn').onclick=()=>{ $('pauseOv').style.display='none'; endRun(false,'Run afbrudt. Dværgen gik til frokost.'); };
$('pauseBtn').onclick=()=>{ if(state==='play') pauseGame(); else if(state==='pause') resumeGame(); };
let resetArmed=false, resetTimer=null;
$('resetBtn').onclick=()=>{
  const b=$('resetBtn');
  if(!resetArmed){
    resetArmed=true; b.textContent='Tryk igen for at slette ALT';
    b.style.background='#ff496c'; b.style.color='#fff';
    clearTimeout(resetTimer);
    resetTimer=setTimeout(()=>{ resetArmed=false; b.textContent='Nulstil al fremgang'; b.style.background='#ffffff0a'; b.style.color='#ff8aa0'; }, 4000);
    return;
  }
  clearTimeout(resetTimer); resetArmed=false;
  try{ localStorage.removeItem('graadig_dvaerg_v3'); }catch(e){}
  location.reload();
};
$('soundBtn').onclick=()=>{
  save.sound=!save.sound; persist();
  $('soundBtn').textContent = save.sound?'🔊':'🔇';
  if(audioEnsure()) masterGain.gain.value = save.sound?0.55:0;
  toast(save.sound?'Lyd til':'Lyd fra');
};

const exportBtn = $('exportSaveBtn');
if(exportBtn) exportBtn.onclick=()=>exportSaveData();

const importBtn = $('importSaveBtn');
const importFile = $('importSaveFile');
if(importBtn && importFile){
  importBtn.onclick=()=>importFile.click();
  importFile.onchange=()=>{
    const file = importFile.files && importFile.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload=()=>importSaveDataFromText(String(reader.result||''));
    reader.readAsText(file);
    importFile.value='';
  };
}

const resetBtn = $('resetBtn');
if(resetBtn){
  resetBtn.onclick=()=>{
    const ok = confirm('Nulstil ALT progress? Det er irreversibelt, ligesom dårlige tatoveringer.');
    if(ok) hardResetSave();
  };
}

function toast(text){
  const wrap=$('toast');
  const d=document.createElement('div');
  d.textContent=text;
  wrap.appendChild(d);
  setTimeout(()=>{d.style.opacity='0'; d.style.transform='translateY(-8px)';},2400);
  setTimeout(()=>d.remove(),3000);
}
function flash(text){
  const m=$('msg'); m.textContent=text; m.classList.add('show');
  clearTimeout(flash.t); flash.t=setTimeout(()=>m.classList.remove('show'),900);
}
