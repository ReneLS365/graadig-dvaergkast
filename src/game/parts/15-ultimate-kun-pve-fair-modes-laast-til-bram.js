/* ================= ULTIMATE (kun PvE — fair modes låst til Bram) ================= */
function addUlt(n){
  if(state!=='play') return;
  ultCharge = Math.min(1, ultCharge + n*(1+(runStatsCache?(runStatsCache.ultcharge||0):0)));
}
function clearHazardsOnScreen(reason, rmul, scoreEach){
  const run = gameState.run;
  const wx=camX+dwarf.sx; let hit=0;
  for(let i=hi;i<hazards.length;i++){
    const h=hazards[i];
    if(h.x>wx+W) break;
    if(h.dead || h.x<wx-120) continue;
    const sh=sampleTrack(h.x), hy=hazardY(h,sh);
    killHazard(h,hy,reason,rmul||1); smashed++; hit++;
    if(scoreEach) run.livePot+=scoreEach*run.multiplier;
  }
  if(hit) missionAdd('bats',hit);
  return hit;
}
function triggerUltimate(){
  if(state!=='play' || ultCharge<1) return;
  ultCharge=0; ultFlashT=0.6;
  const run = gameState.run;
  const c=CHARACTERS[runChar]||CHARACTERS.bram;
  const wx=camX+dwarf.sx;
  flash(c.ultName.toUpperCase()+'!');
  flashScreen(c.color||'#ffd35a',.42); shake(16); sfx.record(); buzz(40);
  confetti(wx,dwarf.y-30);
  switch(runChar){
    case 'bram':{ // Guldregn
      const grab=run.livePot*0.55*2;
      run.banked+=grab; run.livePot*=0.45; bankBoostT=4; run.multiplier=Math.max(1,run.multiplier*1.12);
      floatText(wx,dwarf.y-60,'GULDREGN +'+fmt(grab),'#ffd35a');
      for(let i=0;i<3;i++) addParticle(wx+i*8,dwarf.y,'#ffd35a',18,1.4);
      sfx.bank(true); break; }
    case 'ragnar':{ // Blodrus
      run.multiplier*=1.8; dwarf.inv=3.5; dwarf.over=3.5; run.livePot+=300*run.multiplier;
      floatText(wx,dwarf.y-60,'BLODRUS x'+run.multiplier.toFixed(2),'#ff496c');
      flashScreen('#ff3df2',.3); pumpMult(); break; }
    case 'frida':{ // Nålestik
      dwarf.slow=4; autoPerfectN=3; dwarf.inv=1.2;
      floatText(wx,dwarf.y-60,'NÅLESTIK · 3 auto-perfekt','#b388ff');
      flashScreen('#41e8ff',.3); sfx.perfect(); break; }
    case 'ulf':{ // Jordskælv
      const hit=clearHazardsOnScreen('SKÆLV',1.2,120);
      shieldHp=Math.min(ultShieldCap(), shieldHp+2);
      run.livePot+=400*run.multiplier;
      floatText(wx,dwarf.y-60,'JORDSKÆLV · '+hit+' knust','#ffb347');
      sfx.smash(); break; }
    case 'sigrid':{ // Krudttønde
      let hit=0;
      for(let i=hi;i<hazards.length;i++){
        const h=hazards[i];
        if(h.x>wx+W*1.3) break;
        if(h.dead || h.x<wx-60) continue;
        const sh=sampleTrack(h.x), hy=hazardY(h,sh);
        killHazard(h,hy,'SPRÆNG',1.5); smashed++; hit++;
      }
      if(hit) missionAdd('bats',hit);
      run.livePot+=520*run.multiplier; gainScrap(60+hit*8, wx, dwarf.y);
      floatText(wx,dwarf.y-60,'KRUDTTØNDE · '+hit+' væk','#ff7a3d');
      sfx.smash(); shake(20); break; }
    case 'grim':{ // Støvsuger-storm
      let got=0;
      for(let i=ci;i<coins.length;i++){
        const co=coins[i];
        const cx=co.px===null?co.x:co.px;
        if(cx>wx+W) break;
        if(co.taken || cx<camX-80) continue;
        co.taken=true;
        const gain=Math.ceil(co.val*(1+(runStatsCache.coin||0)));
        collectedGold+=gain; run.livePot+=gain*12*run.multiplier; got+=gain;
      }
      for(let i=wi;i<weaponCrates.length;i++){
        const cr=weaponCrates[i];
        const cx=cr.px===null?cr.x:cr.px;
        if(cx>wx+W) break;
        if(cr.taken || cx<camX-120) continue;
        collectWeaponCrate(cr,cx,cr.py||dwarf.y);
      }
      run.livePot+=got*4*run.multiplier;
      floatText(wx,dwarf.y-60,'STØVSUGER-STORM +'+fmt(got)+'g','#ffd35a');
      sfx.coin(6); break; }
    case 'thorin':{ // Sidste Ord
      shieldHp=ultShieldCap(); run.multiplier*=1.5; dwarf.over=3; dwarf.inv=1.5;
      clearHazardsOnScreen('SIDSTE ORD',1,80);
      run.livePot+=260*run.multiplier;
      floatText(wx,dwarf.y-60,'SIDSTE ORD · fuld HP','#63ff9a');
      flashScreen('#63ff9a',.32); pumpMult(); break; }
    case 'volund':{ // Rune-overladning
      weaponBoostT=6; run.multiplier*=1.35; dwarf.inv=1.0;
      floatText(wx,dwarf.y-60,'RUNE-OVERLADNING · våben x1.6','#7CF6E3');
      flashScreen('#7CF6E3',.32); sfx.skip(); pumpMult(); break; }
    default: run.livePot+=200*run.multiplier;
  }
  run.score=run.banked+run.livePot;
  hudDirty=true;
}
function ultShieldCap(){ return modeMods.survival?6:5; }
