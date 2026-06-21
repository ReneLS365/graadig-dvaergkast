/* ================= TEGNING ================= */
function draw(alpha){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const cam = lerp(pCamX, camX, alpha);
  const dy = lerp(dwarf.py, dwarf.y, alpha);
  let shx=0, shy=0;
  if(shakeMag>0.2){ shx=(Math.random()-0.5)*shakeMag; shy=(Math.random()-0.5)*shakeMag; }
  drawBackground(cam);
  ctx.save();
  ctx.translate(shx, shy);
  drawTrack(cam);
  drawSurvivalCore(cam);
  drawFlags(cam);
  drawGhost(cam);
  if(state==='play') drawVacuum(dy);
  drawGates(cam);
  drawCoins(cam);
  drawWeaponCrates(cam);
  drawHazards(cam);
  if(state==='play') drawDwarf(dy);
  drawParticles(cam);
  ctx.restore();
  ctx.drawImage(vignCanvas,0,0,W,H);
  if(state==='play'){
    const danger=clamp((gameState.run.multiplier-8)/14,0,1);
    if(danger>0.02){
      ctx.globalAlpha=danger*(0.45+0.45*Math.sin(now()*6));
      ctx.drawImage(dangerCanvas,0,0,W,H);
      ctx.globalAlpha=1;
    }
  }
  if(flashA>0){
    ctx.globalAlpha=Math.min(0.55,flashA);
    ctx.fillStyle=flashCol;
    ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=1;
  }
}
function drawBackground(cam){
  ctx.fillStyle='#070711';
  ctx.fillRect(0,0,W,H);
  buildStars();
  ctx.globalAlpha=0.5;
  const o1=-((cam*0.12)%512);
  for(let x=o1-512;x<W+512;x+=512){
    ctx.drawImage(starFar,x,0);
    if(H>512) ctx.drawImage(starFar,x,512);
  }
  ctx.globalAlpha=0.6;
  const o2=-((cam*0.3)%512);
  for(let x=o2-512;x<W+512;x+=512){
    ctx.drawImage(starNear,x,64);
    if(H>576) ctx.drawImage(starNear,x,576);
  }
  ctx.globalAlpha=0.10;
  ctx.strokeStyle='#41e8ff';
  ctx.lineWidth=1;
  const off=(cam*0.6)%73;
  ctx.beginPath();
  for(let i=0;i<14;i++){
    const y=(i*73+off)%H;
    ctx.moveTo(0,y); ctx.lineTo(W,y-30);
  }
  ctx.stroke();
  ctx.globalAlpha=1;
}
function drawTrack(cam){
  const start=cam-80, end=cam+W+120;
  ctx.beginPath();
  let first=true;
  for(let x=start;x<end;x+=42){
    const s=sampleTrack(x);
    if(first){ctx.moveTo(x-cam,s.top); first=false;} else ctx.lineTo(x-cam,s.top);
  }
  for(let x=end;x>=start;x-=42){
    const s=sampleTrack(x);
    ctx.lineTo(x-cam,s.bot);
  }
  ctx.closePath();
  if(!trackGrad){
    trackGrad=ctx.createLinearGradient(0,0,W,H);
    trackGrad.addColorStop(0,'#11113a'); trackGrad.addColorStop(1,'#191019');
  }
  ctx.fillStyle=trackGrad;
  ctx.fill();
  strokeWall(cam,start,end,'top','#41e8ff');
  strokeWall(cam,start,end,'bot','#ff3df2');
}
function strokeWall(cam,start,end,which,color){
  ctx.lineJoin='round';
  ctx.strokeStyle=color;
  const passes=[[13,0.20],[4,1]];
  for(let p=0;p<2;p++){
    ctx.lineWidth=passes[p][0]; ctx.globalAlpha=passes[p][1];
    ctx.beginPath();
    let first=true;
    for(let x=start;x<end;x+=30){
      const s=sampleTrack(x);
      const y=which==='top'?s.top:s.bot;
      if(first){ctx.moveTo(x-cam,y); first=false;} else ctx.lineTo(x-cam,y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha=1;
}
function drawSurvivalCore(cam){
  const core=gameState.run.core;
  if(!core.active) return;
  const x=survivalCoreWorldX();
  const sxx=x-cam;
  if(sxx<-80||sxx>W+80) return;
  const s=sampleTrack(x);
  const y=s.mid;
  const hpPct=core.maxHp>0 ? clamp(core.hp/core.maxHp,0,1) : 0;
  ctx.save();
  ctx.globalAlpha=0.16;
  ctx.fillStyle='#ff496c';
  ctx.fillRect(Math.max(0,sxx-5),s.top+10,Math.min(90,W-sxx+5),s.bot-s.top-20);
  ctx.globalAlpha=0.95;
  ctx.strokeStyle='#ff496c';
  ctx.lineWidth=4;
  ctx.setLineDash([9,7]);
  ctx.beginPath(); ctx.moveTo(sxx,s.top+10); ctx.lineTo(sxx,s.bot-10); ctx.stroke();
  ctx.setLineDash([]);
  ctx.font='900 10px system-ui';
  ctx.textAlign='left';
  ctx.fillStyle='#ffb0bf';
  ctx.fillText('BREACH',sxx+8,s.top+24);
  ctx.globalAlpha=1;
  ctx.fillStyle='#111124';
  ctx.strokeStyle=core.hp<=3?'#ff496c':'#63ff9a';
  ctx.lineWidth=3;
  ctx.beginPath(); ctx.arc(sxx,y,18,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#0008';
  ctx.fillRect(sxx-26,y+25,52,8);
  ctx.fillStyle=core.hp<=3?'#ff496c':'#63ff9a';
  ctx.fillRect(sxx-26,y+25,52*hpPct,8);
  ctx.strokeStyle='#ffffff44';
  ctx.lineWidth=1;
  ctx.strokeRect(sxx-26,y+25,52,8);
  ctx.fillStyle=ctx.strokeStyle;
  ctx.font='900 11px system-ui';
  ctx.textAlign='center';
  ctx.fillText('CORE',sxx,y-28);
  ctx.fillText(core.hp+'/'+core.maxHp,sxx,y+45);
  ctx.restore();
}

function drawFlags(cam){
  if(save.bestDist>800 && save.bestDist<trackEndX-200) drawFlag(cam, save.bestDist, '#ffd35a', 'REKORD');
  drawFlag(cam, trackEndX-40, '#63ff9a', 'MÅL');
}
function drawFlag(cam,x,color,label){
  const sxx=x-cam;
  if(sxx<-60||sxx>W+60) return;
  const s=sampleTrack(x);
  ctx.strokeStyle='#bfc7d9'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(sxx,s.top+6); ctx.lineTo(sxx,s.top+58); ctx.stroke();
  ctx.fillStyle=color;
  ctx.beginPath(); ctx.moveTo(sxx,s.top+8); ctx.lineTo(sxx+34,s.top+18); ctx.lineTo(sxx,s.top+28); ctx.closePath(); ctx.fill();
  ctx.font='900 11px system-ui'; ctx.textAlign='left';
  ctx.fillText(label, sxx+4, s.top+72);
}
function drawGhost(cam){
  if(!ghost) return;
  ctx.globalAlpha=0.25;
  ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.5;
  ctx.beginPath();
  let first=true;
  const p=ghost.path;
  for(let i=0;i<p.length;i+=2){
    const gx=p[i].x-cam;
    if(gx<-60){first=true; continue;}
    if(gx>W+60) break;
    const gy=p[i].f*H;
    if(first){ctx.moveTo(gx,gy); first=false;} else ctx.lineTo(gx,gy);
  }
  ctx.stroke();
  ctx.globalAlpha=1;
}
function drawVacuum(dy){
  const st=runStatsCache;
  const x=dwarf.sx+26, y=dy-3;
  const len=145+(st.magnet||0)*130+(dwarf.magnet>0?120:0);
  const half=36+(st.magnet||0)*38+(dwarf.magnet>0?26:0);
  ctx.save();
  ctx.globalAlpha=dwarf.magnet>0?.30:.16;
  const grd=ctx.createLinearGradient(x,y,x+len,y);
  grd.addColorStop(0,'#ffd35aaa'); grd.addColorStop(.45,'#41e8ff55'); grd.addColorStop(1,'#41e8ff00');
  ctx.fillStyle=grd;
  ctx.beginPath();
  ctx.moveTo(x,y-14);
  ctx.quadraticCurveTo(x+len*.45,y-half,x+len,y-half*.45);
  ctx.lineTo(x+len,y+half*.45);
  ctx.quadraticCurveTo(x+len*.45,y+half,x,y+14);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
function drawGates(cam){
  ctx.textAlign='center';
  ctx.font='900 12px system-ui';
  for(let i=gi;i<gates.length;i++){
    const g=gates[i];
    const sxx=g.x-cam;
    if(sxx>W+80) break;
    if(g.used||sxx<-80) continue;
    const geom=gateGeom(g);
    const col=GATE_COLOR[g.type];
    const pulse=1+0.10*Math.sin(now()*5+g.x*0.01);
    ctx.strokeStyle=col;
    ctx.globalAlpha=0.25; ctx.lineWidth=11*pulse;
    ctx.beginPath(); ctx.moveTo(sxx,geom.y-geom.gap); ctx.lineTo(sxx,geom.y+geom.gap); ctx.stroke();
    ctx.globalAlpha=1; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(sxx,geom.y-geom.gap); ctx.lineTo(sxx,geom.y+geom.gap); ctx.stroke();
    const spr=glowSprite(col);
    ctx.drawImage(spr,sxx-13,geom.y-geom.gap-13,26,26);
    ctx.drawImage(spr,sxx-13,geom.y+geom.gap-13,26,26);
    ctx.fillStyle=col;
    const lbl=g.type==='bank'?'BANK':g.type==='split'?'SPLIT':g.type==='greed'?'GRÅDIG':'PERFEKT';
    ctx.fillText(lbl,sxx,geom.y-geom.gap-10);
    if(g.type==='perfect'){
      ctx.globalAlpha=0.85;
      ctx.fillRect(sxx-7,geom.y-2,14,4);
      ctx.globalAlpha=1;
    }
  }
}
function drawCoins(cam){
  if(!coinSpr1){ coinSpr1=makeCoinSprite(false); coinSpr5=makeCoinSprite(true); }
  for(let i=ci;i<coins.length;i++){
    const c=coins[i];
    const cx=c.px===null?c.x:c.px;
    const sxx=cx-cam;
    if(c.px===null && sxx>W+60) break;
    if(c.taken||sxx<-40||sxx>W+60) continue;
    let cy;
    if(c.px===null){
      const s=sampleTrack(c.x);
      cy=lerp(s.top+35,s.bot-35,c.tF);
    } else cy=c.py;
    const spr=c.val===5?coinSpr5:coinSpr1;
    ctx.drawImage(spr,sxx-spr.width/2,cy-spr.height/2);
  }
}

function drawWeaponCrates(cam){
  for(let i=wi;i<weaponCrates.length;i++){
    const c=weaponCrates[i];
    const cx=c.px===null?c.x:c.px;
    const sxx=cx-cam;
    if(c.px===null && sxx>W+80) break;
    if(c.taken||sxx<-60||sxx>W+80) continue;
    let cy;
    if(c.px===null){
      const sc=sampleTrack(c.x);
      cy=lerp(sc.top+42,sc.bot-42,c.tF);
    } else cy=c.py;
    const col=c.kind==='weapon'?'#ffd35a':c.kind==='medkit'?'#63ff9a':c.kind==='relic'?'#ff3df2':'#bfc7d9';
    ctx.save();
    ctx.translate(sxx,cy);
    ctx.rotate(Math.sin(now()*3+c.x*.01)*0.12);
    ctx.fillStyle='#111124';
    ctx.strokeStyle=col;
    ctx.lineWidth=3;
    ctx.shadowColor=col;
    ctx.shadowBlur=12;
    roundRect(ctx,-13,-13,26,26,6,true,true);
    ctx.shadowBlur=0;
    ctx.fillStyle=col;
    ctx.font='900 15px system-ui';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(c.kind==='weapon'?'⚔':c.kind==='medkit'?'+':c.kind==='relic'?'✦':'⚙',0,1);
    ctx.restore();
  }
}

function drawHazards(cam){
  for(let i=hi;i<hazards.length;i++){
    const h=hazards[i];
    const sxx=h.x-cam;
    if(sxx>W+80) break;
    if(h.dead||sxx<-80) continue;
    const s=sampleTrack(h.x);
    const y=hazardY(h,s);
    if(h.type==='bat'){
      ctx.drawImage(glowSprite('#ff3df2'),sxx-20,y-20,40,40);
      ctx.strokeStyle='#ff3df2'; ctx.fillStyle='#260026'; ctx.lineWidth=3;
      const flap=Math.sin(now()*14+h.phase)*6;
      ctx.beginPath();
      ctx.moveTo(sxx,y); ctx.quadraticCurveTo(sxx-22,y-20+flap,sxx-34,y+5);
      ctx.quadraticCurveTo(sxx-10,y-5,sxx,y);
      ctx.moveTo(sxx,y); ctx.quadraticCurveTo(sxx+22,y-20+flap,sxx+34,y+5);
      ctx.quadraticCurveTo(sxx+10,y-5,sxx,y);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(sxx,y,8,0,Math.PI*2); ctx.fill();
    } else if(h.type==='rock'){
      ctx.fillStyle='#7f879c';
      ctx.beginPath();
      for(let k=0;k<8;k++){
        const a=k/8*Math.PI*2, rr=h.r*(.75+((k*31)%9)/18);
        const px=sxx+Math.cos(a)*rr, py=y+Math.sin(a)*rr;
        if(k===0)ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#2a2f3d'; ctx.lineWidth=2; ctx.stroke();
    } else if(h.type==='saw'){
      const spin=now()*9+h.phase;
      ctx.save(); ctx.translate(sxx,y); ctx.rotate(spin);
      ctx.fillStyle='#9aa3b5'; ctx.strokeStyle='#3a4150'; ctx.lineWidth=2;
      ctx.beginPath();
      const teeth=10;
      for(let k=0;k<teeth*2;k++){
        const a=k/(teeth*2)*Math.PI*2;
        const rr=(k%2===0)?h.r:h.r*0.68;
        const px=Math.cos(a)*rr, py=Math.sin(a)*rr;
        if(k===0)ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#2a2f3d'; ctx.beginPath(); ctx.arc(0,0,h.r*0.3,0,Math.PI*2); ctx.fill();
      ctx.restore();
      if(h.hpMax>1 && h.hp<h.hpMax){
        ctx.fillStyle='#ff496c'; ctx.fillRect(sxx-h.r,y-h.r-7,h.r*2*(h.hp/h.hpMax),3);
      }
    } else if(h.type==='crystal'){
      const pulse=0.5+0.5*Math.sin(now()*4+h.phase);
      ctx.drawImage(glowSprite('#7CF6E3'),sxx-26,y-26,52,52);
      ctx.save(); ctx.translate(sxx,y);
      const g=ctx.createLinearGradient(0,-h.r,0,h.r);
      g.addColorStop(0,'#b388ff'); g.addColorStop(.5,'#7CF6E3'); g.addColorStop(1,'#41e8ff');
      ctx.fillStyle=g; ctx.strokeStyle='#eafcff'; ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(0,-h.r); ctx.lineTo(h.r*0.7,-h.r*0.2);
      ctx.lineTo(h.r*0.45,h.r); ctx.lineTo(-h.r*0.45,h.r);
      ctx.lineTo(-h.r*0.7,-h.r*0.2); ctx.closePath();
      ctx.globalAlpha=0.85+0.15*pulse; ctx.fill(); ctx.globalAlpha=1; ctx.stroke();
      ctx.strokeStyle='#ffffff66'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,-h.r); ctx.lineTo(0,h.r);
      ctx.moveTo(-h.r*0.7,-h.r*0.2); ctx.lineTo(h.r*0.7,-h.r*0.2); ctx.stroke();
      ctx.restore();
      ctx.fillStyle='#0a0f17cc'; ctx.fillRect(sxx-h.r,y-h.r-9,h.r*2,4);
      ctx.fillStyle='#7CF6E3'; ctx.fillRect(sxx-h.r,y-h.r-9,h.r*2*(h.hp/h.hpMax),4);
    } else {
      ctx.drawImage(glowSprite('#ff496c'),sxx-22,y-22,44,44);
      ctx.fillStyle='#ff496c';
      ctx.beginPath();
      if(h.edge==='top'){ ctx.moveTo(sxx,y+h.r); ctx.lineTo(sxx+h.r,y-h.r); ctx.lineTo(sxx-h.r,y-h.r); }
      else { ctx.moveTo(sxx,y-h.r); ctx.lineTo(sxx+h.r,y+h.r); ctx.lineTo(sxx-h.r,y+h.r); }
      ctx.closePath(); ctx.fill();
    }
  }
}
function drawDwarf(dy){
  const x=dwarf.sx, y=dy;
  ctx.save();
  if(dwarf.inv>0){
    ctx.globalAlpha=0.55+0.45*Math.sin(now()*30);
  }
  ctx.translate(x,y); ctx.rotate(dwarf.rot*.55);
  if(dwarf.inv>0 || dwarf.shield>0){
    ctx.strokeStyle=dwarf.shield>0?'#41e8ff':'#ffffff';
    ctx.lineWidth=3;
    ctx.globalAlpha=.8;
    ctx.beginPath(); ctx.arc(0,0,30,0,Math.PI*2); ctx.stroke();
    ctx.globalAlpha=dwarf.inv>0 ? 0.55+0.45*Math.sin(now()*30) : 1;
  }
  const grd=ctx.createRadialGradient(-30,0,2,-30,0,35);
  grd.addColorStop(0,'#fff'); grd.addColorStop(.3,'#ff9d3d'); grd.addColorStop(1,'#ff3d3d00');
  ctx.fillStyle=grd;
  ctx.beginPath(); ctx.ellipse(-34,0,38,14,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#5b3618'; ctx.lineWidth=5; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-2,15); ctx.lineTo(-18,26); ctx.moveTo(8,14); ctx.lineTo(22,25); ctx.stroke();
  ctx.fillStyle='#3b78ff'; ctx.strokeStyle='#101020'; ctx.lineWidth=2;
  roundRect(ctx,-16,-8,32,30,9,true,true);
  ctx.fillStyle='#2a2a35'; ctx.strokeStyle='#41e8ff'; ctx.lineWidth=2;
  roundRect(ctx,18,-6,22,13,5,true,true);
  ctx.fillStyle='#080812'; ctx.beginPath(); ctx.arc(40,0,6,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#ffd35a'; ctx.font='900 8px system-ui'; ctx.textAlign='center';
  ctx.fillText((WEAPONS[currentWeaponKey()]?WEAPONS[currentWeaponKey()].name[0]:'Ø'),29,-10);
  ctx.strokeStyle='#101020';
  ctx.fillStyle='#f1b278';
  ctx.beginPath(); ctx.arc(4,-18,15,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#c96f2a';
  ctx.beginPath();
  ctx.moveTo(-10,-12); ctx.quadraticCurveTo(4,16,20,-10); ctx.quadraticCurveTo(6,2,-10,-12); ctx.fill();
  ctx.fillStyle='#bfc7d9'; ctx.beginPath(); ctx.arc(4,-24,16,Math.PI,0); ctx.fill(); ctx.stroke();
  ctx.strokeStyle='#ffd35a'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(-8,-31); ctx.lineTo(-22,-42); ctx.moveTo(16,-31); ctx.lineTo(31,-42); ctx.stroke();
  ctx.fillStyle='#050505'; ctx.beginPath(); ctx.arc(0,-19,2,0,Math.PI*2); ctx.arc(10,-19,2,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#5b3618'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(17,1); ctx.lineTo(32,-15); ctx.stroke();
  ctx.fillStyle='#929bad'; ctx.strokeStyle='#101020'; ctx.lineWidth=2;
  roundRect(ctx,25,-24,24,12,3,true,true);
  ctx.globalAlpha=.18; ctx.strokeStyle='#63ff9a'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(0,0,dwarf.hitR,0,Math.PI*2); ctx.stroke();
  ctx.restore();
}
function roundRect(c,x,y,w,h,r,fill,stroke){
  c.beginPath();
  c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath();
  if(fill)c.fill(); if(stroke)c.stroke();
}
function drawParticles(cam){
  for(const p of particles){
    ctx.globalAlpha=clamp(p.life*2.2,0,1);
    ctx.drawImage(glowSprite(p.color),p.x-cam-7,p.y-7,14,14);
  }
  ctx.globalAlpha=1;
  ctx.font='900 15px system-ui';
  ctx.textAlign='center';
  for(const f of floating){
    ctx.globalAlpha=clamp(f.life,0,1);
    ctx.fillStyle='#000';
    ctx.fillText(f.text,f.x-cam+1.5,f.y+1.5);
    ctx.fillStyle=f.color;
    ctx.fillText(f.text,f.x-cam,f.y);
  }
  ctx.globalAlpha=1;
}
function drawIdle(){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.fillStyle='#070711'; ctx.fillRect(0,0,W,H);
  buildStars();
  ctx.globalAlpha=.5;
  for(let x=0;x<W+512;x+=512){ ctx.drawImage(starFar,x,0); if(H>512) ctx.drawImage(starFar,x,512); }
  ctx.globalAlpha=1;
}
