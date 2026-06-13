/* ================= EVNE ================= */
function triggerAbility(){
  if(state!=='play'||hammerCd>0) return;
  const st=runStatsCache;
  const ab = modeMods.fair ? 'hammer' : save.selected.ability;
  hammerCd = Math.max(.9, 1.8 - (st.hammer||0) - (st.cd||0));
  if(ab==='dash'){
    dwarf.dash=.36; dwarf.inv=.36; flash('BERSÆRK DASH');
    addParticle(camX+dwarf.sx,dwarf.y,'#ff9d3d',24,1.5);
    sfx.skip();
  }else if(ab==='shield'){
    dwarf.shield=2.2; dwarf.inv=.5; flash('SKJOLDBRØL');
    addParticle(camX+dwarf.sx,dwarf.y,'#41e8ff',20,1.1);
    sfx.split();
  }else if(ab==='magnet'){
    dwarf.magnet=3.8; flash('GULDMAGNET');
    addParticle(camX+dwarf.sx,dwarf.y,'#ffd35a',18,1);
    sfx.coin(4);
  }else if(ab==='drill'){
    flash('TUNNELBOR!');
    drillBlast();
  }else if(ab==='chrono'){
    dwarf.slow=2.15; dwarf.inv=.35; flash('TIDSSPRÆKKE');
    flashScreen('#41e8ff',.28); sfx.perfect(); shake(5);
  }else if(ab==='overcharge'){
    dwarf.over=2.2; mult*=1.42; livePot+=260*mult; flash('OVERLADNING x'+mult.toFixed(2));
    flashScreen('#ff3df2',.32); sfx.skip(); pumpMult(); shake(8);
  }else{
    flash('HAMMER!');
    smashAhead();
  }
  buzz(15);
}

function drillBlast(){
  const wx=camX+dwarf.sx;
  let hit=0;
  for(let i=hi;i<hazards.length;i++){
    const h=hazards[i];
    if(h.x>wx+260) break;
    if(h.dead) continue;
    const sh=sampleTrack(h.x), hy=hazardY(h,sh);
    if(h.x>wx-25 && Math.abs(hy-dwarf.y)<115){
      killHazard(h,hy,'BOR',1.25); hit++; smashed++;
    }
  }
  if(hit){ sfx.smash(); shake(13); flashScreen('#ff9d3d',.28); missionAdd('bats',hit); }
  else { sfx.ui(); }
}

function smashAhead(){
  const wx=camX+dwarf.sx;
  let hit=0;
  for(let i=hi;i<hazards.length;i++){
    const h=hazards[i];
    if(h.x>wx+170) break;
    if(h.dead) continue;
    const s=sampleTrack(h.x);
    const hy=hazardY(h,s);
    const dx=h.x-wx, dy=hy-dwarf.y;
    if(dx>-20 && dx<150 && Math.abs(dy)<80){
      killHazard(h,hy,'SMASH',1); hit++; smashed++;
    }
  }
  if(hit){ sfx.smash(); shake(7); missionAdd('bats',hit); if(smashed>=10) unlock('batkiller'); }
  else sfx.ui();
}
