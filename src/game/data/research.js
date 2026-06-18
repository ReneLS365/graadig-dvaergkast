/* Static research definitions extracted unchanged from src/game/parts/05-laboratorie-tidsbaseret-forskning.js. */
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
