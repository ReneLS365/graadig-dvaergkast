/* ================= SPIL-TILSTAND ================= */
const SIM_DT = 1/60;
const gameState = createInitialGameState();
let state='menu';
let currentMode='daily', currentSeed=todaySeed();
let modeMods=null, duelTarget=null, activeCampaignLevel=null, lastCampaignClear=false;
let track=[], gates=[], coins=[], hazards=[], weaponCrates=[], gi=0, ci=0, hi=0, wi=0, trackEndX=28000;
let particles=[], floating=[];
let ghost=null, runGhost=[];
let dwarf=null, camX=0, pCamX=0, dist=0;
let peak=1, skips=0, perfects=0, collectedGold=0, smashed=0, nearCount=0;
let coinCombo=0, lastCoinT=-9;
let grazeT=0, grazeTick=0, grazeTotal=0;
let recordHit=false, bestAtStart=0;
let simTick=0, acc=0, last=0, inputLevel=0;
let hammerCd=0, shieldHp=1, runStatsCache=null, weaponCd=0, survivalWave=1, lastWave=1, survivalKills=0;
let ultCharge=0, bankBoostT=0, autoPerfectN=0, weaponBoostT=0, runChar='bram', ultFlashT=0, runData=0;
let freezeT=0, dieT=0, deathReason='', shakeMag=0, flashA=0, flashCol='#fff';
let lastFinal=0, lastSurvived=false, lastDuelWon=false;
let lastHeroXP=0, lastHeroKey='bram', lastRunData=0;
let introPhase=0, heldT=0;
let hudDirty=true, hudT=0;


Object.defineProperties(globalThis, {
  score: { get(){ return gameState.run.score; }, set(value){ gameState.run.score = value; } },
  banked: { get(){ return gameState.run.banked; }, set(value){ gameState.run.banked = value; } },
  livePot: { get(){ return gameState.run.livePot; }, set(value){ gameState.run.livePot = value; } },
  mult: { get(){ return gameState.run.multiplier; }, set(value){ gameState.run.multiplier = value; } }
});

const GATE_COLOR={bank:'#63ff9a',split:'#41e8ff',greed:'#ff3df2',perfect:'#ffd35a'};
const GATE_TIP={bank:'GRØN = BANK · gem dine point', split:'CYAN = SPLIT · bank halvdelen', greed:'PINK = GRÅDIG · boost x', perfect:'GUL = PERFEKT · ram midten'};

function showMenu(){ state='menu'; $('menu').style.display='flex'; $('duelBar').style.display='none'; refreshMenu(); engineUpdate(); }
function hideMenu(){ $('menu').style.display='none'; }
function hideGameOver(){ $('gameOver').style.display='none'; $('gameOver').classList.remove('arm'); }

function startMode(mode){
  if(mode==='campaign'){
    if(!save.campaign) save.campaign={unlocked:1,current:1,stars:{}};
    startCampaignLevel(save.campaign.current || save.campaign.unlocked || 1);
    return;
  }
  if(mode==='daily'){
    ensureDailyRun();
    if(save.dailyRun.tries>=3){
      toast('Ingen forsøg tilbage i dag. Minen åbner igen i morgen.');
      activeTab='leaderboard'; renderTab();
      return;
    }
    duelTarget=null;
    startGame('daily', todaySeed());
  } else {
    duelTarget=null;
    startGame(mode, randomSeed());
  }
}
function retryRun(){
  if(state!=='over') return;
  hideGameOver();
  if(currentMode==='daily'){
    ensureDailyRun();
    if(save.dailyRun.tries>=3){ toast('Ingen forsøg tilbage i dag.'); showMenu(); return; }
    startGame('daily', todaySeed());
  } else {
    startGame(currentMode, currentSeed);
  }
}
function startDuel(seed, targetScore, name){
  duelTarget={score:targetScore, name:name||'Ukendt dværg'};
  activeCampaignLevel=null;
  startGame('duel', seed);
}
function startCampaignLevel(id){
  if(!save.campaign) save.campaign={unlocked:1,current:1,stars:{}};
  id=clamp(Math.floor(id||1),1,CAMPAIGN_LEVELS.length);
  if(id>(save.campaign.unlocked||1)){ toast('Bane låst. Spil den forrige. Revolutionerende system.'); return; }
  activeCampaignLevel=CAMPAIGN_LEVELS.find(l=>l.id===id) || CAMPAIGN_LEVELS[0];
  save.campaign.current=id;
  duelTarget=null;
  persist();
  startGame('campaign', activeCampaignLevel.seed);
}

function startGame(mode,seed){
  currentMode=mode; currentSeed=seed>>>0;
  gameState.app.currentMode=currentMode;
  gameState.app.currentSeed=currentSeed;
  if(mode==='campaign' && activeCampaignLevel){
    modeMods={
      speed:activeCampaignLevel.speed,
      coins:activeCampaignLevel.coins,
      hazards:activeCampaignLevel.hazards,
      label:'Kampagne '+activeCampaignLevel.id,
      fair:false,
      campaign:true,
      length:activeCampaignLevel.length,
      width:activeCampaignLevel.width
    };
  } else {
    modeMods = {
      daily:{speed:1, coins:1, hazards:1, label:'Dagens Mine', fair:true},
      duel:{speed:1, coins:1, hazards:1, label:'DUEL', fair:true},
      survival:{speed:1.02, coins:1.42, hazards:1.62, label:'Overlevelse', fair:false, survival:true, length:270, width:.94},
      random:{speed:1, coins:1, hazards:1, label:'Random', fair:false},
      practice:{speed:.85, coins:.6, hazards:.65, label:'Træning', fair:false},
      chaos:{speed:1.15, coins:1.55, hazards:1.45, label:'Kaos', fair:false}
    }[mode] || {speed:1,coins:1,hazards:1,label:mode,fair:false};
  }
  runStatsCache = modeMods.fair ? Object.assign({},FAIR_STATS) : buildStats();
  hideMenu(); hideGameOver(); $('pauseOv').style.display='none';
  state='play';
  track=makeTrack(currentSeed);
  gates=makeGates(currentSeed);
  coins=makeCoins(currentSeed, modeMods);
  hazards=makeHazards(currentSeed, modeMods);
  weaponCrates=makeWeaponCrates(currentSeed, modeMods);
  gi=0; ci=0; hi=0; wi=0;
  particles=[]; floating=[];
  dwarf={ sx:clamp(W*0.24,90,170), y:H*0.5, py:H*0.5, vy:0, r:18, hitR:10.5, rot:0, inv:1.0, shield:0, magnet:0, dash:0, slow:0, over:0 };
  camX=0; pCamX=0; dist=0;
  resetRunState(gameState);
  score=0; banked=0; livePot=0; mult=1; peak=1; skips=0; perfects=0; collectedGold=0; smashed=0; nearCount=0;
  coinCombo=0; lastCoinT=-9;
  grazeT=0; grazeTick=0; grazeTotal=0;
  recordHit=false; bestAtStart=save.best;
  simTick=0; acc=0; inputLevel=0; inputDown=false;
  hammerCd=0; weaponCd=0; survivalWave=1; lastWave=1; survivalKills=0; shieldHp=1+Math.floor(runStatsCache.hp||0);
  ultCharge=0; bankBoostT=0; autoPerfectN=0; weaponBoostT=0; ultFlashT=0; runData=0;
  runChar = modeMods.fair ? 'bram' : activeChar();
  freezeT=0; dieT=0; shakeMag=0; flashA=0;
  runGhost=[]; ghost=loadGhost(currentSeed);
  $('modeBadge').textContent=modeMods.label;
  if(mode==='survival'){ $('subInfo').textContent='Wave 1 · loot jagt'; }
  else if(mode==='campaign' && activeCampaignLevel){ $('subInfo').textContent=activeCampaignLevel.name; }
  else if(mode==='daily'){ ensureDailyRun(); $('subInfo').textContent='forsøg '+(save.dailyRun.tries+1)+'/3'; }
  else if(mode==='duel' && duelTarget){ $('subInfo').textContent='mål '+fmt(duelTarget.score); }
  else { $('subInfo').textContent='seed '+String(currentSeed).slice(0,6); }
  $('fairPill').style.display = modeMods.fair ? 'inline-block' : 'none';
  if(mode==='duel' && duelTarget){
    $('duelBar').style.display='block';
    $('duelName').textContent='DUEL mod '+duelTarget.name+' · slå '+fmt(duelTarget.score);
    $('duelFill').style.width='0%';
  } else if(mode==='campaign' && activeCampaignLevel){
    $('duelBar').style.display='block';
    $('duelName').textContent='KAMPAGNE '+activeCampaignLevel.id+' · '+objectiveText(activeCampaignLevel.goal);
    $('duelFill').style.width='0%';
  } else { $('duelBar').style.display='none'; }
  if(!save.seenIntro){ introPhase=1; heldT=0; $('introText').textContent='HOLD SKÆRMEN = STIG'; $('intro').style.display='flex'; }
  else { introPhase=0; $('intro').style.display='none'; }
  flash(modeMods.label+' — KLAR!');
  hudDirty=true;
  last=now();
  requestAnimationFrame(loop);
}
