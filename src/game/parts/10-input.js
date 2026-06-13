/* ================= INPUT ================= */
let inputDown=false;
function isUIBtn(e){
  return e.target && e.target.closest && e.target.closest('#hammerBtn, #ultBtn, .hudBtns, #menu, #gameOver, #pauseOv, #nameDlg');
}
addEventListener('pointerdown',e=>{
  audioEnsure(); audioResume(); engineStart();
  if(state!=='play'){ return; }
  if(isUIBtn(e)){ return; }
  inputDown=true;
  e.preventDefault();
},{passive:false});
addEventListener('pointerup',e=>{
  if(isUIBtn(e)) return;
  inputDown=false;
},{passive:true});
addEventListener('pointercancel',()=>{inputDown=false;},{passive:true});
$('hammerBtn').addEventListener('pointerdown',e=>{e.preventDefault(); e.stopPropagation(); triggerAbility();},{passive:false});
$('ultBtn').addEventListener('pointerdown',e=>{e.preventDefault(); e.stopPropagation(); triggerUltimate();},{passive:false});
addEventListener('keydown',e=>{
  if(e.code==='Space'||e.code==='ArrowUp'){ inputDown=true; if(state==='over') retryRun(); }
  if(e.code==='KeyF') triggerAbility();
  if(e.code==='KeyR' && state==='over') retryRun();
  if(e.code==='Escape'){ if(state==='play') pauseGame(); else if(state==='pause') resumeGame(); }
});
addEventListener('keyup',e=>{
  if(e.code==='Space'||e.code==='ArrowUp') inputDown=false;
});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{ if(document.hidden && state==='play') pauseGame(); });
addEventListener('blur',()=>{ if(state==='play') pauseGame(); });
addEventListener('pagehide',()=>persist());
