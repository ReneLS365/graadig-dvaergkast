/* ================= VERDEN (resize-sikker: y gemmes som brøker) ================= */
function makeTrack(seed){
  const r=mulberry32(seed^0xABCDEF);
  const points=[];
  let center=0.5, width=0.34;
  const N=(modeMods && modeMods.length) ? modeMods.length : 150;
  for(let i=0;i<N;i++){
    center = clamp(center + (r()-.5)*0.14, .23, .77);
    const shrink = Math.min(.19, i/N*.17);
    width = clamp((.38 - shrink + (r()-.5)*.05) * ((modeMods && modeMods.width) || 1), .135, .46);
    if(i%17===0) width*=0.72;
    points.push({x:i*190, c:center, w:width});
  }
  trackEndX=(N-1)*190;
  return points;
}
function sampleTrack(x){
  const step=190;
  const i=clamp(Math.floor(x/step),0,track.length-2);
  const t=clamp((x-track[i].x)/step,0,1);
  const c=lerp(track[i].c,track[i+1].c,t);
  const w=lerp(track[i].w,track[i+1].w,t);
  const mid=c*H, half=w*H;
  return {top:mid-half, bot:mid+half, mid, half};
}
function makeGates(seed){
  const r=mulberry32(seed^0x12345);
  const arr=[];
  const types=['bank','split','greed','perfect'];
  let x=560;
  for(let i=0;i<60;i++){
    x += 360 + r()*210;
    if(x>trackEndX-700) break;
    const type=types[Math.floor(r()*types.length)];
    arr.push({
      x, type,
      o:(r()-.5)*2,
      decay:Math.max(.62, 1-i*.006),
      gapBase: type==='perfect'?0.082:0.108,
      used:false, skipped:false, seen:false
    });
  }
  return arr;
}
function gateGeom(g){
  const s=sampleTrack(g.x);
  const gap=g.gapBase*H*g.decay;
  const y=clamp(s.mid + g.o*s.half*1.15, s.top+gap, s.bot-gap);
  return {y,gap};
}
function makeCoins(seed,mods){
  const r=mulberry32(seed^0x9876);
  const arr=[];
  const n=Math.floor(185*mods.coins);
  for(let i=0;i<n;i++){
    const x=340+r()*(trackEndX-1100);
    const tF=r();
    const val=r()<.12?5:1;
    arr.push({x,tF,val,taken:false,r:(val===5?8:5),px:null,py:0});
  }
  arr.sort(function(a,b){return a.x-b.x;});
  return arr;
}
function makeHazards(seed,mods){
  const r=mulberry32(seed^0xFEED);
  const arr=[];
  const n=Math.floor(132*mods.hazards);
  const sv=(mods&&mods.survival)?1.22:1;
  for(let i=0;i<n;i++){
    const x=760+r()*(trackEndX-1400);
    const roll=r();
    // bat ~38% · rock ~26% · spike ~16% · saw ~13% · crystal ~7%
    const type = roll<.38?'bat' : roll<.64?'rock' : roll<.80?'spike' : roll<.93?'saw' : 'crystal';
    const baseHp = type==='rock'?2.2 : type==='bat'?1.0 : type==='spike'?1.7 : type==='saw'?3.6 : 7.0;
    // jo længere inde i banen, jo sejere farer — belønner våben-investering og holder presset oppe
    const depth = 1 + (x/Math.max(1,trackEndX))*0.85;
    const hp = baseHp * sv * depth * (type==='crystal'?(1+ (mods&&mods.survival?0.5:0)):1);
    arr.push({
      x,type,
      edge:r()<.5?'top':'bot',
      tF:r(),
      phase:r()*Math.PI*2,
      amp: type==='saw' ? (26+r()*24) : (8+r()*9),
      dead:false, near:false, counted:false,
      r:(type==='rock'?17:type==='bat'?14:type==='spike'?20:type==='saw'?22:19),
      hitR:(type==='rock'?10:type==='bat'?6.5:type==='spike'?12:type==='saw'?12.5:11),
      hp:hp, hpMax:hp
    });
  }
  arr.sort(function(a,b){return a.x-b.x;});
  return arr;
}

function makeWeaponCrates(seed,mods){
  const r=mulberry32(seed^0xC0FFEE);
  const arr=[];
  const n=Math.floor((mods&&mods.survival?58:20) * ((mods&&mods.coins)||1));
  for(let i=0;i<n;i++){
    const x=520 + r()*(trackEndX-950);
    const roll=r();
    const kind = roll<0.24 ? 'weapon' : roll<0.70 ? 'scrap' : roll<0.84 ? 'medkit' : 'relic';
    const weights = kind==='weapon'
      ? (r()<.52?'crossbow':r()<.75?'chain':r()<.89?'blunder':r()<.97?'drillgun':'runeblade')
      : null;
    arr.push({x,tF:r(),kind,weapon:weights,taken:false,px:null,py:0,r:13});
  }
  arr.sort(function(a,b){return a.x-b.x;});
  return arr;
}

function hazardY(h,s){
  if(h.type==='spike') return h.edge==='top'? s.top+12 : s.bot-12;
  const base=lerp(s.top+35,s.bot-35,h.tF);
  if(h.type==='bat') return base + Math.sin(simTick*SIM_DT*4 + h.phase)*h.amp;
  if(h.type==='saw') return base + Math.sin(simTick*SIM_DT*6 + h.phase)*h.amp;
  return base; // rock + crystal stationary
}
function loadGhost(seed){
  const g=save.ghosts2[String(seed)];
  if(!g || !Array.isArray(g.path) || g.path.length<4) return null;
  return g;
}
function saveGhost(seed,path,scoreVal){
  const k=String(seed);
  const old=save.ghosts2[k];
  if(!old || scoreVal>old.score){
    save.ghosts2[k]={score:scoreVal,path:path.slice(0,1600)};
    const keys=Object.keys(save.ghosts2);
    if(keys.length>25) delete save.ghosts2[keys[0]];
  }
}
