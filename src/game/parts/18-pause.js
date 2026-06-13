/* ================= PAUSE ================= */
function pauseGame(){
  if(state!=='play') return;
  state='pause';
  inputDown=false;
  $('pauseOv').style.display='flex';
  engineUpdate();
  persist();
}
function resumeGame(){
  if(state!=='pause') return;
  $('pauseOv').style.display='none';
  state='play';
  last=now(); acc=0;
  requestAnimationFrame(loop);
}
