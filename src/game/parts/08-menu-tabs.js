/* ================= MENU / TABS ================= */
let activeTab='campaign';
function refreshMenu(){
  ensureCharacters();
  ensureResearch();
  $('mLevel').textContent=save.level;
  $('mXp').textContent=`${save.xp} / ${xpNeed(save.level)}`;
  $('mGold').textContent=fmt(save.gold);
  $('mData').textContent=fmt(save.research.points||0);
  $('mBest').textContent=fmt(save.best);
  document.title='GRÅDIG: Dværgkast '+GAME_VERSION;
  ensureDailyRun();
  $('dailyDesc').textContent = `Samme seed for alle. Forsøg tilbage: ${Math.max(0,3-save.dailyRun.tries)}/3. Fair build.`;
  for(const [selId,type,prop] of [
    ['pilotSel','pilots','pilot'],['coreSel','cores','core'],['chipSel','chips','chip'],['abilitySel','abilities','ability']
  ]){
    const s=$(selId); s.innerHTML='';
    for(const [key,item] of Object.entries(DATA[type])){
      const opt=document.createElement('option');
      opt.value=key;
      let label;
      if(type==='pilots'){
        const c=CHARACTERS[key];
        label = owned(type,key) ? `${item.name} Lv${charLevel(key)}` : (item.research?`🔬 ${item.name} (research)`:`🔒 ${item.name} (${item.cost}g)`);
      } else {
        label = owned(type,key) ? `${item.name} Lv${itemLevel(type,key)}` : `🔒 ${item.name} (${item.cost}g)`;
      }
      opt.textContent=label;
      opt.disabled=!owned(type,key);
      if(save.selected[prop]===key) opt.selected=true;
      s.appendChild(opt);
    }
  }
  $('pilotLvl').textContent='Lv'+charLevel(save.selected.pilot);
  $('coreLvl').textContent='Lv'+itemLevel('cores',save.selected.core);
  $('chipLvl').textContent='Lv'+itemLevel('chips',save.selected.chip);
  $('abilityLvl').textContent='Lv'+itemLevel('abilities',save.selected.ability);
  renderTab();
}
function xpNeed(lvl){return Math.floor(160*Math.pow(lvl,1.35));}
function gainXP(xp){
  save.xp += xp;
  let leveled=false;
  while(save.xp>=xpNeed(save.level)){
    save.xp-=xpNeed(save.level);
    save.level++;
    save.gold += 120 + save.level*25;
    leveled=true;
  }
  if(leveled){ toast(`LEVEL ${save.level}! Bonusguld.`); sfx.level(); }
}
function renderTab(){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===activeTab));
  const el=$('tabContent');
  if(activeTab==='campaign') renderCampaign(el);
  if(activeTab==='characters') renderCharacters(el);
  if(activeTab==='inventory') renderInventory(el);
  if(activeTab==='upgrades') renderUpgrades(el);
  if(activeTab==='research') renderResearch(el);
  if(activeTab==='skills') renderSkills(el);
  if(activeTab==='missions') renderMissions(el);
  if(activeTab==='achievements') renderAchievements(el);
  if(activeTab==='leaderboard') renderLeaderboard(el);
}


function ensureInventory(){
  if(!save.inventory) save.inventory={scrap:0, selectedWeapon:'axe', weapons:{axe:{owned:true,level:1,xp:0}}};
  if(!save.inventory.weapons) save.inventory.weapons={axe:{owned:true,level:1,xp:0}};
  if(!save.inventory.weapons.axe) save.inventory.weapons.axe={owned:true,level:1,xp:0};
  if(!save.inventory.selectedWeapon || !save.inventory.weapons[save.inventory.selectedWeapon]) save.inventory.selectedWeapon='axe';
}
function weaponOwned(key){ ensureInventory(); return !!(save.inventory.weapons[key] && save.inventory.weapons[key].owned); }
function weaponLevel(key){ ensureInventory(); return (save.inventory.weapons[key] && save.inventory.weapons[key].level) || 0; }
function weaponMax(key){ ensureResearch(); return (WEAPONS[key]&&WEAPONS[key].max||10) + (save.research.weaponCapBonus||0); }
function weaponMaxed(key){ return weaponLevel(key) >= weaponMax(key); }
function weaponUpgradeCost(key){
  const lvl=Math.max(1,weaponLevel(key));
  const rarity=WEAPONS[key].rarity;
  const rarityMul={Common:1,Rare:1.3,Epic:1.65,Legendary:2.1,Mythic:2.7}[rarity]||1;
  return Math.floor(45 * rarityMul * Math.pow(lvl+1,1.35));
}
function weaponEvo(key){
  // evolutions ved milepæle
  const lvl=Math.max(1,weaponLevel(key)||1);
  let pierce=0, note=[];
  if(lvl>=5){ pierce+=1; }
  if(lvl>=10){ pierce+=1; }
  return {pierceBonus:pierce, l5:lvl>=5, l10:lvl>=10};
}
function weaponStats(key){
  const w=WEAPONS[key]||WEAPONS.axe;
  const lvl=Math.max(1,weaponLevel(key)||1);
  const mul=1+(lvl-1)*0.16;
  const evo=weaponEvo(key);
  return {
    damage:w.base.damage*mul,
    range:w.base.range*(1+(lvl-1)*0.045),
    cooldown:Math.max(0.34,w.base.cooldown*(1-(lvl-1)*0.034)),
    pierce:(w.base.pierce||1)+evo.pierceBonus,
    leech:(w.base.leech||0)*(1+(lvl-1)*0.10)
  };
}
function currentWeaponKey(){
  ensureInventory();
  return weaponOwned(save.inventory.selectedWeapon) ? save.inventory.selectedWeapon : 'axe';
}
function gainWeapon(key, source){
  ensureInventory();
  if(!WEAPONS[key] || (WEAPONS[key].locked && !weaponOwned(key))) key=WEAPON_DROP_POOL[Math.floor(Math.random()*WEAPON_DROP_POOL.length)];
  if(!save.inventory.weapons[key]){
    save.inventory.weapons[key]={owned:true,level:1,xp:0};
    toast('NYT VÅBEN: '+WEAPONS[key].name);
    flashScreen('#ffd35a',.34); sfx.record();
  }else{
    const scrap=35 + Math.floor(Math.random()*35);
    save.inventory.scrap += scrap;
    toast('Dublet: '+WEAPONS[key].name+' → +'+scrap+' skrot');
  }
  if(source) floatText(source.x,source.y,'LOOT: '+WEAPONS[key].name,'#ffd35a');
  if(save.inventory && save.inventory.weapons && Object.keys(save.inventory.weapons).filter(k=>save.inventory.weapons[k].owned).length>=4) unlock('armory');
  persist();
}
function gainScrap(n, x, y){
  ensureInventory();
  save.inventory.scrap += Math.floor(n);
  if(x!==undefined) floatText(x,y,'+'+Math.floor(n)+' skrot','#bfc7d9');
}
function upgradeWeapon(key){
  ensureInventory();
  if(!weaponOwned(key)){ toast('Du ejer ikke våbnet endnu. Tragisk.'); return; }
  if(weaponMaxed(key)){ toast('Maks-level. Forsk i Mestersmedning for at hæve loftet.'); return; }
  const cost=weaponUpgradeCost(key);
  if(save.inventory.scrap<cost){ toast('For lidt skrot. Smadr mere lort.'); return; }
  save.inventory.scrap-=cost;
  save.inventory.weapons[key].level=(save.inventory.weapons[key].level||1)+1;
  const lvl=save.inventory.weapons[key].level;
  toast(WEAPONS[key].name+' Lv'+lvl + (lvl===5||lvl===10?' — EVOLUTION! +gennemtrængning':''));
  sfx.level(); persist(); refreshMenu();
}
function equipWeapon(key){
  ensureInventory();
  if(!weaponOwned(key)){ toast('Låst våben. Find det i minen først.'); return; }
  save.inventory.selectedWeapon=key;
  toast('Udstyret: '+WEAPONS[key].name);
  sfx.ui(); persist(); refreshMenu();
}
function renderInventory(el){
  ensureInventory();
  let html='<div class="item"><div class="itemTop"><h3>Inventory</h3><span class="badge">'+fmt(save.inventory.scrap)+' skrot</span></div><p>Våben skyder automatisk fremad mod farer. Opgradér med skrot fra loot-kasser, krystaller og smadrede farer. Ved <b>Lv5</b> og <b>Lv10</b> får hvert våben en <b>evolution</b>. Økonomien er justeret, så første upgrades ikke kræver tre arbejdsuger i en mine, heldigvis.</p></div>';
  html+='<div class="inventoryGrid">';
  for(const key of WEAPON_ORDER){
    const w=WEAPONS[key], own=weaponOwned(key), lvl=weaponLevel(key), st=weaponStats(key), eq=currentWeaponKey()===key;
    const mx=weaponMax(key), maxed=own&&weaponMaxed(key);
    const cost=own?weaponUpgradeCost(key):0;
    const lockTxt = w.locked && !own ? 'Forskes frem i Laboratoriet' : (own?'Find flere i minen':'Find i mine');
    const evoTags = own ? `${lvl>=5?'<span style="color:#ffd35a">EVO I</span>':''}${lvl>=10?' <span style="color:#ff3df2">EVO II</span>':''}` : '';
    html+=`<div class="weaponCard ${own?'':'locked'} ${eq?'equipped':''}">
      <div class="itemTop"><h3>${own?'':'🔒 '}${w.name}</h3><span class="badge">${w.rarity}${own?' · Lv'+lvl+'/'+mx:''}</span></div>
      <p>${w.desc} ${evoTags}</p>
      <div class="weaponStats">
        <span>DMG ${st.damage.toFixed(1)}</span><span>Range ${Math.round(st.range)}</span><span>CD ${st.cooldown.toFixed(2)}s</span><span>Pierce ${st.pierce}${(st.leech||0)>0?' · Leech':''}</span>
      </div>
      <button class="equipBtn" data-equip="${key}" ${!own||eq?'disabled':''}>${eq?'Udstyret':own?'Equip':lockTxt}</button>
      <button class="upgradeWeaponBtn" data-wup="${key}" ${!own||maxed||save.inventory.scrap<cost?'disabled':''}>${!own?'Låst':maxed?'MAX':'Opgradér '+cost+' skrot'}</button>
    </div>`;
  }
  html+='</div>';
  el.innerHTML=html;
  el.querySelectorAll('[data-equip]').forEach(btn=>btn.onclick=()=>equipWeapon(btn.dataset.equip));
  el.querySelectorAll('[data-wup]').forEach(btn=>btn.onclick=()=>upgradeWeapon(btn.dataset.wup));
}

function objectiveText(goal){
  const parts=[];
  if(goal.finish) parts.push('nå mål');
  if(goal.score) parts.push('score '+fmt(goal.score));
  if(goal.bank) parts.push('bank '+fmt(goal.bank));
  if(goal.coins) parts.push('saml '+goal.coins+' guld');
  if(goal.skips) parts.push('skip '+goal.skips+' porte');
  if(goal.perfect) parts.push('ram '+goal.perfect+' perfect');
  if(goal.smash) parts.push('smadr '+goal.smash+' farer');
  return parts.join(' + ');
}
function campaignStarsFor(id){
  return (save.campaign && save.campaign.stars && save.campaign.stars[id]) || 0;
}
function renderCampaign(el){
  if(!save.campaign) save.campaign={unlocked:1,current:1,stars:{}};
  const unlocked=save.campaign.unlocked||1;
  let html='<div class="item"><h3>Kampagne</h3><p>Banerne bliver længere, smallere og mere aggressive. Her lærer spillet dig at banke, skippe, bruge evner og faktisk styre dværgen i stedet for bare at sende ham i døden som en lille behåret drone.</p></div>';
  html+='<div class="campaignGrid">';
  for(const lvl of CAMPAIGN_LEVELS){
    const locked=lvl.id>unlocked;
    const stars=campaignStarsFor(lvl.id);
    html+=`<div class="campaignCard ${locked?'locked':''}">
      <div class="itemTop"><h3>${lvl.id}. ${lvl.name}</h3><span class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</span></div>
      <p>${lvl.unlock}</p>
      <div class="objectiveLine">Mål: ${objectiveText(lvl.goal)}</div>
      <p>Speed ${lvl.speed.toFixed(2)} · farer ${lvl.hazards.toFixed(2)} · bredde ${lvl.width.toFixed(2)}</p>
      <button class="startBtn" data-campaign="${lvl.id}" ${locked?'disabled':''}>${locked?'Låst':'Start bane'}</button>
    </div>`;
  }
  html+='</div>';
  el.innerHTML=html;
  el.querySelectorAll('[data-campaign]').forEach(btn=>btn.onclick=()=>{ audioEnsure(); audioResume(); engineStart(); startCampaignLevel(Number(btn.dataset.campaign)); });
}
function renderSkills(el){
  let html='<div class="item"><h3>Skills</h3><p>Permanent progression købt for guld. Det giver flere muligheder, men hvis du flyver ind i en sten med ansigtet først, hjælper økonomisk vækst stadig ikke meget.</p></div>';
  html+='<div class="skillGrid">';
  for(const [key,sk] of Object.entries(SKILLS)){
    const lvl=skillLevel(key), cost=skillCost(key);
    const maxed=lvl>=sk.max;
    html+=`<div class="skillCard">
      <div class="itemTop"><h3>${sk.name}</h3><span class="badge">Lv ${lvl}/${sk.max}</span></div>
      <p>${sk.desc}</p>
      <div class="progress"><div style="width:${(lvl/sk.max*100).toFixed(0)}%"></div></div>
      <button class="skillBtn" data-skill="${key}" ${maxed||save.gold<cost?'disabled':''}>${maxed?'MAX':'Køb '+cost+'g'}</button>
    </div>`;
  }
  html+='</div>';
  el.innerHTML=html;
  el.querySelectorAll('[data-skill]').forEach(btn=>btn.onclick=()=>buySkill(btn.dataset.skill));
}

function renderUpgrades(el){
  let html='<div class="item"><h3>Udstyr</h3><p>Core, bankchip og evne. Hver kan opgraderes til <b>Lv'+MAX_GEAR_LEVEL+'</b>. Piloterne er flyttet til <b>Helte</b>-fanen, hvor de leveler via XP. Gælder i Random / Kaos / Træning / Kampagne / Overlevelse — ikke i de fair modes.</p></div>';
  html+='<div class="list">';
  for(const [type,label] of [['cores','Core'],['chips','Bankchips'],['abilities','Evner']]){
    html += `<div class="item"><h3>${label}</h3></div>`;
    for(const [key,item] of Object.entries(DATA[type])){
      const own=owned(type,key), lvl=itemLevel(type,key), maxed=own&&gearMaxed(type,key);
      const cost=own?upgradeCost(type,key):item.cost;
      const disabled = maxed || save.gold<cost;
      html += `<div class="item">
        <div class="itemTop">
          <div><h3>${own?'':'🔒 '}${item.name} ${own?`Lv${lvl}/${MAX_GEAR_LEVEL}`:''}</h3><p>${item.desc}</p></div>
          <button class="buyBtn" data-buy="${type}:${key}" ${disabled?'disabled':''}>${maxed?'MAX':own?'Opgradér':'Køb'} ${maxed?'':cost+'g'}</button>
        </div>
        ${own?`<div class="progress"><div style="width:${Math.min(100,lvl/MAX_GEAR_LEVEL*100)}%"></div></div>`:''}
      </div>`;
    }
  }
  html+='</div>';
  el.innerHTML=html;
  el.querySelectorAll('[data-buy]').forEach(btn=>btn.onclick=()=>buyOrUpgrade(btn.dataset.buy));
}
function buyOrUpgrade(str){
  const [type,key]=str.split(':');
  const item=getItem(type,key);
  const isOwn=owned(type,key);
  if(!isOwn && item.research && !researchDone(item.research)){ toast('Vølund vækkes i Laboratoriet — ikke til salg endnu.'); return; }
  if(isOwn && gearMaxed(type,key)){ toast('Maks-level nået.'); return; }
  const cost=isOwn?upgradeCost(type,key):item.cost;
  if(save.gold<cost){toast('For lidt guld. Klassisk fattigdom.'); return;}
  save.gold-=cost;
  if(!isOwn){
    save.owned[type].push(key);
    save.levels[type][key]=1;
    const prop = type==='pilots'?'pilot':type==='cores'?'core':type==='chips'?'chip':'ability';
    save.selected[prop]=key;
    if(type==='pilots') ensureCharacters();
    toast(`Købt: ${item.name}`);
  }else{
    save.levels[type][key]=(save.levels[type][key]||1)+1;
    toast(`Opgraderet: ${item.name} Lv${save.levels[type][key]}`);
  }
  sfx.ui();
  persist(); refreshMenu();
}
function fmtDur(ms){
  const s=Math.round(ms/1000);
  if(s<60) return s+'s';
  const m=Math.floor(s/60);
  if(m<60) return m+' min';
  const h=Math.floor(m/60), mm=m%60;
  return h+' t'+(mm?(' '+mm+'m'):'');
}
function fmtRemain(ms){
  ms=Math.max(0,ms);
  const s=Math.ceil(ms/1000);
  if(s<60) return s+'s';
  const m=Math.floor(s/60), ss=s%60;
  if(m<60) return m+'m '+String(ss).padStart(2,'0')+'s';
  const h=Math.floor(m/60), mm=m%60;
  return h+'t '+String(mm).padStart(2,'0')+'m';
}
function statSummary(obj){
  const names={lift:'Løft',control:'Kontrol',greed:'Grådighed',bank:'Bank',perfect:'Perfekt',split:'Split',hp:'HP',hammer:'Smash',magnet:'Sug',speed:'Fart',cd:'Evne-cd',salvage:'Redning',coin:'Guld',xp:'XP',interest:'Rente',refund:'Refusion',weapon:'Våben',ultcharge:'Ult-lad',data:'Data'};
  const parts=[];
  for(const [k,v] of Object.entries(obj)){
    if(Math.abs(v)<0.0001) continue;
    const lbl=names[k]||k;
    if(k==='hp') parts.push('+'+Math.round(v)+' '+lbl);
    else parts.push((v>0?'+':'')+Math.round(v*100)+'% '+lbl);
  }
  return parts;
}
function selectCharacter(key){
  if(!owned('pilots',key)){ toast('Helten er ikke låst op endnu.'); return; }
  save.selected.pilot=key; sfx.ui(); persist(); refreshMenu();
}
function renderCharacters(el){
  ensureCharacters();
  const active=activeChar();
  let html='<div class="item"><h3>Helte</h3><p>Hver helt har <b>eget level</b>, <b>XP</b>, et unikt <b>ULTIMATE</b> (knap nederst til højre i kampen) og <b>perks</b> der låses op når helten leveler. Helten du spiller, får XP efter hvert run. Vælg en helt, og dyrk dens speciale. <b>Fair modes (Dagens Mine + Duel) bruger altid Bram + standard-build — så leaderboardet ikke forurenes.</b></p></div>';
  html+='<div class="charGrid">';
  for(const key of CHAR_ORDER){
    const c=CHARACTERS[key]; if(!c) continue;
    const item=DATA.pilots[key];
    const own=owned('pilots',key);
    const lvl=charLevel(key), xp=charXp(key), need=charXpNeed(lvl);
    const isActive=active===key && own;
    const researchLock = c.research && !own;
    const passive=statSummary(characterStats(key)).slice(0,4).join(' · ')||'—';
    const next=c.perks.find(p=>lvl<p.lvl);
    let perksHtml='<div class="perkList">';
    for(const p of c.perks){
      const got=lvl>=p.lvl;
      perksHtml+=`<div class="perk ${got?'got':''}"><span class="perkLvl">Lv${p.lvl}</span> <b>${got?'✓ ':'🔒 '}${p.name}</b> <span class="perkNote">${p.note}</span></div>`;
    }
    perksHtml+='</div>';
    let btn;
    if(isActive) btn=`<button class="charBtn active" disabled>★ Aktiv helt</button>`;
    else if(own) btn=`<button class="charBtn" data-pick="${key}">Vælg helt</button>`;
    else if(researchLock) btn=`<button class="charBtn locked" disabled>🔬 Vækkes i Laboratoriet</button>`;
    else btn=`<button class="charBtn buy" data-cbuy="${key}" ${save.gold<item.cost?'disabled':''}>Lås op · ${item.cost}g</button>`;
    html+=`<div class="charCard ${isActive?'activeCard':''} ${own?'':'lockedCard'}" style="--cc:${c.color}">
      <div class="charHead">
        <div><h3>${item.name}</h3><div class="charRole" style="color:${c.color}">${c.role}${own?' · Lv'+lvl+'/'+CHAR_MAX:''}</div></div>
        ${own?`<span class="lvlBadge" style="border-color:${c.color}66;color:${c.color}">Lv ${lvl}</span>`:''}
      </div>
      ${own?`<div class="xpBar"><div style="width:${lvl>=CHAR_MAX?100:(xp/need*100).toFixed(0)}%;background:${c.color}"></div></div><div class="xpTxt">${lvl>=CHAR_MAX?'MAKS LEVEL':'XP '+fmt(xp)+' / '+fmt(need)}</div>`:''}
      <div class="ultBox" style="border-color:${c.color}55"><b style="color:${c.color}">⚡ ${c.ultName}</b><span>${c.ultDesc}</span></div>
      <div class="passiveLine">Passiv: ${passive}</div>
      ${own&&next?`<div class="nextPerk">Næste perk: Lv${next.lvl} — ${next.name}</div>`:''}
      ${perksHtml}
      ${btn}
    </div>`;
  }
  html+='</div>';
  el.innerHTML=html;
  el.querySelectorAll('[data-pick]').forEach(btn=>btn.onclick=()=>selectCharacter(btn.dataset.pick));
  el.querySelectorAll('[data-cbuy]').forEach(btn=>btn.onclick=()=>{ buyOrUpgrade('pilots:'+btn.dataset.cbuy); });
}
function renderResearch(el){
  ensureResearch();
  if(!labUnlocked()){
    el.innerHTML='<div class="item"><h3>🔬 Laboratoriet er forseglet</h3><p>Forskning åbner ved <b>konto-level '+labUnlockedAt()+'</b>. Du er level '+save.level+'. Spil et par runs, saml XP — og kom igen, når dværgen er kommet lidt længere i karrieren.</p></div>';
    return;
  }
  const R=save.research;
  let html='<div class="item"><div class="itemTop"><h3>🔬 Laboratorie</h3><span class="badge" style="color:#7CF6E3">'+fmt(R.points)+' data</span></div><p>Start projekter der <b>forsker over tid</b> — også mens spillet er lukket. De giver permanente bonusser, hæver maks-levels og låser nye helte og våben op. Forskningsdata får du ved at <b>smadre krystaller</b> i minen, fra kampagne og fra runs.'+(R.passiveGold?' <b>Drone:</b> +'+R.passiveGold+'g/run.':'')+'</p></div>';

  // Aktive bænke
  html+='<div class="item"><h3>Forskningsbænke ('+R.slots+')</h3></div>';
  html+='<div class="benchGrid">';
  for(let s=0;s<R.slots;s++){
    const q=researchQueueEntry(s);
    if(!q){ html+='<div class="benchCard empty"><div class="benchTop"><b>Bænk '+(s+1)+'</b><span class="badge">Ledig</span></div><p>Vælg et projekt nedenfor.</p></div>'; continue; }
    const p=RESEARCH[q.id]||{name:q.id};
    const ready=researchReady(s), prog=researchProgress(s);
    const remain=Math.max(0,q.dur-(Date.now()-q.start));
    html+=`<div class="benchCard ${ready?'ready':'running'}">
      <div class="benchTop"><b>${p.name}</b><span class="badge">${ready?'✅ Klar':'⏳ '+fmtRemain(remain)}</span></div>
      <div class="progress"><div style="width:${(prog*100).toFixed(1)}%;background:${ready?'#63ff9a':'linear-gradient(90deg,#41e8ff,#7CF6E3)'}"></div></div>
      <button class="labBtn ${ready?'claim':''}" data-claim="${s}" ${ready?'':'disabled'}>${ready?'Hent belønning':'Forsker…'}</button>
    </div>`;
  }
  html+='</div>';

  // Tilgængelige projekter
  html+='<div class="item"><h3>Projekter</h3></div>';
  html+='<div class="list">';
  const free=freeResearchSlot()>=0;
  for(const id of RESEARCH_ORDER){
    const p=RESEARCH[id]; if(!p) continue;
    const done=!p.repeatable && researchDone(id);
    const running=isResearching(id);
    const levelLock=save.level<p.reqLevel;
    const depLock=(p.reqDone||[]).some(d=>!researchDone(d));
    const affordable=save.gold>=(p.cost.gold||0) && R.points>=(p.cost.data||0);
    let status='', btn='';
    const costStr=`${p.cost.gold?p.cost.gold+'g':''}${p.cost.gold&&p.cost.data?' · ':''}${p.cost.data?p.cost.data+' data':''}`||'gratis';
    if(done){ status='<span class="done">✓ Færdig</span>'; }
    else if(running){ status='<span class="running">⏳ I gang</span>'; }
    else if(levelLock){ status='<span class="lock">Kræver level '+p.reqLevel+'</span>'; }
    else if(depLock){ const names=(p.reqDone||[]).filter(d=>!researchDone(d)).map(d=>RESEARCH[d]?RESEARCH[d].name:d).join(', '); status='<span class="lock">Kræver: '+names+'</span>'; }
    if(!done && !running && !levelLock && !depLock){
      btn=`<button class="buyBtn" data-start="${id}" ${(!free||!affordable)?'disabled':''}>${!free?'Ingen ledig bænk':'Start'}</button>`;
    }
    html+=`<div class="item ${done?'researchDone':''}">
      <div class="itemTop">
        <div><h3>${p.name} <span class="catTag">${p.cat}</span></h3><p>${p.desc}</p></div>
        ${btn}
      </div>
      <div class="researchMeta"><span>⏱ ${fmtDur(p.dur)}</span><span>💰 ${costStr}</span>${status}</div>
    </div>`;
  }
  html+='</div>';
  el.innerHTML=html;
  el.querySelectorAll('[data-claim]').forEach(btn=>btn.onclick=()=>claimResearch(Number(btn.dataset.claim)));
  el.querySelectorAll('[data-start]').forEach(btn=>btn.onclick=()=>startResearch(btn.dataset.start));
}
function ensureDailyMissions(){
  const d=dayKey();
  if(save.mission.date!==d){
    save.mission={date:d,daily:{
      bank:{target:8000, value:0, done:false, text:'Bank 8.000 score'},
      coins:{target:45, value:0, done:false, text:'Saml 45 guld'},
      skips:{target:8, value:0, done:false, text:'Skip 8 porte'},
      bats:{target:6, value:0, done:false, text:'Smadr 6 bats/sten'}
    }};
    persist();
  }
}
function ensureDailyRun(){
  const d=dayKey();
  if(save.dailyRun.date!==d){
    save.dailyRun={date:d, tries:0, best:0};
    persist();
  }
}
function missionAdd(key,val){
  ensureDailyMissions();
  const m=save.mission.daily[key]; if(!m || m.done) return;
  m.value += val;
  if(m.value>=m.target){
    m.done=true; save.gold+=180; gainXP(70);
    toast(`Mission klaret: ${m.text} +180g`);
  }
}
function renderMissions(el){
  ensureDailyMissions();
  let html='<div class="list">';
  for(const [k,m] of Object.entries(save.mission.daily)){
    const pct=Math.min(100,m.value/m.target*100);
    html += `<div class="item"><div class="itemTop"><h3>${m.done?'✅':'⬜'} ${m.text}</h3><span class="badge">${Math.min(Math.floor(m.value),m.target)}/${m.target}</span></div><div class="progress"><div style="width:${pct}%"></div></div><p>Belønning: 180g + XP</p></div>`;
  }
  html+='</div>';
  el.innerHTML=html;
}
const ACH = {
  firstCrash:{name:'Velkommen til væggen', text:'Crash første gang.'},
  greedy:{name:'Grådig idiot', text:'Skip 5 porte i ét run.'},
  rich:{name:'Lille kapitalist', text:'Hav 2.000 guld.'},
  bankman:{name:'Bankmanden', text:'Bank 20.000 i ét run.'},
  batkiller:{name:'Skadedyrsbekæmper', text:'Smadr 10 bats/sten totalt.'},
  perfect:{name:'Ren linje', text:'Ram 3 perfect gates i ét run.'},
  graze:{name:'Vægkysser', text:'Surf tæt på væggen i 6 sekunder samlet i ét run.'},
  duelist:{name:'Skurvognskongen', text:'Vind en duel mod en ven.'},
  finisher:{name:'Hele vejen', text:'Nå minens udgang i live.'},
  survivor:{name:'Overlever', text:'Nå wave 8 i Overlevelse.'},
  armory:{name:'Våbenskab', text:'Find 4 forskellige våben.'},
};
function unlock(key){
  if(save.achievements[key]) return;
  save.achievements[key]=Date.now();
  save.gold += 220; gainXP(80);
  toast(`Achievement: ${ACH[key].name} +220g`);
}
function renderAchievements(el){
  let html='<div class="list">';
  for(const [k,a] of Object.entries(ACH)){
    const done=!!save.achievements[k];
    html += `<div class="item"><div class="itemTop"><h3>${done?'🏆':'🔒'} ${a.name}</h3><span class="badge">${done?'Klar':'Mangler'}</span></div><p>${a.text}</p></div>`;
  }
  html+='</div>';
  el.innerHTML=html;
}
function renderLeaderboard(el){
  const tSeed=todaySeed();
  const today=save.leaderboard.filter(r=>r.seed===tSeed && r.mode==='Dagens Mine').sort((a,b)=>b.score-a.score).slice(0,5);
  const all=[...save.leaderboard].sort((a,b)=>b.score-a.score).slice(0,12);
  if(!all.length){el.innerHTML='<div class="item"><h3>Ingen runs endnu</h3><p>Spil først. Databaser bliver mærkeligt nok ikke fyldt af gode intentioner.</p></div>'; return;}
  let html='<div class="list">';
  if(today.length){
    html+='<div class="item"><h3>🌞 Dagens Mine (i dag)</h3></div>';
    html+=today.map((r,i)=>`<div class="item"><div class="itemTop"><h3>#${i+1} ${fmt(r.score)}</h3><span class="badge">forsøg</span></div><p>Peak x${r.peak.toFixed(2)} · bank ${fmt(r.bank)}</p></div>`).join('');
  }
  html+='<div class="item"><h3>🏆 Alle tiders</h3></div>';
  html+=all.map((r,i)=>`<div class="item"><div class="itemTop"><h3>#${i+1} ${fmt(r.score)}</h3><span class="badge">${r.mode}</span></div><p>Peak x${r.peak.toFixed(2)} · bank ${fmt(r.bank)} · seed ${String(r.seed).slice(0,6)}</p></div>`).join('');
  html+='</div>';
  el.innerHTML=html;
}
