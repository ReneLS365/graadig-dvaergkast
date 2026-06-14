/* ================= DATA & SAVE ================= */
const GAME_VERSION = 'v14-core-refactor';
const SAVE_KEY = 'graadig_dvaerg_v3';
const SAVE_SCHEMA_VERSION = 4; // beholdt for bagudkompatibilitet, fordi at miste saves er sådan noget software gør når det hader mennesker.
const DATA = {
  pilots:{
    bram:{name:'Bram Jernskæg',desc:'+bank, stabil. Kedelig men effektiv.', cost:0, stats:{bank:0.14, control:0.04, greed:-0.04}},
    ragnar:{name:'Ragnar Rågrådig',desc:'+multiplier ved skip. Crasher ofte ind i væggen.', cost:450, stats:{greed:0.18, bank:-0.10, control:-0.05}},
    frida:{name:'Frida Finmotorik',desc:'+kontrol og perfect gates.', cost:650, stats:{control:0.12, perfect:0.18, greed:-0.03}},
    ulf:{name:'Ulf Stenhoved',desc:'+HP og hammer. Ikke elegant. Det er en dværg.', cost:850, stats:{hp:1, hammer:0.18, greed:-0.04}},
    sigrid:{name:'Sigrid Sortkrudt',desc:'+smash og eksplosiv frontkontrol. Dårlig bankdisciplin.', cost:1200, stats:{hammer:0.35, speed:0.04, bank:-0.06}},
    grim:{name:'Grim Guldnæse',desc:'+støvsuger, guld og kontrol. En kapitalist med hjelm.', cost:1400, stats:{magnet:0.32, coin:0.22, control:0.05}},
    thorin:{name:'Thorin Overmod',desc:'+greed og comeback. Belønner høj puls og dårlige idéer.', cost:1800, stats:{greed:0.28, salvage:0.08, control:-0.07}}, 
    volund:{name:'Vølund Runesmed',desc:'🔒 Forskningslås. Smeden der gør alle våben dødelige. Vækkes i Laboratoriet.', cost:0, research:'volund', stats:{}},
  },
  cores:{
    oak:{name:'Egetræs-katapult',desc:'Balanceret start-core.', cost:0, stats:{lift:0.00, control:0.04, speed:0}},
    rocket:{name:'Raketrøv Mk.I',desc:'Mere fart og score, mindre kontrol.', cost:500, stats:{lift:0.10, speed:0.10, greed:0.08, control:-0.08}},
    gyro:{name:'Gyro-støvler',desc:'Mere præcis styring.', cost:650, stats:{control:0.16, lift:0.02, greed:-0.03}},
    anvil:{name:'Ambolt-bælte',desc:'Tung, stabil, høj bank.', cost:700, stats:{bank:0.16, control:0.08, speed:-0.08}},
    coil:{name:'Stormspole',desc:'Hurtig acceleration og vild multiplier. Kræver hænder, ikke håb.', cost:1050, stats:{speed:0.13, greed:0.10, control:-0.07}},
    drillcore:{name:'Bor-kerne',desc:'Smash bliver stærkere og farer foran dig bliver mindre træls.', cost:1250, stats:{hammer:0.32, control:0.03}},
    phoenix:{name:'Føniks-sele',desc:'Lidt salvage fra live pot ved crash. Fejlen gør stadig ondt.', cost:1600, stats:{salvage:0.18, bank:-0.04}}, 
  },
  chips:{
    tin:{name:'Tin-chip',desc:'Ingen dikkedarer.', cost:0, stats:{}},
    deep:{name:'Dybbank',desc:'Banker mere, men multiplier vokser langsommere.', cost:500, stats:{bank:0.24, greed:-0.08}},
    splitter:{name:'Splitgrådig',desc:'Splitbank er stærkere.', cost:600, stats:{split:0.25, bank:-0.04}},
    perfect:{name:'Perfekt-chip',desc:'Stor bonus på perfekte gates.', cost:750, stats:{perfect:0.35, control:-0.03}},
    interest:{name:'Rentes-rune',desc:'Banket score giver langsom bonus til live pot.', cost:1150, stats:{interest:0.22, bank:0.05}},
    vampire:{name:'Vampyr-bank',desc:'Får lidt live pot tilbage efter bank. Grådig økonomi, naturligvis.', cost:1350, stats:{refund:0.18, greed:0.04}},
    risk:{name:'Risikokontrakt',desc:'Højere top-score, dårligere sikkerhed.', cost:1550, stats:{greed:0.22, bank:-0.12, salvage:-0.04}}, 
  },
  abilities:{
    hammer:{name:'Hammer-smash',desc:'Smadr sten og bats foran dig.', cost:0, stats:{hammer:0}},
    shield:{name:'Skjoldbrøl',desc:'Ekstra fejlmargin.', cost:600, stats:{hp:1, cd:0.2}},
    magnet:{name:'Turbo-støvsuger',desc:'Gør front-sugeren længere og kraftigere.', cost:550, stats:{magnet:0.9}},
    dash:{name:'Bersærk-dash',desc:'Kort boost gennem farer. Sværere at styre.', cost:750, stats:{dash:1, control:-0.04}},
    drill:{name:'Tunnelbor',desc:'Rydder et længere felt foran dig og giver smash-score.', cost:1200, stats:{hammer:0.45, cd:-0.05}},
    chrono:{name:'Tidssprække',desc:'Sænker farten kortvarigt. Til folk med overlevelsesinstinkt.', cost:1450, stats:{control:0.04, cd:0.12}},
    overcharge:{name:'Overladning',desc:'Pumper multiplier nu. Gør næste sekunder mere farlige.', cost:1700, stats:{greed:0.08, speed:0.03}}, 
  }
};
const MAX_GEAR_LEVEL=10;

const CAMPAIGN_LEVELS = [
  {id:1,name:'Skaktens mund',seed:hashStr('camp-01'),speed:.78,hazards:.42,coins:.85,length:52,width:1.12,goal:{finish:true},reward:260,unlock:'Kampagnen åbner'},
  {id:2,name:'Guldfeberen',seed:hashStr('camp-02'),speed:.84,hazards:.55,coins:1.35,length:58,width:1.08,goal:{coins:45},reward:320,unlock:'Mere guld, mindre værdighed'},
  {id:3,name:'Bank eller bræk',seed:hashStr('camp-03'),speed:.90,hazards:.70,coins:1.05,length:64,width:1.03,goal:{bank:6500},reward:390,unlock:'Bankdisciplin'},
  {id:4,name:'Flagermus-gangen',seed:hashStr('camp-04'),speed:.94,hazards:1.05,coins:.95,length:70,width:1.00,goal:{smash:5},reward:460,unlock:'Hammer-arbejde'},
  {id:5,name:'Split-ruten',seed:hashStr('camp-05'),speed:1.00,hazards:1.05,coins:1.10,length:76,width:.97,goal:{score:12000},reward:540,unlock:'Midgame starter'},
  {id:6,name:'Perfekt eller død',seed:hashStr('camp-06'),speed:1.03,hazards:1.15,coins:1.00,length:82,width:.94,goal:{perfect:2},reward:620,unlock:'Præcision'},
  {id:7,name:'Rentehelvede',seed:hashStr('camp-07'),speed:1.07,hazards:1.25,coins:1.15,length:88,width:.91,goal:{bank:16000,skips:3},reward:720,unlock:'Greed bliver nødvendigt'},
  {id:8,name:'Sortkrudt-minen',seed:hashStr('camp-08'),speed:1.10,hazards:1.45,coins:1.15,length:94,width:.89,goal:{smash:9,score:16000},reward:820,unlock:'Kaos med formål'},
  {id:9,name:'Tynd luft',seed:hashStr('camp-09'),speed:1.14,hazards:1.50,coins:1.05,length:100,width:.86,goal:{finish:true,score:22000},reward:950,unlock:'Nu hjælper held ikke længere'},
  {id:10,name:'Grådighedsbroen',seed:hashStr('camp-10'),speed:1.18,hazards:1.65,coins:1.25,length:108,width:.84,goal:{skips:6,score:26000},reward:1100,unlock:'Panikøkonomi'},
  {id:11,name:'Mesterprøven',seed:hashStr('camp-11'),speed:1.22,hazards:1.85,coins:1.10,length:116,width:.81,goal:{finish:true,bank:30000},reward:1300,unlock:'Kun voksne hænder'},
  {id:12,name:'Dværgekongens skakt',seed:hashStr('camp-12'),speed:1.28,hazards:2.05,coins:1.35,length:126,width:.78,goal:{finish:true,score:45000,perfect:3},reward:1600,unlock:'Boss-mine klaret'}
];

const SKILLS = {
  vacuum:{name:'Industristøvsuger',max:12,base:240,desc:'Længere og stærkere front-sug.',stats:{magnet:.085}},
  control:{name:'Finmotorik',max:12,base:300,desc:'Mere præcis styring. Kedeligt navn, god effekt.',stats:{control:.045}},
  bank:{name:'Akkord-bank',max:12,base:300,desc:'Mere værdi når du banker.',stats:{bank:.052}},
  greed:{name:'Dårlige beslutninger',max:12,base:320,desc:'Højere multiplier-vækst. Overmod som investering.',stats:{greed:.045}},
  smash:{name:'Skadedyrsbonus',max:10,base:340,desc:'Stærkere hammer og kortere cooldown.',stats:{hammer:.075,cd:.02}},
  salvage:{name:'Crash-forsikring',max:8,base:380,desc:'Redder lidt af live pot ved crash.',stats:{salvage:.03}},
  minerluck:{name:'Guldnæse',max:10,base:320,desc:'Mere guld fra pickups.',stats:{coin:.045}},
  armory:{name:'Våbensmedning',max:10,base:360,desc:'Alle våben rammer hårdere. Sten klager til fagforeningen.',stats:{weapon:.06}},
  overclock:{name:'Adrenalinkredsløb',max:8,base:400,desc:'Ultimativ-måleren lader hurtigere. Mere kaos, oftere.',stats:{ultcharge:.07}},
  datamine:{name:'Datasnylter',max:6,base:380,desc:'Mere forskningsdata fra runs og krystaller.',stats:{data:.10}},
  stamina:{name:'Stenhud',max:6,base:520,desc:'Ekstra HP på høje levels.',stats:{hp:.30}},
  mastery:{name:'XP-maskine',max:8,base:440,desc:'Mere XP fra runs til konto OG helt.',stats:{xp:.07}}
};



const WEAPONS = {
  axe:{name:'Kasteøkse',rarity:'Common',max:12,desc:'Auto-kaster økser mod nærmeste fare foran dværgen.',base:{damage:1.0,range:155,cooldown:1.05,pierce:1}},
  crossbow:{name:'Rune-armbrøst',rarity:'Rare',max:12,desc:'Længere range og bedre præcision. Kedeligt, men effektivt.',base:{damage:0.85,range:245,cooldown:0.92,pierce:1}},
  chain:{name:'Kædehammer',rarity:'Epic',max:14,desc:'Kort range, hårdt slag og kan ramme flere farer tæt på.',base:{damage:1.35,range:130,cooldown:1.25,pierce:2}},
  blunder:{name:'Krudtblæser',rarity:'Epic',max:14,desc:'Bred cone foran dværgen. Perfekt mod flagermusflokke.',base:{damage:0.72,range:185,cooldown:1.65,pierce:4}},
  drillgun:{name:'Bor-kanon',rarity:'Legendary',max:16,desc:'Langsom, tung og brutal. Sten får personaleproblemer.',base:{damage:2.25,range:210,cooldown:1.9,pierce:1}},
  runeblade:{name:'Runesværd',rarity:'Mythic',max:18,desc:'Kort cooldown og giver lidt live pot ved kills.',base:{damage:1.05,range:175,cooldown:0.72,pierce:1,leech:0.12}},
  tesla:{name:'Tesla-spole',rarity:'Mythic',max:18,locked:true,desc:'Forsknings-prototype. Lyn springer mellem mange farer og giver lidt live pot. Kun fra Laboratoriet.',base:{damage:0.95,range:230,cooldown:0.86,pierce:5,leech:0.08}}
};
const WEAPON_ORDER=['axe','crossbow','chain','blunder','drillgun','runeblade','tesla'];
const WEAPON_DROP_POOL=['crossbow','chain','blunder','drillgun','runeblade'];
