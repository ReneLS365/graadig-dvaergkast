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
