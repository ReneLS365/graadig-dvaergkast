/* Static campaign level definitions extracted from src/game/parts/03-data-save.js.
   Keep values unchanged; this file is bundled before runtime parts. */
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
