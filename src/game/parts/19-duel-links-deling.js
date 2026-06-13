/* ================= DUEL-LINKS & DELING ================= */
function buildChallengeURL(scoreVal){
  return location.origin+location.pathname+'#duel='+currentSeed+'x'+scoreVal+'x'+encodeURIComponent(save.name||'Dværg');
}
async function shareChallenge(){
  if(lastFinal<=0){ toast('Spil et run først.'); return; }
  const name=await ensureName();
  if(!name) return;
  const url=buildChallengeURL(lastFinal);
  const text='⛏️ Slå mine '+fmt(lastFinal)+' point i GRÅDIG Dværgkast! Samme bane, samme vilkår.';
  if(navigator.share){
    try{ await navigator.share({title:'GRÅDIG Dværgkast', text:text, url:url}); toast('Udfordring sendt!'); return; }
    catch(e){ if(e && e.name==='AbortError') return; }
  }
  try{ await navigator.clipboard.writeText(text+' '+url); toast('Link kopieret — send det til en ven!'); }
  catch(e){ toast('Kunne ikke dele linket.'); }
}
let nameResolve=null;
function ensureName(){
  return new Promise(function(res){
    if(save.name){ res(save.name); return; }
    nameResolve=res;
    $('nameInput').value='';
    $('nameDlg').style.display='flex';
    setTimeout(function(){ $('nameInput').focus(); },60);
  });
}
$('nameOk').onclick=function(){
  const v=($('nameInput').value||'').trim().slice(0,14)||'Dværg';
  save.name=v; persist();
  $('nameDlg').style.display='none';
  if(nameResolve){ nameResolve(v); nameResolve=null; }
};
$('nameCancel').onclick=function(){
  $('nameDlg').style.display='none';
  if(nameResolve){ nameResolve(null); nameResolve=null; }
};
function parseDuelHash(){
  const h=location.hash||'';
  if(h.indexOf('#duel=')!==0) return false;
  const parts=h.slice(6).split('x');
  if(parts.length<3) return false;
  const seed=Number(parts[0])>>>0;
  const sc=Math.max(1,Math.floor(Number(parts[1])||0));
  let name='Ukendt dværg';
  try{ name=decodeURIComponent(parts.slice(2).join('x')).slice(0,14)||name; }catch(e){}
  if(!seed||!sc) return false;
  setTimeout(function(){
    audioEnsure(); engineStart();
    startDuel(seed, sc, name);
  }, 300);
  return true;
}
