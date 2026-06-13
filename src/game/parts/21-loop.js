/* ================= LOOP ================= */
function loop(){
  if(state==='menu' || state==='over' || state==='pause') return;
  const n=now();
  const dt=Math.min(0.1, n-last);
  last=n;
  if(state==='play'){
    if(freezeT>0){
      freezeT-=dt;
    } else {
      acc+=dt;
      let steps=0;
      while(acc>=SIM_DT && steps<5){
        stepSim();
        acc-=SIM_DT;
        steps++;
        if(state!=='play') break;
      }
      if(steps>=5) acc=0;
    }
  } else if(state==='dying'){
    dieT-=dt;
    if(dieT<=0){
      endRun(false, deathReason);
      return;
    }
  }
  syncRunStateFromLegacy();
  const fxScale = state==='dying' ? 0.35 : 1;
  updateFX(dt*fxScale, dt);
  draw(state==='play' ? clamp(acc/SIM_DT,0,1) : 0);
  engineUpdate();
  heartbeatUpdate(dt);
  hudTick(dt);
  requestAnimationFrame(loop);
}
function updateFX(dt, realDt){
  for(const p of particles){ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=220*dt; p.life-=dt; }
  particles=particles.filter(function(p){return p.life>0;});
  for(const f of floating){ f.y-=35*dt; f.life-=dt*0.8; }
  floating=floating.filter(function(f){return f.life>0;});
  shakeMag=Math.max(0, shakeMag - realDt*46);
  flashA=Math.max(0, flashA - realDt*1.6);
}
