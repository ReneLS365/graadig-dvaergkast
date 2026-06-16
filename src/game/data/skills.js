/* Static skill upgrade metadata.
   Extracted unchanged from src/game/parts/03-data-save.js. */
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
