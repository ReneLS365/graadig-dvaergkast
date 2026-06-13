/* ================= LABORATORIE-LOGIK (tidsbaseret) ================= */
function ensureResearch(){
  if(!save.research) save.research={points:0, slots:1, queue:{}, done:{}, bonuses:{}, weaponCapBonus:0, passiveGold:0};
  const R=save.research;
  if(typeof R.points!=='number') R.points=0;
  if(typeof R.slots!=='number') R.slots=1;
  if(!R.queue) R.queue={};
  if(!R.done) R.done={};
  if(!R.bonuses) R.bonuses={};
  if(typeof R.weaponCapBonus!=='number') R.weaponCapBonus=0;
  if(typeof R.passiveGold!=='number') R.passiveGold=0;
}
function researchDone(id){ ensureResearch(); return !!save.research.done[id]; }
function researchBonusStats(){ ensureResearch(); return save.research.bonuses || {}; }
function gainData(n, x, y){
  ensureResearch();
  n=Math.floor(n); if(n<=0) return;
  save.research.points += n;
  if(typeof runData==='number') runData += n;
  if(x!==undefined) floatText(x,y,'+'+n+' data','#7CF6E3');
}
function labUnlockedAt(){ return 4; }
function labUnlocked(){ return save.level>=labUnlockedAt(); }
function researchQueueEntry(slot){ ensureResearch(); return save.research.queue[slot]||null; }
function researchActiveCount(){ ensureResearch(); return Object.keys(save.research.queue).length; }
function freeResearchSlot(){
  ensureResearch();
  for(let i=0;i<save.research.slots;i++){ if(!save.research.queue[i]) return i; }
  return -1;
}
function isResearching(id){
  ensureResearch();
  return Object.values(save.research.queue).some(q=>q && q.id===id);
}
function researchProgress(slot){
  const q=researchQueueEntry(slot); if(!q) return 0;
  return clamp((Date.now()-q.start)/q.dur,0,1);
}
function researchReady(slot){
  const q=researchQueueEntry(slot); if(!q) return false;
  return Date.now()-q.start >= q.dur;
}
function researchAvailable(id){
  const p=RESEARCH[id]; if(!p) return false;
  if(!p.repeatable && researchDone(id)) return false;
  if(isResearching(id)) return false;
  if(save.level<p.reqLevel) return false;
  for(const dep of (p.reqDone||[])){ if(!researchDone(dep)) return false; }
  return true;
}
function startResearch(id){
  const p=RESEARCH[id]; if(!p){ return; }
  if(!researchAvailable(id)){ toast('Projektet kan ikke startes endnu.'); return; }
  const slot=freeResearchSlot();
  if(slot<0){ toast('Alle forskningsbænke er optaget.'); return; }
  const cg=p.cost.gold||0, cd=p.cost.data||0;
  if(save.gold<cg){ toast('For lidt guld til projektet.'); return; }
  if(save.research.points<cd){ toast('For lidt forskningsdata. Smadr krystaller i minen.'); return; }
  save.gold-=cg; save.research.points-=cd;
  save.research.queue[slot]={id, start:Date.now(), dur:p.dur};
  toast('Forskning startet: '+p.name);
  sfx.ui(); persist(); refreshMenu();
}
function claimResearch(slot){
  const q=researchQueueEntry(slot); if(!q) return;
  if(!researchReady(slot)){ toast('Projektet er ikke færdigt endnu.'); return; }
  const p=RESEARCH[q.id]; if(!p){ delete save.research.queue[slot]; persist(); refreshMenu(); return; }
  applyResearchReward(p, q.id);
  delete save.research.queue[slot];
  if(!p.repeatable) save.research.done[q.id]=Date.now();
  sfx.record(); flashScreen('#7CF6E3',.3);
  persist(); refreshMenu();
}
function applyResearchReward(p, id){
  const rw=p.reward||{};
  if(rw.stats){
    for(const [k,v] of Object.entries(rw.stats)){
      save.research.bonuses[k]=(save.research.bonuses[k]||0)+v;
    }
  }
  if(rw.gold){ save.gold+=rw.gold; }
  if(rw.passiveGold){ save.research.passiveGold+=rw.passiveGold; }
  if(rw.slot){ save.research.slots+=rw.slot; }
  if(rw.weaponCap){ save.research.weaponCapBonus+=rw.weaponCap; }
  if(rw.unlockChar){ gainCharacter(rw.unlockChar); }
  if(rw.unlockWeapon){
    ensureInventory();
    if(!save.inventory.weapons[rw.unlockWeapon]) save.inventory.weapons[rw.unlockWeapon]={owned:true,level:1,xp:0};
    else save.inventory.weapons[rw.unlockWeapon].owned=true;
  }
  toast('FORSKNING FÆRDIG: '+p.name);
  gainXP(120);
}
