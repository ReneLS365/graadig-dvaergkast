/* ================= HELTE-LOGIK (xp / level / perks / specialer) ================= */
function ensureCharacters(){
  if(!save.characters) save.characters={roster:{}};
  if(!save.characters.roster) save.characters.roster={};
  // sørg for at alle ejede piloter har en helt-progression
  for(const key of (save.owned && save.owned.pilots ? save.owned.pilots : ['bram'])){
    if(CHARACTERS[key] && !save.characters.roster[key]) save.characters.roster[key]={level:1, xp:0};
  }
  if(!save.characters.roster.bram) save.characters.roster.bram={level:1, xp:0};
}
function charLevel(key){ ensureCharacters(); return (save.characters.roster[key] && save.characters.roster[key].level) || 1; }
function charXp(key){ ensureCharacters(); return (save.characters.roster[key] && save.characters.roster[key].xp) || 0; }
function charXpNeed(level){ return Math.floor(42 * Math.pow(level,1.45)); }
function activeChar(){
  const k=save.selected && save.selected.pilot;
  return (CHARACTERS[k] && owned('pilots',k)) ? k : 'bram';
}
function unlockedPerks(key){
  const c=CHARACTERS[key]; if(!c) return [];
  const lvl=charLevel(key);
  return c.perks.filter(p=>lvl>=p.lvl);
}
function characterStats(key){
  const c=CHARACTERS[key]; if(!c) return {};
  const lvl=charLevel(key);
  const out={};
  for(const [k,v] of Object.entries(c.base||{})) out[k]=(out[k]||0)+v;
  for(const [k,v] of Object.entries(c.growth||{})) out[k]=(out[k]||0)+v*(lvl-1);
  for(const p of unlockedPerks(key)){
    for(const [k,v] of Object.entries(p.stats||{})) out[k]=(out[k]||0)+v;
  }
  return out;
}
function gainCharXP(key, amount){
  if(!CHARACTERS[key] || amount<=0) return;
  ensureCharacters();
  const r=save.characters.roster[key];
  r.xp += Math.floor(amount);
  let leveled=false, perkUnlocked=null;
  while(r.level<CHAR_MAX && r.xp>=charXpNeed(r.level)){
    r.xp-=charXpNeed(r.level);
    r.level++;
    leveled=true;
    save.gold += 40 + r.level*8;
    const newPerk=CHARACTERS[key].perks.find(p=>p.lvl===r.level);
    if(newPerk) perkUnlocked=newPerk;
  }
  if(r.level>=CHAR_MAX) r.xp=0;
  if(leveled){
    const nm=DATA.pilots[key]?DATA.pilots[key].name.split(' ')[0]:key;
    if(perkUnlocked) toast('⬆ '+nm+' Lv'+r.level+' — låste op: '+perkUnlocked.name);
    else toast('⬆ '+nm+' nåede Lv'+r.level+' (+bonusguld)');
    sfx.level();
  }
}
function gainCharacter(key){
  if(!CHARACTERS[key]) return;
  if(!save.owned.pilots.includes(key)) save.owned.pilots.push(key);
  if(!save.levels.pilots[key]) save.levels.pilots[key]=1;
  ensureCharacters();
  if(!save.characters.roster[key]) save.characters.roster[key]={level:1, xp:0};
  persist();
}
