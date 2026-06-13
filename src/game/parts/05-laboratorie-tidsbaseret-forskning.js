/* ================= LABORATORIE (tidsbaseret forskning) ================= */
const MIN=60000, HOUR=3600000;
const RESEARCH = {
  alloy:    {name:'Legeringsanalyse', cat:'Våben', reqLevel:4,  reqDone:[],                cost:{gold:500, data:20},  dur:3*MIN,    reward:{stats:{weapon:.10}},      desc:'+10% våbenskade permanent.'},
  optics:   {name:'Sigtekorrektion',  cat:'Styring',reqLevel:5,  reqDone:[],               cost:{gold:650, data:25},  dur:6*MIN,    reward:{stats:{control:.06}},     desc:'+6% kontrol permanent.'},
  greedlab: {name:'Grådighedsteori',  cat:'Økonomi',reqLevel:6,  reqDone:[],               cost:{gold:800, data:32},  dur:10*MIN,   reward:{stats:{greed:.06}},       desc:'+6% multiplier-vækst permanent.'},
  banklab:  {name:'Bankprotokol v2',  cat:'Økonomi',reqLevel:7,  reqDone:['greedlab'],     cost:{gold:1000,data:40},  dur:15*MIN,   reward:{stats:{bank:.08}},        desc:'+8% bank-værdi permanent.'},
  magnetlab:{name:'Felt-støvsuger',   cat:'Loot',  reqLevel:8,   reqDone:[],               cost:{gold:1200,data:48},  dur:20*MIN,   reward:{stats:{magnet:.12, coin:.06}}, desc:'+sug og +guld permanent.'},
  smelt:    {name:'Guldsmeltning',    cat:'Drift', reqLevel:5,   reqDone:[],               cost:{gold:0,   data:30},  dur:10*MIN,   reward:{gold:1200}, repeatable:true, desc:'Omdan 30 data til 1.200 guld. Kan gentages.'},
  slot2:    {name:'Ekstra forskningsbænk', cat:'Drift', reqLevel:9, reqDone:[],            cost:{gold:1800,data:70},  dur:45*MIN,   reward:{slot:1},                  desc:'+1 forskningsbænk (kør flere projekter samtidigt).'},
  drone:    {name:'Auto-samler drone',cat:'Drift', reqLevel:11,  reqDone:['magnetlab'],    cost:{gold:2400,data:110}, dur:90*MIN,   reward:{passiveGold:280},         desc:'+280 guld efter hvert run, permanent.'},
  wcap:     {name:'Mestersmedning',   cat:'Våben', reqLevel:10,  reqDone:['alloy'],        cost:{gold:2200,data:90},  dur:HOUR,     reward:{weaponCap:3, stats:{weapon:.06}}, desc:'+3 på alle våbens maks-level og +6% skade.'},
  ultlab:   {name:'Adrenalin-syntese',cat:'Kamp',  reqLevel:13,  reqDone:[],               cost:{gold:2600,data:130}, dur:90*MIN,   reward:{stats:{ultcharge:.18}},   desc:'+18% ultimativ-opladning permanent.'},
  volund:   {name:'Vækning af Vølund',cat:'Helt',  reqLevel:12,  reqDone:['wcap'],         cost:{gold:3000,data:160}, dur:2*HOUR,   reward:{unlockChar:'volund'},     desc:'Lås Vølund Runesmed op som spilbar helt.'},
  stamlab:  {name:'Pansret hud',      cat:'Kamp',  reqLevel:15,  reqDone:['banklab'],      cost:{gold:3200,data:170}, dur:2*HOUR,   reward:{stats:{hp:2}},            desc:'+2 maks HP permanent.'},
  tesla:    {name:'Tesla-prototype',  cat:'Våben', reqLevel:14,  reqDone:['volund'],       cost:{gold:3600,data:200}, dur:3*HOUR,   reward:{unlockWeapon:'tesla'},    desc:'Lås Tesla-spolen op (lyn der hopper mellem mange farer).'},
  slot3:    {name:'Tredje forskningsbænk', cat:'Drift', reqLevel:16, reqDone:['slot2'],    cost:{gold:4500,data:280}, dur:4*HOUR,   reward:{slot:1},                  desc:'+1 forskningsbænk.'},
  apex:     {name:'Apex-protokol',    cat:'Capstone',reqLevel:18, reqDone:['volund','ultlab','stamlab'], cost:{gold:6500,data:420}, dur:8*HOUR, reward:{stats:{greed:.06,bank:.06,control:.04,weapon:.08}}, desc:'Mineindustriens hellige gral: alt løftes lidt. Endgame-belønning.'}
};
const RESEARCH_ORDER=['alloy','optics','greedlab','banklab','magnetlab','smelt','slot2','drone','wcap','ultlab','volund','stamlab','tesla','slot3','apex'];

const DEFAULT_SAVE = {
  gold:0,xp:0,level:1,best:0,bestDist:0,runs:0,wins:0,duelWins:0,
  name:'', sound:true, seenIntro:false,
  seenGates:{},
  owned:{pilots:['bram'],cores:['oak'],chips:['tin'],abilities:['hammer']},
  levels:{pilots:{bram:1},cores:{oak:1},chips:{tin:1},abilities:{hammer:1}},
  selected:{pilot:'bram',core:'oak',chip:'tin',ability:'hammer'},
  achievements:{},
  skills:{},
  inventory:{scrap:0, selectedWeapon:'axe', weapons:{axe:{owned:true,level:1,xp:0}}},
  campaign:{unlocked:1,current:1,stars:{}},
  characters:{ roster:{ bram:{level:1, xp:0} } },
  research:{ points:0, slots:1, queue:{}, done:{}, bonuses:{}, weaponCapBonus:0, passiveGold:0 },
  mission:{date:'', daily:{}},
  meta:{schemaVersion:SAVE_SCHEMA_VERSION, version:GAME_VERSION, createdAt:Date.now(), savedAt:Date.now()},
  dailyRun:{date:'', tries:0, best:0},
  leaderboard:[],
  ghosts2:{}
};
let save = loadSave();

function migrateSave(obj){
  let s = merge(DEFAULT_SAVE, obj || {});
  s.meta = s.meta || {};
  const from = Number(s.meta.schemaVersion || 1);

  if(from < 2){
    s.inventory = s.inventory || {scrap:0, selectedWeapon:'axe', weapons:{axe:{owned:true,level:1,xp:0}}};
    if(!s.inventory.weapons) s.inventory.weapons = {axe:{owned:true,level:1,xp:0}};
    if(!s.inventory.weapons.axe) s.inventory.weapons.axe = {owned:true,level:1,xp:0};
  }

  if(from < 3){
    s.research = s.research || {points:0, slots:1, queue:{}, done:{}, bonuses:{}, weaponCapBonus:0, passiveGold:0};
    if(!s.research.queue) s.research.queue = {};
    if(!s.research.done) s.research.done = {};
    if(!s.research.bonuses) s.research.bonuses = {};
  }

  if(from < 4){
    s.characters = s.characters || {roster:{bram:{level:1,xp:0}}};
    if(!s.characters.roster) s.characters.roster = {bram:{level:1,xp:0}};
    if(!s.characters.roster.bram) s.characters.roster.bram = {level:1,xp:0};
  }

  s.meta.schemaVersion = SAVE_SCHEMA_VERSION;
  s.meta.version = GAME_VERSION;
  s.meta.migratedAt = Date.now();
  return s;
}

function loadSave(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(raw){
      const obj=JSON.parse(raw);
      return migrateSave(obj);
    }
  }catch(e){
    console.warn('Save kunne ikke læses, starter rent.', e);
  }
  return migrateSave(JSON.parse(JSON.stringify(DEFAULT_SAVE)));
}
function merge(a,b){
  if(Array.isArray(a)) return Array.isArray(b)?b:a;
  if(typeof a==='object' && a){
    const safeB = (typeof b==='object' && b && !Array.isArray(b)) ? b : {};
    const o={...a};
    for(const k in safeB){
      o[k]=k in a?merge(a[k],safeB[k]):safeB[k];
    }
    return o;
  }
  return b===undefined?a:b;
}
function persist(){ 
  try{ 
    save.meta = save.meta || {};
    save.meta.schemaVersion = SAVE_SCHEMA_VERSION;
    save.meta.version = GAME_VERSION;
    save.meta.savedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(save)); 
  }catch(e){
    console.warn('Kunne ikke gemme save-data', e);
  } 
}

function exportSaveData(){
  try{
    const blob = new Blob([JSON.stringify(save,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url;
    a.download='graadig-save-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
    toast('Save eksporteret.');
  }catch(e){ showFatalErrorOverlay(e); }
}

function importSaveDataFromText(text){
  try{
    const obj = JSON.parse(text);
    save = migrateSave(obj);
    persist();
    refreshMenu();
    toast('Save importeret.');
  }catch(e){
    toast('Kunne ikke importere save.');
    console.error(e);
  }
}

function hardResetSave(){
  try{
    localStorage.removeItem(SAVE_KEY);
    save = migrateSave(JSON.parse(JSON.stringify(DEFAULT_SAVE)));
    persist();
    refreshMenu();
    toast('Alt nulstillet.');
  }catch(e){ showFatalErrorOverlay(e); }
}

function getItem(type,key){return DATA[type][key];}
function owned(type,key){return save.owned[type].includes(key);}
function itemLevel(type,key){return save.levels[type][key]||1;}
function upgradeCost(type,key){
  const l=itemLevel(type,key);
  return Math.floor(155 * Math.pow(l,1.62) * (getItem(type,key).cost?1.15:1));
}
function gearMaxed(type,key){ return itemLevel(type,key) >= MAX_GEAR_LEVEL; }
function itemStats(type,key){
  const item=getItem(type,key);
  const lvl=itemLevel(type,key);
  const scale=1+(lvl-1)*0.11;
  const out={};
  for(const [k,v] of Object.entries(item.stats||{})) out[k]=v*scale;
  return out;
}
function buildStats(){
  const sel=save.selected;
  const stats={lift:0,control:0,greed:0,bank:0,perfect:0,split:0,hp:0,hammer:0,magnet:0,speed:0,cd:0,dash:0,salvage:0,coin:0,xp:0,interest:0,refund:0,weapon:0,ultcharge:0,data:0};
  // Helt (character) passives — pilot-slottet er nu en helt med eget level
  const cs=characterStats(sel.pilot);
  for(const k in cs) stats[k]=(stats[k]||0)+cs[k];
  // Øvrigt gear
  [
    ['cores',sel.core],
    ['chips',sel.chip],
    ['abilities',sel.ability],
  ].forEach(([type,key])=>{
    const s=itemStats(type,key);
    for(const k in s) stats[k]=(stats[k]||0)+s[k];
  });
  const sk=skillStats();
  for(const k in sk) stats[k]=(stats[k]||0)+sk[k];
  const rb=researchBonusStats();
  for(const k in rb) stats[k]=(stats[k]||0)+rb[k];
  return stats;
}
function skillLevel(key){ return (save.skills && save.skills[key]) || 0; }
function skillCost(key){
  const sk=SKILLS[key], lvl=skillLevel(key);
  return Math.floor(sk.base * Math.pow(lvl+1,1.72));
}
function skillStats(){
  const out={};
  for(const [key,sk] of Object.entries(SKILLS)){
    const lvl=skillLevel(key);
    if(!lvl) continue;
    for(const [stat,val] of Object.entries(sk.stats)){
      out[stat]=(out[stat]||0)+val*lvl;
    }
  }
  return out;
}
function buySkill(key){
  const sk=SKILLS[key]; if(!sk) return;
  const lvl=skillLevel(key);
  if(lvl>=sk.max){ toast('Max level. Dværgen kan ikke blive mere absurd.'); return; }
  const cost=skillCost(key);
  if(save.gold<cost){ toast('For lidt guld. En klassiker.'); return; }
  save.gold-=cost;
  save.skills[key]=lvl+1;
  toast(sk.name+' Lv'+save.skills[key]);
  sfx.level();
  persist(); refreshMenu();
}
