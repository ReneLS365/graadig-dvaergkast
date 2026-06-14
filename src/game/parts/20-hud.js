/* ================= HUD ================= */

function campaignProgress(){
  if(!activeCampaignLevel) return 0;
  const g=activeCampaignLevel.goal;
  const vals=[];
  if(g.finish) vals.push(clamp((camX+dwarf.sx)/Math.max(1,trackEndX-40),0,1));
  if(g.score) vals.push(clamp(gameState.run.score/g.score,0,1));
  if(g.bank) vals.push(clamp(gameState.run.banked/g.bank,0,1));
  if(g.coins) vals.push(clamp(collectedGold/g.coins,0,1));
  if(g.skips) vals.push(clamp(gameState.run.skips/g.skips,0,1));
  if(g.perfect) vals.push(clamp(perfects/g.perfect,0,1));
  if(g.smash) vals.push(clamp(smashed/g.smash,0,1));
  return vals.length ? Math.min.apply(null,vals) : 0;
}
function campaignClearCheck(final,survived){
  if(!activeCampaignLevel) return false;
  const g=activeCampaignLevel.goal;
  if(g.finish && !survived) return false;
  if(g.score && final<g.score) return false;
  if(g.bank && gameState.run.banked<g.bank) return false;
  if(g.coins && collectedGold<g.coins) return false;
  if(g.skips && gameState.run.skips<g.skips) return false;
  if(g.perfect && perfects<g.perfect) return false;
  if(g.smash && smashed<g.smash) return false;
  return true;
}
function campaignStarCount(final,survived){
  if(!activeCampaignLevel) return 0;
  let stars = campaignClearCheck(final,survived) ? 1 : 0;
  if(!stars) return 0;
  const g=activeCampaignLevel.goal;
  if(final >= (g.score||12000)*1.25 || gameState.run.banked >= (g.bank||9000)*1.25) stars++;
  if(survived && gameState.run.peak>=8) stars++;
  return clamp(stars,1,3);
}

function hudTick(dt){
  hudT+=dt;
  if(!hudDirty || hudT<0.08) return;
  hudT=0; hudDirty=false;
  $('liveVal').textContent=fmt(gameState.run.livePot);
  $('bankVal').textContent=fmt(gameState.run.banked);
  $('goldVal').textContent=fmt(collectedGold);
  $('multVal').textContent='x'+gameState.run.multiplier.toFixed(2);
  $('skipVal').textContent=gameState.run.skips;
  $('hpVal').textContent=shieldHp;
  const cdEl=$('hammerCd'), hb=$('hammerBtn');
  if(hammerCd>0){ cdEl.textContent=hammerCd.toFixed(1); hb.classList.add('cd'); }
  else { cdEl.textContent='klar'; hb.classList.remove('cd'); }
  const ub=$('ultBtn');
  if(ub){
    const c=CHARACTERS[runChar]||CHARACTERS.bram;
    ub.style.setProperty('--ult', ultCharge.toFixed(3));
    ub.style.setProperty('--ultcol', c.color||'#7CF6E3');
    $('ultLbl').textContent = ultCharge>=1 ? (c.ultShort||'KLAR') : Math.floor(ultCharge*100)+'%';
    ub.classList.toggle('ready', ultCharge>=1);
  }
  if(duelTarget && state==='play'){
    $('duelFill').style.width=Math.min(100, gameState.run.score/duelTarget.score*100).toFixed(1)+'%';
  } else if(currentMode==='campaign' && activeCampaignLevel && state==='play'){
    $('duelFill').style.width=(campaignProgress()*100).toFixed(1)+'%';
  }
}
