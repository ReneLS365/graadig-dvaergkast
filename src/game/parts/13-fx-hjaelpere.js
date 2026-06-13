/* ================= FX-HJÆLPERE ================= */
function shake(m){ shakeMag=Math.max(shakeMag,m); }
function flashScreen(col,a){ flashCol=col; flashA=Math.max(flashA,a); }
function addParticle(x,y,color,count,power){
  count=count||8; power=power||1;
  if(particles.length>240) return;
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2, sp=(80+Math.random()*220)*power;
    particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:.35+Math.random()*.35,color});
  }
}
function confetti(x,y){
  const cols=['#ffd35a','#41e8ff','#ff3df2','#63ff9a'];
  for(let i=0;i<36;i++){
    const a=Math.random()*Math.PI*2, sp=120+Math.random()*320;
    particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-160,life:.6+Math.random()*.5,color:cols[i%4]});
  }
}
function floatText(x,y,text,color){
  floating.push({x,y,text,color:color||'#fff',life:1});
}
function pumpMult(){
  const el=$('multVal');
  el.classList.remove('pump');
  void el.offsetWidth;
  el.classList.add('pump');
  setTimeout(function(){el.classList.remove('pump');},140);
}
