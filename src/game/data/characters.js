/* Static character metadata extracted from src/game/parts/04-helte-characters-xp-level-perks-ultimate.js. */
const CHAR_MAX = 30;
const CHARACTERS = {
  bram:{ role:'Bankér', color:'#63ff9a',
    ultName:'Guldregn', ultShort:'GULDREGN',
    ultDesc:'Banker straks 55% af live pot til dobbelt værdi og udløser 4s guldregn + bank-boost.',
    base:{bank:.10, control:.03},
    growth:{bank:.005, control:.0015},
    perks:[
      {lvl:5,  name:'Renteøre',        stats:{interest:.06},          note:'Banket score drypper tilbage i live pot.'},
      {lvl:10, name:'Solid hånd',      stats:{control:.04, hp:1},     note:'+1 HP og mere kontrol.'},
      {lvl:15, name:'Dobbeltbogføring',stats:{bank:.08},              note:'Mere bank-værdi.'},
      {lvl:20, name:'Guldreserve',     stats:{coin:.10, salvage:.03}, note:'Mere guld + lidt crash-redning.'},
      {lvl:25, name:'Storkapital',     stats:{bank:.10, interest:.05},note:'Bank + renter.'},
      {lvl:30, name:'Minekonge',       stats:{bank:.12, control:.04, hp:1}, note:'Komplet bankmaskine.'}
    ]},
  ragnar:{ role:'Risikorytter', color:'#ff3df2',
    ultName:'Blodrus', ultShort:'BLODRUS',
    ultDesc:'×1.8 multiplier nu + 3.5s usårlig fartrus. Belønner mod, straffer fejhed.',
    base:{greed:.14, bank:-.06, control:-.03},
    growth:{greed:.006, control:.0012},
    perks:[
      {lvl:5,  name:'Adrenalin',     stats:{ultcharge:.10},        note:'Ultimativ lader hurtigere.'},
      {lvl:10, name:'Tunnelsyn',     stats:{greed:.07, control:.02},note:'Mere greed, en smule styr.'},
      {lvl:15, name:'Vægkysser',     stats:{greed:.06, salvage:.03},note:'Greed + crash-redning.'},
      {lvl:20, name:'Overmod',       stats:{greed:.09},            note:'Endnu hurtigere multiplier.'},
      {lvl:25, name:'Dødsforagt',    stats:{hp:1, greed:.06},      note:'+1 HP til de vilde linjer.'},
      {lvl:30, name:'Berserker-konge',stats:{greed:.12, speed:.03},note:'Maks fart, maks grådighed.'}
    ]},
  frida:{ role:'Præcision', color:'#41e8ff',
    ultName:'Nålestik', ultShort:'NÅLESTIK',
    ultDesc:'4s slowmotion + de næste 3 porte rammes automatisk perfekt.',
    base:{control:.10, perfect:.14, greed:-.02},
    growth:{control:.004, perfect:.006},
    perks:[
      {lvl:5,  name:'Rolig puls',  stats:{control:.05},           note:'Mere kontrol.'},
      {lvl:10, name:'Skarp linje', stats:{perfect:.10},           note:'Større perfekt-bonus.'},
      {lvl:15, name:'Mikrojustér', stats:{control:.05, cd:.03},   note:'Kontrol + kortere evne-cd.'},
      {lvl:20, name:'Diamanthånd', stats:{perfect:.12, bank:.05}, note:'Perfekt + bank.'},
      {lvl:25, name:'Nulfejl',     stats:{control:.06, hp:1},     note:'+1 HP, mere styr.'},
      {lvl:30, name:'Mesterskytte',stats:{perfect:.14, control:.05},note:'Næsten umulig at ryste.'}
    ]},
  ulf:{ role:'Tank', color:'#ff9d3d',
    ultName:'Jordskælv', ultShort:'JORDSKÆLV',
    ultDesc:'Smadrer alle farer på skærmen, +2 HP og stor smash-score.',
    base:{hp:1, hammer:.14, greed:-.03},
    growth:{hammer:.005, control:.0015},
    perks:[
      {lvl:5,  name:'Tykt kranie', stats:{hp:1},                  note:'+1 HP.'},
      {lvl:10, name:'Tung hammer', stats:{hammer:.10, cd:.03},    note:'Stærkere smash, kortere cd.'},
      {lvl:15, name:'Stenhud',     stats:{salvage:.04, control:.02},note:'Crash-redning.'},
      {lvl:20, name:'Murbryder',   stats:{hammer:.12, weapon:.06},note:'Smash + våbenskade.'},
      {lvl:25, name:'Bjergtrold',  stats:{hp:1, hammer:.08},      note:'+1 HP.'},
      {lvl:30, name:'Klippeblok',  stats:{hp:1, hammer:.12, salvage:.04}, note:'Næsten udødelig arbejdshest.'}
    ]},
  sigrid:{ role:'Sprængstof', color:'#ff496c',
    ultName:'Krudttønde', ultShort:'KRUDTTØNDE',
    ultDesc:'Enorm eksplosion langt foran dig: massiv smash-score og skrot.',
    base:{hammer:.26, speed:.03, bank:-.05},
    growth:{hammer:.007, speed:.0008},
    perks:[
      {lvl:5,  name:'Kort lunte',  stats:{cd:.04},               note:'Kortere evne-cooldown.'},
      {lvl:10, name:'Brisant',     stats:{hammer:.12},           note:'Stærkere smash.'},
      {lvl:15, name:'Splintbombe', stats:{hammer:.08, weapon:.06},note:'Smash + våbenskade.'},
      {lvl:20, name:'Detonator',   stats:{hammer:.12, speed:.02},note:'Mere smash og fart.'},
      {lvl:25, name:'Sortkrudt',   stats:{hammer:.10, coin:.06}, note:'Smash + guld fra vrag.'},
      {lvl:30, name:'Sprængmester',stats:{hammer:.14, cd:.05},   note:'Konstant ødelæggelse.'}
    ]},
  grim:{ role:'Guldgrav', color:'#ffd35a',
    ultName:'Støvsuger-storm', ultShort:'STØV-STORM',
    ultDesc:'Suger alle mønter og kasser på skærmen ind til dig + guldregn.',
    base:{magnet:.26, coin:.18, control:.04},
    growth:{magnet:.006, coin:.005},
    perks:[
      {lvl:5,  name:'Lang slange', stats:{magnet:.10},           note:'Længere sug.'},
      {lvl:10, name:'Guldnæse',    stats:{coin:.10},             note:'Mere guld.'},
      {lvl:15, name:'Bredt felt',  stats:{magnet:.08, control:.02},note:'Bredere sug.'},
      {lvl:20, name:'Kapitalist',  stats:{coin:.10, bank:.05},   note:'Guld + bank.'},
      {lvl:25, name:'Datasnu',     stats:{data:.12, coin:.06},   note:'Mere forskningsdata.'},
      {lvl:30, name:'Mammut-sug',  stats:{magnet:.12, coin:.10}, note:'Alting suges ind.'}
    ]},
  thorin:{ role:'Comeback', color:'#8d63ff',
    ultName:'Sidste Ord', ultShort:'SIDSTE ORD',
    ultDesc:'Fuld HP-genopladning, overladning af multiplier og alle farer ryddet. Panikknap.',
    base:{greed:.22, salvage:.07, control:-.06},
    growth:{greed:.006, salvage:.003},
    perks:[
      {lvl:5,  name:'Sejt sind',   stats:{salvage:.04},          note:'Mere crash-redning.'},
      {lvl:10, name:'Andet vejr',  stats:{greed:.07, hp:1},      note:'+1 HP, mere greed.'},
      {lvl:15, name:'Genrejsning', stats:{salvage:.05, ultcharge:.08},note:'Redning + hurtig ult.'},
      {lvl:20, name:'Trodsig',     stats:{greed:.09},            note:'Hurtigere multiplier.'},
      {lvl:25, name:'Sidste mand', stats:{hp:1, salvage:.04},    note:'+1 HP.'},
      {lvl:30, name:'Udødelig idiot',stats:{greed:.10, salvage:.05, hp:1}, note:'Lever af dårlige idéer.'}
    ]},
  volund:{ role:'Runesmed', color:'#7CF6E3', research:true,
    ultName:'Rune-overladning', ultShort:'OVERLADN.',
    ultDesc:'6s tredobbelt våbenild + ekstra gennemtrængning og et multiplier-løft.',
    base:{weapon:.16, hammer:.10, control:.03, bank:.04},
    growth:{weapon:.006, hammer:.004},
    perks:[
      {lvl:5,  name:'Hærdet stål', stats:{weapon:.08},           note:'Mere våbenskade.'},
      {lvl:10, name:'Præcis æg',   stats:{weapon:.06, control:.03},note:'Skade + kontrol.'},
      {lvl:15, name:'Runeindgravering',stats:{weapon:.08, hammer:.05},note:'Skade + smash.'},
      {lvl:20, name:'Mestersmed',  stats:{weapon:.10, bank:.05}, note:'Skade + bank.'},
      {lvl:25, name:'Stjernemetal',stats:{weapon:.08, hp:1},     note:'+1 HP.'},
      {lvl:30, name:'Gudesmed',    stats:{weapon:.12, hammer:.06, control:.03}, note:'Våbnene bliver mytiske.'}
    ]}
};
const CHAR_ORDER=['bram','ragnar','frida','ulf','sigrid','grim','thorin','volund'];
