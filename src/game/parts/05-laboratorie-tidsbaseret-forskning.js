/* ================= LABORATORIE (tidsbaseret forskning) ================= */
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

function isPlainSaveObject(value){
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function cloneSaveObject(value){
  if(typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
function mergeSaveDefaults(defaultValue, savedValue){
  if(Array.isArray(defaultValue)) return Array.isArray(savedValue) ? savedValue : cloneSaveObject(defaultValue);
  if(isPlainSaveObject(defaultValue)){
    const source = isPlainSaveObject(savedValue) ? savedValue : {};
    const o=cloneSaveObject(defaultValue);
    for(const k of Object.keys(source)){
      o[k]=k in defaultValue ? mergeSaveDefaults(defaultValue[k], source[k]) : source[k];
    }
    return o;
  }
  return savedValue===undefined ? defaultValue : savedValue;
}
function migrateSave(obj){
  let s = mergeSaveDefaults(DEFAULT_SAVE, isPlainSaveObject(obj) ? obj : {});
  s.meta = isPlainSaveObject(s.meta) ? s.meta : {};
  const from = Number(s.meta.schemaVersion || 1);

  if(from < 2 || !isPlainSaveObject(s.inventory)){
    s.inventory = {scrap:0, selectedWeapon:'axe', weapons:{axe:{owned:true,level:1,xp:0}}};
  }
  if(!isPlainSaveObject(s.inventory.weapons)) s.inventory.weapons = {axe:{owned:true,level:1,xp:0}};
  if(!isPlainSaveObject(s.inventory.weapons.axe)) s.inventory.weapons.axe = {owned:true,level:1,xp:0};
  if(!s.inventory.selectedWeapon || !s.inventory.weapons[s.inventory.selectedWeapon]) s.inventory.selectedWeapon = 'axe';

  if(from < 3 || !isPlainSaveObject(s.research)){
    s.research = {points:0, slots:1, queue:{}, done:{}, bonuses:{}, weaponCapBonus:0, passiveGold:0};
  }
  if(!isPlainSaveObject(s.research.queue)) s.research.queue = {};
  if(!isPlainSaveObject(s.research.done)) s.research.done = {};
  if(!isPlainSaveObject(s.research.bonuses)) s.research.bonuses = {};

  if(from < 4 || !isPlainSaveObject(s.characters)){
    s.characters = {roster:{bram:{level:1,xp:0}}};
  }
  if(!isPlainSaveObject(s.characters.roster)) s.characters.roster = {bram:{level:1,xp:0}};
  if(!isPlainSaveObject(s.characters.roster.bram)) s.characters.roster.bram = {level:1,xp:0};

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
  return migrateSave(cloneSaveObject(DEFAULT_SAVE));
}
function merge(a,b){
  return mergeSaveDefaults(a,b);
}
function persist(){ 
  try{ 
    save.meta = isPlainSaveObject(save.meta) ? save.meta : {};
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
    const exportObject = migrateSave(save);
    const blob = new Blob([JSON.stringify(exportObject,null,2)], {type:'application/json'});
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
    if(!isPlainSaveObject(obj)) throw new Error('Imported save must be a JSON object.');
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
    save = migrateSave(cloneSaveObject(DEFAULT_SAVE));
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
