'use strict';

/*
  GRÅDIG: Dværgkast v12 modular source.

  Disse filer er klassiske source-parts, ikke ES-moduler endnu.
  tools/build-game-bundle.mjs pakker dem i én IIFE til dist/app.bundle.js.

  Hvorfor sådan?
  Fordi spillet er en fungerende prototype med mange delte runtime-variabler.
  Første sikre split er kildefiler + bundle. Næste split kan blive rigtige ES-moduler,
  når gameplayet holder op med at ændre sig hver halve kop kaffe.
*/



/* ================= STABILITY GUARD ================= */
const STABILITY = {
  version: 'v14-core-refactor',
  build: 'core-refactor-bundle',
  startedAt: Date.now()
};

function showFatalErrorOverlay(err){
  try{
    const msg = (err && (err.stack || err.message)) ? (err.stack || err.message) : String(err);
    let box = document.getElementById('fatalErrorOverlay');
    if(!box){
      box=document.createElement('div');
      box.id='fatalErrorOverlay';
      box.style.cssText='position:fixed;inset:12px;z-index:99999;background:#16060bcc;color:#fff;border:1px solid #ff496c88;border-radius:18px;padding:14px;font-family:system-ui,sans-serif;box-shadow:0 20px 80px #000;overflow:auto;white-space:pre-wrap;';
      document.body.appendChild(box);
    }
    box.textContent='GRÅDIG runtime-fejl\n\n' + msg + '\n\nPrøv at genindlæse. Hvis den kommer igen, ligger fejlen nu i displayet i stedet for at gemme sig som en lille kujon i konsollen.';
  }catch(e){}
}

window.addEventListener('error', function(e){ showFatalErrorOverlay(e.error || e.message); });
window.addEventListener('unhandledrejection', function(e){ showFatalErrorOverlay(e.reason || e); });

function safeCall(label, fn){
  try{ return fn(); }
  catch(e){
    console.error('SafeCall failed:', label, e);
    showFatalErrorOverlay(e);
    return null;
  }
}

/* ================= CANVAS + VERDENS-MÅL (resize-sikker) =================
   clamp/lerp/fmt kommer fra src/game/core/math.js + part 08,
   hashStr/mulberry32 kommer fra src/game/core/rng.js. */
const $ = (id)=>document.getElementById(id);
const canvas = $('game');
const ctx = canvas.getContext('2d', { alpha:false });

let W=0, H=0, DPR=1;
let vignCanvas=null, dangerCanvas=null, starFar=null, starNear=null;
function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = Math.max(1, innerWidth); H = Math.max(1, innerHeight);
  canvas.width=Math.floor(W*DPR); canvas.height=Math.floor(H*DPR);
  canvas.style.width=W+'px'; canvas.style.height=H+'px';
  buildVignettes();
}
addEventListener('resize', resize, {passive:true});

const fmt = fmtFloorDa;
function now(){ return performance.now()/1000; }
function todaySeed(){
  const d=new Date();
  return hashStr(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-dvaerg`);
}
function randomSeed(){ return (Math.random()*4294967295)>>>0; }
function dayKey(){ return new Date().toDateString(); }
