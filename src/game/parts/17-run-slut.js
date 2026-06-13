/* ================= RUN SLUT ================= */
/* Belønnings-kurver: afkoblet fra den eksploderende score.
   sqrt-dæmpning gør at et 150-mio-run og et 2-mio-run giver næsten det samme,
   og et hårdt loft sikrer at fremgang tager mange runs (uger), ikke 3 runs. */
function heroXpForRun(final, smashed, wave, perfectsN, distV, xpStat){
  const base=6;
  const scorePart=Math.min(170, Math.sqrt(Math.max(0,final))/9);
  const skillPart=(smashed||0)*1.1 + (wave>1?wave*4:0) + (perfectsN||0)*3 + Math.floor((distV||0)/2600)*4;
  return Math.round(Math.min(340, (base+scorePart+skillPart)*(1+(xpStat||0)*0.4)));
}
function accXpForRun(final, smashed, survived, campClear, xpStat){
  const scorePart=Math.min(120, Math.sqrt(Math.max(0,final))/13);
  const bonus=10 + (smashed||0)*0.7 + (survived?18:0) + (campClear?35:0);
  return Math.round(Math.min(250, (scorePart+bonus)*(1+(xpStat||0)*0.4)));
}
function dataForRun(final){
  return Math.round(Math.min(24, Math.sqrt(Math.max(0,final))/80));
}
function gradeFor(final, oldBest, survived){
  if(duelTarget) return lastDuelWon ? 'DUELVINDER 👑' : 'Duel tabt';
  if(final>0 && oldBest>0 && final>=oldBest) return 'MINEKONGE 👑 · NY REKORD';
  if(oldBest<=0) return final>0 ? 'Ny i minen' : 'Grus';
  const r=final/oldBest;
  if(r>=0.8) return 'Sjakbajs';
  if(r>=0.5) return 'Minearbejder';
  if(r>=0.25) return 'Lærling';
  return 'Grus';
}
function endRun(survived,reason){
  if(state==='over') return;
  state='over';
  $('pauseOv').style.display='none';
  $('duelBar').style.display='none';
  if(introPhase){ introPhase=0; $('intro').style.display='none'; }
  const st=runStatsCache||{};
  const final=Math.floor(banked + (survived?livePot:(livePot*Math.max(0,(st.salvage||0)))));
  lastFinal=final; lastSurvived=survived;
  const oldBest=save.best;

  if(currentMode==='daily'){
    ensureDailyRun();
    save.dailyRun.tries++;
    save.dailyRun.best=Math.max(save.dailyRun.best, final);
  }
  lastCampaignClear=false;
  if(currentMode==='campaign' && activeCampaignLevel){
    if(!save.campaign) save.campaign={unlocked:1,current:1,stars:{}};
    lastCampaignClear=campaignClearCheck(final,survived);
    const stars=campaignStarCount(final,survived);
    const prev=save.campaign.stars[activeCampaignLevel.id]||0;
    if(stars>prev){
      save.campaign.stars[activeCampaignLevel.id]=stars;
      const reward=Math.floor(activeCampaignLevel.reward*(stars-prev));
      save.gold+=reward;
      gainXP(Math.floor(reward*.55));
      toast('Kampagne: '+stars+'★ · +'+reward+'g');
    }
    if(lastCampaignClear && activeCampaignLevel.id>=save.campaign.unlocked){
      save.campaign.unlocked=Math.min(CAMPAIGN_LEVELS.length, activeCampaignLevel.id+1);
      save.campaign.current=Math.min(CAMPAIGN_LEVELS.length, activeCampaignLevel.id+1);
    }
  }

  const goldGain = Math.floor(collectedGold + Math.min(450, final/180) + (save.research.passiveGold||0));
  save.gold += Math.max(0, goldGain);
  save.runs++;
  if(final>save.best){ save.best=final; save.bestDist=Math.floor(dist); }
  // Meta-fremgang er afkoblet fra den eksploderende score: dæmpet (sqrt) + hårdt loft per run.
  // Score må gerne være kæmpestor (flex) — men XP/data tjener du langsomt og jævnt.
  const xpStat=st.xp||0;
  gainXP(accXpForRun(final, smashed, survived, lastCampaignClear, xpStat));
  // Helt-EXP til den valgte helt (også i fair modes — det er stadig din helt)
  const heroKey=activeChar();
  const heroXP=heroXpForRun(final, smashed, (currentMode==='survival'?survivalWave:1), perfects, dist, xpStat);
  lastHeroXP=heroXP; lastHeroKey=heroKey;
  gainCharXP(heroKey, heroXP);
  // Data fra run (krystaller giver løbende i minen; dette er en lille bonus oveni — også loftet)
  const runDataBonus=dataForRun(final);
  if(runDataBonus>0) gainData(runDataBonus);
  if(lastCampaignClear) gainData(6 + (activeCampaignLevel?activeCampaignLevel.id:0));
  lastRunData=runData;
  save.leaderboard.push({score:final,bank:Math.floor(banked),peak:peak,seed:currentSeed,mode:modeMods.label,at:Date.now()});
  save.leaderboard=save.leaderboard.sort(function(a,b){return b.score-a.score;}).slice(0,60);
  saveGhost(currentSeed, runGhost, final);

  if(!survived) unlock('firstCrash');
  if(survived) unlock('finisher');
  if(skips>=5) unlock('greedy');
  if(save.gold>=2000) unlock('rich');

  lastDuelWon=false;
  if(duelTarget){
    lastDuelWon = final>duelTarget.score;
    if(lastDuelWon){ save.duelWins++; save.wins++; unlock('duelist'); }
  }
  persist();

  $('oScore').textContent=fmt(final);
  $('oBank').textContent=fmt(banked);
  $('oPeak').textContent='x'+peak.toFixed(2);
  $('oDist').textContent=fmt(dist/12)+' m';
  const hcName=(DATA.pilots[lastHeroKey]&&DATA.pilots[lastHeroKey].name) || (CHARACTERS[lastHeroKey]&&CHARACTERS[lastHeroKey].role) || 'Bram Jernskæg';
  $('oHeroXp').textContent='+'+fmt(lastHeroXP)+' · '+hcName+' Lv'+charLevel(lastHeroKey);
  $('oData').textContent='+'+fmt(lastRunData);
  $('oGrade').textContent=gradeFor(final,oldBest,survived);

  if(duelTarget){
    const diff=Math.abs(final-duelTarget.score);
    $('overTitle').textContent = lastDuelWon ? 'DU VANDT! 👑' : 'Tabt.';
    $('overText').textContent = lastDuelWon
      ? 'Du slog '+duelTarget.name+' med '+fmt(diff)+' point. Send revanchen.'
      : duelTarget.name+' beholder tronen. Der manglede '+fmt(diff)+' point.';
  } else if(currentMode==='campaign' && activeCampaignLevel){
    const stars=campaignStarCount(final,survived);
    $('overTitle').textContent = lastCampaignClear ? 'BANE KLARET! '+stars+'★' : 'Bane fejlet.';
    $('overText').textContent = lastCampaignClear
      ? activeCampaignLevel.name+' klaret. Næste mine låst op, fordi mennesker åbenbart kræver belønning for ikke at dø.'
      : 'Mål: '+objectiveText(activeCampaignLevel.goal)+'. Du var ikke helt der endnu.';
  } else {
    $('overTitle').textContent = survived ? 'MÅL!' : 'Crash.';
    $('overText').textContent = reason || 'Dværgen ramte noget. Sikkert væggen. Den var stor.';
  }
  $('shareBtn').textContent = (currentMode==='campaign' && lastCampaignClear) ? 'Næste bane' : (currentMode==='survival' ? 'Del overlevelse' : (duelTarget ? 'Send revanche' : 'Udfordr en ven'));
  const rb=$('retryBtn');
  if(currentMode==='daily' && save.dailyRun.tries>=3){ rb.disabled=true; rb.textContent='I morgen igen'; }
  else { rb.disabled=false; rb.textContent='Prøv igen'; }

  const go=$('gameOver');
  go.style.display='flex';
  go.classList.remove('arm');
  setTimeout(function(){ go.classList.add('arm'); }, 350);
  hudDirty=true; hudT=1;
  engineUpdate();
}
