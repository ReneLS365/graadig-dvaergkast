/* ================= SPRITES (erstatter shadowBlur => mobil-fps) ================= */
const spriteCache={};
function glowSprite(color){
  if(spriteCache[color]) return spriteCache[color];
  const s=48;
  const c=document.createElement('canvas'); c.width=s; c.height=s;
  const g=c.getContext('2d');
  const grd=g.createRadialGradient(s/2,s/2,1,s/2,s/2,s/2);
  grd.addColorStop(0,color);
  grd.addColorStop(0.4,color+'aa');
  grd.addColorStop(1,color+'00');
  g.fillStyle=grd;
  g.fillRect(0,0,s,s);
  spriteCache[color]=c;
  return c;
}
let coinSpr1=null, coinSpr5=null;
function makeCoinSprite(big){
  const r=big?8:5, pad=13, s=(r+pad)*2;
  const c=document.createElement('canvas'); c.width=s; c.height=s;
  const g=c.getContext('2d');
  const grd=g.createRadialGradient(s/2,s/2,1,s/2,s/2,s/2);
  grd.addColorStop(0,'#ffd35a'); grd.addColorStop(0.45,'#ffd35a55'); grd.addColorStop(1,'#ffd35a00');
  g.fillStyle=grd; g.fillRect(0,0,s,s);
  g.fillStyle='#ffd35a'; g.beginPath(); g.arc(s/2,s/2,r,0,Math.PI*2); g.fill();
  g.fillStyle='#8a5d00'; g.beginPath(); g.arc(s/2,s/2,r*0.55,0,Math.PI*2); g.fill();
  if(big){ g.fillStyle='#ffd35a'; g.font='900 9px system-ui'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('5',s/2,s/2+0.5); }
  return c;
}
let starsBuilt=false;
function buildStars(){
  if(starsBuilt) return;
  starsBuilt=true;
  starFar=document.createElement('canvas'); starFar.width=512; starFar.height=512;
  starNear=document.createElement('canvas'); starNear.width=512; starNear.height=512;
  const r1=mulberry32(987654);
  let g=starFar.getContext('2d');
  for(let i=0;i<46;i++){
    g.fillStyle=i%3?'#41e8ff':'#ff3df2';
    g.globalAlpha=0.16+r1()*0.2;
    g.beginPath(); g.arc(r1()*512, r1()*512, 1+r1()*1.5, 0, Math.PI*2); g.fill();
  }
  g=starNear.getContext('2d');
  for(let i=0;i<26;i++){
    g.fillStyle=i%4?'#8d63ff':'#ffd35a';
    g.globalAlpha=0.18+r1()*0.25;
    g.beginPath(); g.arc(r1()*512, r1()*512, 1.5+r1()*2, 0, Math.PI*2); g.fill();
  }
}
let trackGrad=null;
function buildVignettes(){
  trackGrad=null;
  const w=Math.max(2,W), h=Math.max(2,H);
  vignCanvas=document.createElement('canvas'); vignCanvas.width=w; vignCanvas.height=h;
  let g=vignCanvas.getContext('2d');
  let grd=g.createRadialGradient(w/2,h/2,Math.min(w,h)*.2,w/2,h/2,Math.max(w,h)*.65);
  grd.addColorStop(0,'#00000000'); grd.addColorStop(1,'#00000088');
  g.fillStyle=grd; g.fillRect(0,0,w,h);
  dangerCanvas=document.createElement('canvas'); dangerCanvas.width=w; dangerCanvas.height=h;
  g=dangerCanvas.getContext('2d');
  grd=g.createRadialGradient(w/2,h/2,Math.min(w,h)*.25,w/2,h/2,Math.max(w,h)*.62);
  grd.addColorStop(0,'#ff496c00'); grd.addColorStop(1,'#ff496c55');
  g.fillStyle=grd; g.fillRect(0,0,w,h);
}
