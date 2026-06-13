/* ================= LYD (WebAudio, ingen filer) ================= */
let AC=null, masterGain=null, engOsc=null, engOsc2=null, engGain=null, noiseBuf=null;
function audioEnsure(){
  if(AC) return true;
  try{
    AC = new (window.AudioContext||window.webkitAudioContext)();
    masterGain = AC.createGain();
    masterGain.gain.value = save.sound ? 0.55 : 0;
    masterGain.connect(AC.destination);
    const len = AC.sampleRate*0.5;
    noiseBuf = AC.createBuffer(1,len,AC.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
  }catch(e){ AC=null; }
  return !!AC;
}
function audioResume(){ if(AC && AC.state==='suspended') AC.resume(); }
function tone(freq, dur, type, vol, slideTo, delay){
  if(!AC || !save.sound) return;
  const t0=AC.currentTime+(delay||0);
  const o=AC.createOscillator(), g=AC.createGain();
  o.type=type||'square'; o.frequency.setValueAtTime(freq,t0);
  if(slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20,slideTo),t0+dur);
  g.gain.setValueAtTime(0.0001,t0);
  g.gain.exponentialRampToValueAtTime(vol||0.18,t0+0.012);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  o.connect(g); g.connect(masterGain);
  o.start(t0); o.stop(t0+dur+0.05);
}
function noiseBurst(dur, vol, freq, delay){
  if(!AC || !save.sound || !noiseBuf) return;
  const t0=AC.currentTime+(delay||0);
  const src=AC.createBufferSource(); src.buffer=noiseBuf; src.loop=true;
  const f=AC.createBiquadFilter(); f.type='lowpass';
  f.frequency.setValueAtTime(freq||1200,t0);
  f.frequency.exponentialRampToValueAtTime(120,t0+dur);
  const g=AC.createGain();
  g.gain.setValueAtTime(vol||0.3,t0);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  src.connect(f); f.connect(g); g.connect(masterGain);
  src.start(t0); src.stop(t0+dur+0.05);
}
function engineStart(){
  if(!AC || engOsc) return;
  engOsc=AC.createOscillator(); engOsc.type='triangle';
  engOsc2=AC.createOscillator(); engOsc2.type='sawtooth';
  engGain=AC.createGain(); engGain.gain.value=0;
  const f=AC.createBiquadFilter(); f.type='lowpass'; f.frequency.value=420;
  engOsc.connect(engGain); engOsc2.connect(engGain);
  engGain.connect(f); f.connect(masterGain);
  engOsc.start(); engOsc2.start();
}
function engineUpdate(){
  if(!AC || !engGain) return;
  const playing = state==='play';
  const target = (playing && save.sound) ? 0.05 : 0;
  engGain.gain.setTargetAtTime(target, AC.currentTime, 0.08);
  if(playing){
    const f = 52 + Math.min(20,mult)*6;
    engOsc.frequency.setTargetAtTime(f, AC.currentTime, 0.1);
    engOsc2.frequency.setTargetAtTime(f*0.503, AC.currentTime, 0.1);
  }
}
let beatAcc=0;
function heartbeatUpdate(dt){
  if(state!=='play' || mult<6 || !AC || !save.sound) return;
  const bpm = 60 + mult*7;
  beatAcc += dt;
  if(beatAcc >= 60/bpm){
    beatAcc=0;
    const v=Math.min(0.4, 0.12+(mult-6)*0.02);
    tone(58,0.13,'sine',v,34);
  }
}
const sfx={
  coin(n){ tone(740*Math.pow(1.059,Math.min(12,n||0)),0.07,'square',0.10); },
  bank(big){ tone(620,0.10,'square',0.22); tone(930,0.16,'square',0.22,0,0.07); if(big) noiseBurst(0.3,0.12,5200,0.1); buzz(30); },
  split(){ tone(540,0.09,'square',0.18); tone(720,0.12,'square',0.16,0,0.06); buzz(20); },
  skip(){ tone(300,0.2,'sawtooth',0.14,900); buzz(12); },
  perfect(){ tone(660,0.12,'square',0.2); tone(830,0.12,'square',0.2,0,0.05); tone(990,0.2,'square',0.2,0,0.1); buzz([20,20,30]); },
  tick(){ tone(1250,0.035,'square',0.07); },
  near(){ tone(1500,0.05,'square',0.12); buzz(10); },
  smash(){ noiseBurst(0.16,0.25,2400); tone(140,0.12,'square',0.2,60); buzz(25); },
  hit(){ noiseBurst(0.25,0.3,1800); tone(120,0.2,'sawtooth',0.25,50); buzz([40,30,40]); },
  crash(){ noiseBurst(0.6,0.4,2600); tone(90,0.5,'sawtooth',0.3,28); tone(55,0.6,'sine',0.3,25,0.05); buzz([60,40,90]); },
  record(){ [523,659,784,1047].forEach((f,i)=>tone(f,0.14,'square',0.2,0,i*0.09)); buzz([40,30,60]); },
  level(){ [440,554,659,880].forEach((f,i)=>tone(f,0.12,'square',0.16,0,i*0.07)); },
  finish(){ [523,659,784,1047,1319].forEach((f,i)=>tone(f,0.16,'square',0.2,0,i*0.1)); noiseBurst(0.5,0.1,6000,0.3); buzz([50,40,50,40,80]); },
  ui(){ tone(880,0.04,'square',0.06); }
};
function buzz(p){ try{ if(navigator.vibrate) navigator.vibrate(p); }catch(e){} }
