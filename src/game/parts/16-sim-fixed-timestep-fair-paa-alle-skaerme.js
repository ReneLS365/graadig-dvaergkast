/* ================= SIM (fixed timestep — fair på alle skærme) ================= */

function killHazard(h, hy, reason, rewardMul){
  if(!h || h.dead) return;
  const run=gameState.run;
  h.dead=true;
  survivalKills++;
  if(h.type==='crystal'){
    const st=runStatsCache||{};
    const goldR = 220 * (rewardMul||1) * run.multiplier;
    run.livePot += goldR;
    addUlt(0.12);
    const dataAmt = Math.max(1, Math.round((2 + survivalWave*0.3) * (1+(st.data||0)*0.6) * (1+(researchBonusStats().data||0)*0.6)));
    gainData(dataAmt, h.x, hy-18);
    gainScrap(70 + Math.floor(Math.random()*70) + survivalWave*4, h.x, hy+18);
    addParticle(h.x,hy,'#7CF6E3',24,1.6);
    addParticle(h.x,hy,'#b388ff',14,1.2);
    floatText(h.x,hy,'KRYSTAL +'+Math.floor(goldR),'#7CF6E3');
    flashScreen('#7CF6E3',.18); sfx.perfect();
    persist();
    return;
  }
  const reward=(reason==='WEAPON'?75:60) * (rewardMul||1) * run.multiplier;
  run.livePot += reward;
  if(currentMode==='survival'){
    run.livePot += 18*survivalWave*run.multiplier;
    // Mere konkret progression: kills giver små mængder skrot, så runs altid føles brugbare.
    if(reason==='WEAPON' || reason==='SMASH' || reason==='BOR' || reason==='PARRY'){
      const scrapDrip = 2 + Math.floor(survivalWave*0.55) + (h.type==='saw'?2:0);
      gainScrap(scrapDrip, h.x, hy+16);
    }
  }
  addUlt(0.06);
  addParticle(h.x,hy,reason==='WEAPON'?'#ffd35a':'#ff9d3d',16,1.25);
  floatText(h.x,hy,(reason||'KILL')+' +'+Math.floor(reward), reason==='WEAPON'?'#ffd35a':'#ff9d3d');
  if(Math.random() < (currentMode==='survival'?0.28:0.10)){
    const roll=Math.random();
    const kind = roll<0.13?'weapon':roll<0.72?'scrap':roll<0.86?'medkit':'relic';
    weaponCrates.push({x:h.x+30,tF:clamp(hy/H,0.1,0.9),kind:kind,weapon:null,taken:false,px:h.x+30,py:hy,r:12});
    weaponCrates.sort(function(a,b){return a.x-b.x;});
  }
}
function autoFireWeapon(dt, wx){
  ensureInventory();
  const key=currentWeaponKey();
  const w=WEAPONS[key]; if(!w) return;
  const st=weaponStats(key);
  weaponCd-=dt;
  if(weaponCd>0) return;
  const wmul = 1 + (runStatsCache.weapon||0);
  const boosting = weaponBoostT>0;
  const dmg = st.damage * wmul * (boosting?1.6:1);
  let targets=[];
  for(let i=hi;i<hazards.length;i++){
    const h=hazards[i];
    if(h.x>wx+st.range) break;
    if(h.dead || h.x<wx+18) continue;
    const sh=sampleTrack(h.x), hy=hazardY(h,sh);
    const dy=Math.abs(hy-dwarf.y);
    const cone = key==='blunder' ? 92 : key==='chain' ? 62 : 48;
    if(dy<cone) targets.push({h,hy,d:h.x-wx+dy*.35});
  }
  if(!targets.length) return;
  targets.sort((a,b)=>a.d-b.d);
  const pierce=(st.pierce||1) + (boosting?2:0);
  for(let i=0;i<Math.min(pierce,targets.length);i++){
    const t=targets[i];
    t.h.hp=(t.h.hp||1)-dmg;
    addParticle(wx+24,dwarf.y,'#ffd35a',4,0.55);
    addParticle(t.h.x,t.hy,'#ffd35a',8,0.85);
    floatText(t.h.x,t.hy,'-'+dmg.toFixed(1),'#ffd35a');
    if(t.h.hp<=0){
      killHazard(t.h,t.hy,'WEAPON',1+(st.leech||0));
      if(st.leech) gameState.run.livePot+=90*gameState.run.multiplier*st.leech;
    }
  }
  weaponCd=st.cooldown * (boosting?0.4:1);
  sfx.tick();
}
function collectWeaponCrate(c,cx,cy){
  c.taken=true;
  if(c.kind==='weapon'){
    const key=c.weapon || WEAPON_DROP_POOL[Math.floor(Math.random()*WEAPON_DROP_POOL.length)];
    gainWeapon(key,{x:cx,y:cy});
  }else if(c.kind==='medkit'){
    shieldHp=Math.min(shieldHp+1, ultShieldCap());
    floatText(cx,cy,'+1 HP','#63ff9a'); sfx.bank(false);
  }else if(c.kind==='relic'){
    // Relics giver nu run-specifikke buffs, ikke bare lidt tal-konfetti.
    const r=Math.random();
    if(r<0.25){
      weaponBoostT += 5.5;
      floatText(cx,cy,'RELIK: VÅBENRUS','#ffd35a');
    }else if(r<0.50){
      dwarf.magnet += 5.5;
      floatText(cx,cy,'RELIK: STOR-SUG','#41e8ff');
    }else if(r<0.75){
      bankBoostT += 5.5;
      floatText(cx,cy,'RELIK: BANKBOOST','#63ff9a');
    }else{
      shieldHp=Math.min(ultShieldCap(), shieldHp+1);
      floatText(cx,cy,'RELIK: +1 HP','#63ff9a');
    }
    gameState.run.multiplier*=1.18; gameState.run.livePot+=360*gameState.run.multiplier;
    sfx.perfect(); pumpMult(); flashScreen('#ff3df2',.18);
  }else{
    const scrap=45 + Math.floor(Math.random()*55) + (currentMode==='survival'?survivalWave*5:0);
    gainScrap(scrap,cx,cy);
    sfx.coin(3);
  }
  addParticle(cx,cy,'#bfc7d9',12,1.0);
  persist();
}

function stepSim(){
  simTick++;
  const dt=SIM_DT;
  const st=runStatsCache;
  const run=gameState.run;
  pCamX=camX; dwarf.py=dwarf.y;

  let speed=(190 + run.distance*0.0025 + (st.speed||0)*120) * modeMods.speed;
  if(dwarf.dash>0) speed+=220;
  if(dwarf.slow>0) speed*=0.58;
  if(dwarf.over>0) speed*=1.10;
  if(modeMods.survival) speed *= 1 + Math.min(1.0,(survivalWave-1)*0.05);
  camX += speed*dt; run.distance=camX;

  const spdN=clamp((speed-190)/280,0,1);
  const targetSX=clamp(W*(0.26-0.08*spdN),86,180);
  dwarf.sx += (targetSX-dwarf.sx)*Math.min(1,dt*3);
  const wx=camX+dwarf.sx;

  const lift=620*(1+(st.lift||0)*0.8);
  const grav=455*(1-(st.control||0)*0.22);
  inputLevel += ((inputDown?1:0)-inputLevel)*(1-Math.pow(0.02,dt*8));
  dwarf.vy += (grav*(1-inputLevel) - lift*inputLevel)*dt;
  if(dwarf.dash>0){ dwarf.dash-=dt; dwarf.vy*=.94; }
  const damp=0.982-(st.control||0)*0.035;
  dwarf.vy *= Math.pow(damp, dt*60);
  dwarf.vy=clamp(dwarf.vy,-390,430);
  dwarf.y += dwarf.vy*dt;
  dwarf.rot = lerp(dwarf.rot, clamp(dwarf.vy/360,-0.95,0.95), .10);

  if(hammerCd>0) hammerCd-=dt;
  dwarf.inv=Math.max(0,dwarf.inv-dt);
  dwarf.shield=Math.max(0,dwarf.shield-dt);
  dwarf.magnet=Math.max(0,dwarf.magnet-dt);
  dwarf.slow=Math.max(0,dwarf.slow-dt);
  dwarf.over=Math.max(0,dwarf.over-dt);
  if(bankBoostT>0) bankBoostT-=dt;
  if(weaponBoostT>0) weaponBoostT-=dt;
  if(ultFlashT>0) ultFlashT-=dt;
  addUlt(dt*0.018);

  const s=sampleTrack(wx);
  const topGap=(dwarf.y-dwarf.hitR)-s.top;
  const botGap=s.bot-(dwarf.y+dwarf.hitR);
  if(topGap<0 || botGap<0){
    damageOrEnd('Minevæg. Hitboxen er lille — den her var din egen.');
    if(state!=='play') return;
    dwarf.y=clamp(dwarf.y, s.top+dwarf.hitR+2, s.bot-dwarf.hitR-2);
    dwarf.vy*=-0.25;
  } else {
    const g=Math.min(topGap,botGap);
    if(g<11){
      grazeT+=dt; grazeTotal+=dt; grazeTick+=dt;
      if(grazeTick>=0.2){
        grazeTick=0;
        run.multiplier+=0.035; run.livePot+=14*run.multiplier; addUlt(0.02);
        const sideY = topGap<botGap ? s.top+2 : s.bot-2;
        addParticle(wx-6,sideY,'#41e8ff',2,0.5);
        floatText(wx,sideY+(topGap<botGap?24:-24),'+kys','#41e8ff');
        sfx.tick();
      }
      if(grazeTotal>=6) unlock('graze');
    } else { grazeT=0; grazeTick=0; }
  }

  run.multiplier += dt*(0.075 + run.skips*.012 + (st.greed||0)*.05);
  run.peak=Math.max(run.peak,run.multiplier);
  run.livePot += dt*95*run.multiplier*(1+(st.greed||0));
  if(st.interest && run.banked>0) run.livePot += dt * Math.min(80, run.banked/900) * st.interest;
  if(modeMods.survival){
    survivalWave=Math.max(1, Math.floor(run.distance/900)+1);
    if(survivalWave!==lastWave){
      lastWave=survivalWave;
      shieldHp=Math.min(ultShieldCap(), shieldHp + (survivalWave%3===0?1:0));
      if(survivalWave>=8) unlock('survivor');
      flash('WAVE '+survivalWave+(survivalWave%5===0?' · MINIBOSS!':''));
      if(survivalWave%4===0){
        // små belønningskasser efter milestones, fordi ren smerte er dårlig retention. Utroligt nok.
        weaponCrates.push({x:camX+dwarf.sx+W*0.72,tF:0.45,kind:'relic',weapon:null,taken:false,px:null,py:0,r:13});
        weaponCrates.push({x:camX+dwarf.sx+W*0.82,tF:0.58,kind:'scrap',weapon:null,taken:false,px:null,py:0,r:13});
        weaponCrates.sort(function(a,b){return a.x-b.x;});
      }
      flashScreen('#63ff9a',.18); sfx.level();
    }
    run.multiplier += dt*0.012*survivalWave;
    run.livePot += dt*survivalWave*18;
    $('subInfo').textContent='Wave '+survivalWave+' · kills '+survivalKills+' · '+WEAPONS[currentWeaponKey()].name;
  }
  autoFireWeapon(dt, wx);
  run.score=run.banked+run.livePot;

  if(!recordHit && bestAtStart>500 && run.score>bestAtStart){
    recordHit=true;
    flashScreen('#ffd35a',.45); shake(13);
    floatText(wx,dwarf.y-70,'NY REKORD!','#ffd35a');
    confetti(wx,dwarf.y-30);
    sfx.record();
  }

  if(wx>=trackEndX-40){
    run.banked+=run.livePot; run.livePot=0; run.score=run.banked;
    sfx.finish(); flashScreen('#63ff9a',.5);
    endRun(true,'MÅL! Du nåede udgangen i live — hele potten banket.');
    return;
  }

  // Porte
  for(let i=gi;i<gates.length;i++){
    const g=gates[i];
    if(g.x>wx+W) break;
    if(g.used) continue;
    const geom=gateGeom(g);
    if(!g.seen && !save.seenGates[g.type] && g.x>wx && g.x-wx<W*0.72){
      g.seen=true; save.seenGates[g.type]=1;
      floatText(g.x, Math.max(60,geom.y-geom.gap-46), GATE_TIP[g.type], GATE_COLOR[g.type]);
    }
    if(g.x < wx-40){
      g.used=true; g.skipped=true; run.skips++; missionAdd('skips',1);
      run.multiplier *= (1.22 + (st.greed||0)*.55);
      floatText(g.x,geom.y,'SKIP x'+run.multiplier.toFixed(2),'#ff3df2');
      addParticle(g.x,geom.y,'#ff3df2',12,1.1);
      sfx.skip(); pumpMult();
      continue;
    }
    if(Math.abs(g.x-wx)<24 && Math.abs(geom.y-dwarf.y)<geom.gap){
      g.used=true;
      handleGate(g, geom, st);
    }
  }
  while(gates[gi] && gates[gi].used) gi++;

  // Mønter (front-støvsuger)
  const nozzleX=wx+30, nozzleY=dwarf.y-3;
  const vacLen=145+(st.magnet||0)*130+(dwarf.magnet>0?120:0);
  const vacHalf=36+(st.magnet||0)*38+(dwarf.magnet>0?26:0);
  if(simTick*SIM_DT - lastCoinT > 1.4) coinCombo=0;
  for(let i=ci;i<coins.length;i++){
    const c=coins[i];
    if(c.px===null && c.x>wx+W+140) break;
    if(c.taken) continue;
    let cx, cy;
    if(c.px===null){
      const sc=sampleTrack(c.x);
      cx=c.x; cy=lerp(sc.top+35,sc.bot-35,c.tF);
    } else { cx=c.px; cy=c.py; }
    const dx=cx-nozzleX, dy=cy-nozzleY;
    if(dx<-32 || dx>vacLen+40 || Math.abs(dy)>vacHalf+55) continue;
    const cone=vacHalf*(1-clamp(dx/vacLen,0,1)*0.45);
    if(dx>-12 && dx<vacLen && Math.abs(dy)<cone){
      if(c.px===null){ c.px=cx; c.py=cy; }
      const pull=(7.5+(st.magnet||0)*5+(dwarf.magnet>0?5:0))*dt;
      c.px += (nozzleX-c.px)*pull;
      c.py += (nozzleY-c.py)*pull;
      cx=c.px; cy=c.py;
    }
    if(Math.hypot(cx-nozzleX,cy-nozzleY) < 18+c.r){
      c.taken=true;
      const gain=Math.ceil(c.val*(currentMode==='chaos'?2:1)*(1+(st.coin||0)));
      collectedGold+=gain;
      coinCombo++; lastCoinT=simTick*SIM_DT;
      run.livePot += gain*12*run.multiplier; addUlt(0.004);
      missionAdd('coins',gain);
      addParticle(cx,cy,'#ffd35a',6,0.8);
      floatText(cx,cy,'+'+gain+'g','#ffd35a');
      sfx.coin(coinCombo); buzz(8);
    }
  }
  while(ci<coins.length){
    const c=coins[ci];
    const cx=c.px===null?c.x:c.px;
    if(c.taken || cx<camX-80) ci++; else break;
  }


  // Våbenkasser / survival-loot
  for(let i=wi;i<weaponCrates.length;i++){
    const c=weaponCrates[i];
    const baseX=c.px===null?c.x:c.px;
    if(baseX>wx+W+140) break;
    if(c.taken) continue;
    let cx, cy;
    if(c.px===null){
      const sc=sampleTrack(c.x);
      cx=c.x; cy=lerp(sc.top+42,sc.bot-42,c.tF);
    } else { cx=c.px; cy=c.py; }
    const dx=cx-nozzleX, dy=cy-nozzleY;
    const crateVac=vacLen*(c.kind==='weapon'?0.85:0.72);
    if(dx>-18 && dx<crateVac && Math.abs(dy)<vacHalf+34){
      if(c.px===null){ c.px=cx; c.py=cy; }
      const pull=(5.2+(st.magnet||0)*3.5+(dwarf.magnet>0?4:0))*dt;
      c.px += (nozzleX-c.px)*pull;
      c.py += (nozzleY-c.py)*pull;
      cx=c.px; cy=c.py;
    }
    if(Math.hypot(cx-nozzleX,cy-nozzleY)<24+c.r){
      collectWeaponCrate(c,cx,cy);
    }
  }
  while(wi<weaponCrates.length){
    const c=weaponCrates[wi];
    const cx=c.px===null?c.x:c.px;
    if(c.taken || cx<camX-120) wi++; else break;
  }

  // Farer
  for(let i=hi;i<hazards.length;i++){
    const h=hazards[i];
    if(h.x>wx+W) break;
    if(h.dead) continue;
    const sh=sampleTrack(h.x);
    const hy=hazardY(h,sh);
    const d=Math.hypot(h.x-wx,hy-dwarf.y);
    const rr=dwarf.hitR+h.hitR;
    if(d<rr){
      if(dwarf.dash>0 || dwarf.inv>0 || dwarf.shield>0){
        killHazard(h,hy,'PARRY',0.8); smashed++; missionAdd('bats',1);
        sfx.smash();
      } else {
        damageOrEnd(h.type==='bat'?'Flagermus i skægget.':h.type==='rock'?'Sten direkte i karrieren.':'Spiddet. Av.');
        if(state!=='play') return;
      }
    } else if(d<rr+16){
      h.near=true;
    }
    if(!h.dead && h.near && !h.counted && h.x<wx-30){
      h.counted=true; nearCount++;
      run.multiplier+=0.06; run.livePot+=45*run.multiplier; addUlt(0.03);
      floatText(h.x,hy,'TÆT PÅ! +'+Math.floor(45*run.multiplier),'#41e8ff');
      sfx.near(); pumpMult();
    }
  }
  while(hazards[hi] && (hazards[hi].dead || hazards[hi].x<wx-240)) hi++;

  if(simTick%3===0){
    runGhost.push({x:Math.round(wx), f:Math.round(dwarf.y/H*1000)/1000});
    if(runGhost.length>1600) runGhost.shift();
  }

  if(introPhase===1){
    if(inputLevel>0.7) heldT+=dt;
    if(heldT>0.35){ introPhase=2; $('introText').textContent='SLIP = FALD'; }
  } else if(introPhase===2){
    if(!inputDown){ introPhase=0; $('intro').style.display='none'; save.seenIntro=true; }
  }

  hudDirty=true;
}

function damageOrEnd(reason){
  if(dwarf.inv>0) return;
  if(shieldHp>0){
    shieldHp--; dwarf.inv=1.0;
    flash('REDDET! HP -1');
    addParticle(camX+dwarf.sx,dwarf.y,'#41e8ff',22,1.2);
    flashScreen('#41e8ff',.3); shake(10);
    sfx.hit();
    return;
  }
  beginDeath(reason);
}
function beginDeath(reason){
  state='dying';
  deathReason=reason||'Dværgen ramte noget. Sikkert væggen. Den var stor.';
  dieT=0.8;
  const wx=camX+dwarf.sx;
  addParticle(wx,dwarf.y,'#ff9d3d',26,1.8);
  addParticle(wx,dwarf.y,'#ff496c',20,1.4);
  addParticle(wx,dwarf.y,'#bfc7d9',14,1.2);
  flashScreen('#ff496c',.5); shake(22);
  sfx.crash();
  if(introPhase){ introPhase=0; $('intro').style.display='none'; }
  engineUpdate();
}

function handleGate(g, geom, st){
  const run=gameState.run;
  let amount=0, label='';
  if(g.type==='bank'){
    amount=run.livePot*(1.0+(st.bank||0))*(bankBoostT>0?1.5:1);
    run.banked += amount; run.livePot=run.livePot*(st.refund||0);
    run.multiplier=Math.max(1,run.multiplier*(0.52-(st.bank||0)*.05));
    run.skips=0; label='BANK +'+fmt(amount); addUlt(0.05);
    sfx.bank(amount>2500); flashScreen('#63ff9a',.3); freezeT=Math.max(freezeT,0.07); shake(6);
  } else if(g.type==='split'){
    amount=run.livePot*(0.55+(st.split||0));
    run.banked += amount; run.livePot-=amount;
    run.multiplier=Math.max(1,run.multiplier*.78);
    label='SPLIT +'+fmt(amount);
    sfx.split(); flashScreen('#41e8ff',.22); freezeT=Math.max(freezeT,0.05); shake(4);
  } else if(g.type==='greed'){
    run.multiplier *= 1.38+(st.greed||0)*.45;
    run.livePot += 220*run.multiplier;
    label='GRÅDIG x'+run.multiplier.toFixed(2);
    sfx.skip(); flashScreen('#ff3df2',.25); shake(5); pumpMult();
  } else if(g.type==='perfect'){
    const precision=1-Math.abs(geom.y-dwarf.y)/geom.gap;
    if(precision>.72 || autoPerfectN>0){
      if(autoPerfectN>0 && precision<=.72){ autoPerfectN--; floatText(g.x,geom.y-30,'AUTO-PERFEKT','#b388ff'); }
      amount=run.livePot*(0.75+(st.perfect||0));
      run.banked += amount; run.livePot*=.3; run.multiplier*=1.18;
      perfects++;
      label='PERFEKT +'+fmt(amount);
      if(perfects>=3) unlock('perfect');
      sfx.perfect(); flashScreen('#ffd35a',.35); freezeT=Math.max(freezeT,0.07); shake(8);
    } else {
      amount=run.livePot*.35; run.banked+=amount; run.livePot*=.65;
      label='SKÆV +'+fmt(amount);
      sfx.split(); freezeT=Math.max(freezeT,0.04);
    }
  }
  missionAdd('bank',Math.floor(amount));
  addParticle(g.x,geom.y,GATE_COLOR[g.type],20,1.2);
  floatText(g.x,geom.y,label,'#fff');
  if(run.banked>=20000) unlock('bankman');
}
