/* Static weapon definitions.
   Extracted unchanged from src/game/parts/03-data-save.js. */
const WEAPONS = {
  axe:{name:'Kasteøkse',rarity:'Common',max:12,desc:'Auto-kaster økser mod nærmeste fare foran dværgen.',base:{damage:1.0,range:155,cooldown:1.05,pierce:1}},
  crossbow:{name:'Rune-armbrøst',rarity:'Rare',max:12,desc:'Længere range og bedre præcision. Kedeligt, men effektivt.',base:{damage:0.85,range:245,cooldown:0.92,pierce:1}},
  chain:{name:'Kædehammer',rarity:'Epic',max:14,desc:'Kort range, hårdt slag og kan ramme flere farer tæt på.',base:{damage:1.35,range:130,cooldown:1.25,pierce:2}},
  blunder:{name:'Krudtblæser',rarity:'Epic',max:14,desc:'Bred cone foran dværgen. Perfekt mod flagermusflokke.',base:{damage:0.72,range:185,cooldown:1.65,pierce:4}},
  drillgun:{name:'Bor-kanon',rarity:'Legendary',max:16,desc:'Langsom, tung og brutal. Sten får personaleproblemer.',base:{damage:2.25,range:210,cooldown:1.9,pierce:1}},
  runeblade:{name:'Runesværd',rarity:'Mythic',max:18,desc:'Kort cooldown og giver lidt live pot ved kills.',base:{damage:1.05,range:175,cooldown:0.72,pierce:1,leech:0.12}},
  tesla:{name:'Tesla-spole',rarity:'Mythic',max:18,locked:true,desc:'Forsknings-prototype. Lyn springer mellem mange farer og giver lidt live pot. Kun fra Laboratoriet.',base:{damage:0.95,range:230,cooldown:0.86,pierce:5,leech:0.08}}
};
