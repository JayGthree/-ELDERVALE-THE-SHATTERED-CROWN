/* Eldervale: The Shattered Crown — playable browser-game foundation.
   Original canvas art, modular data-driven systems, local browser save. */
(() => {
"use strict";
const $ = id => document.getElementById(id);
const canvas = $("game"), ctx = canvas.getContext("2d"), mapCanvas = $("minimap"), mctx = mapCanvas.getContext("2d");
const W=canvas.width,H=canvas.height, TILE=48, WORLD_W=42, WORLD_H=32;
const RACES = {
 Human:{desc:"Versatile and resilient. Humans adapt quickly to unfamiliar lands and gain a little extra experience from every victory.",stats:{health:0,mana:0,stamina:5,power:0},passive:"+5 Stamina · +5% XP",icon:"♙"},
 Elf:{desc:"Graceful forest-born folk with keen senses and a deep bond with old magic. Elves favor precision over brute force.",stats:{health:-5,mana:15,stamina:0,power:1},passive:"+15 Mana · +1 Power",icon:"♧"},
 Orc:{desc:"Hardy survivors whose strength is matched by fierce determination. Orcs hit hard and can endure punishing battles.",stats:{health:25,mana:-10,stamina:10,power:2},passive:"+25 Health · +2 Power",icon:"♜"},
 Dwarf:{desc:"Stonewise craftsmen, stubborn defenders, and master smiths. Dwarves are tough and excel at making equipment.",stats:{health:20,mana:0,stamina:5,power:1},passive:"+20 Health · Crafting bonus",icon:"⬟"},
 "Dark Elf":{desc:"Children of the twilight courts: clever, quiet, and attuned to the dangerous magic that gathers beneath the world.",stats:{health:-5,mana:20,stamina:0,power:1},passive:"+20 Mana · +1 Power",icon:"☾"},
 Beastkin:{desc:"A broad family of animal-touched wanderers with sharp instincts, quick feet, and an old kinship with the wild.",stats:{health:5,mana:0,stamina:15,power:0},passive:"+15 Stamina · quicker recovery",icon:"❖"}
};
const CLASSES = {
 Tank:{desc:"A stalwart protector who absorbs punishment, holds ground, and turns survival into an advantage.",stats:{health:35,mana:0,stamina:15,power:1},skill:"Iron Guard",skillDesc:"Brace for impact, restore a little stamina, and reduce incoming damage briefly.",hybrid:"Juggernaut"},
 Wizard:{desc:"A scholar of raw arcana. Wizards trade physical resilience for powerful spells and deep mana reserves.",stats:{health:-10,mana:35,stamina:0,power:2},skill:"Arcane Bolt",skillDesc:"Launch a ranged bolt of focused magic at the nearest threat.",hybrid:"Battlemage"},
 Knight:{desc:"A trained weapon-master who balances offense, defense, and dependable close-range combat.",stats:{health:15,mana:5,stamina:10,power:2},skill:"Shieldbreak",skillDesc:"A heavy strike that deals bonus damage and briefly staggers nearby enemies.",hybrid:"Paladin"},
 Berserker:{desc:"A relentless fighter who converts pain and momentum into devastating attacks.",stats:{health:15,mana:-5,stamina:20,power:3},skill:"Frenzy",skillDesc:"A forceful sweep that deals heavy damage nearby; costs stamina.",hybrid:"Death Knight"},
 Ranger:{desc:"A patient scout and hunter, skilled at keeping distance, reading tracks, and striking weak points.",stats:{health:0,mana:5,stamina:25,power:1},skill:"Hunter's Mark",skillDesc:"A swift spectral shot that seeks the nearest enemy.",hybrid:"Warden"},
 Battlemage:{desc:"A hybrid of Wizard and Knight. Steel anchors spellcraft, and every strike can become a conduit for arcane force.",stats:{health:10,mana:20,stamina:5,power:3},skill:"Runeblade",skillDesc:"A magical melee pulse that damages nearby enemies.",hybrid:null},
 Warlock:{desc:"A dangerous pact-weaver who channels forbidden energies and weakens foes to strengthen their own resolve.",stats:{health:0,mana:30,stamina:0,power:3},skill:"Withering Hex",skillDesc:"Curse the nearest enemy with a burst of shadow damage.",hybrid:null},
 Paladin:{desc:"A sworn defender who channels sacred light into protection and punishment.",stats:{health:25,mana:15,stamina:5,power:2},skill:"Radiant Strike",skillDesc:"A bright shockwave that harms nearby foes and restores a little health.",hybrid:null},
 Spellblade:{desc:"A mobile duelist who binds magic to a weapon. The class is balanced, adaptable, and rewarding to master.",stats:{health:5,mana:15,stamina:10,power:2},skill:"Veil Slash",skillDesc:"Blink a short distance into a sweeping arcane slash.",hybrid:"Battlemage"},
 Juggernaut:{desc:"An almost immovable warrior. Slow to tire, difficult to stop, and dangerous when cornered.",stats:{health:45,mana:-5,stamina:20,power:3},skill:"Earthshatter",skillDesc:"Slam the ground to damage and stagger nearby foes.",hybrid:null},
 "Death Knight":{desc:"A fallen champion who weaponizes grave-magic. Powerful, but forever standing close to the edge.",stats:{health:25,mana:15,stamina:10,power:4},skill:"Grave Rend",skillDesc:"A dark arc that wounds foes and restores a fraction of damage dealt.",hybrid:null},
 Shadowblade:{desc:"A swift infiltrator mixing stealth, misdirection, and exacting strikes.",stats:{health:0,mana:10,stamina:20,power:3},skill:"Shadowstep",skillDesc:"Dash through danger and strike the nearest enemy.",hybrid:null},
 Druid:{desc:"A keeper of living magic who borrows strength from roots, rain, and ancient spirits.",stats:{health:10,mana:25,stamina:5,power:2},skill:"Verdant Pulse",skillDesc:"A healing pulse that restores health and damages nearby undead.",hybrid:null},
 Warden:{desc:"A protector of the wild roads. Wardens combine tracking, ranged pressure, and defensive nature magic.",stats:{health:15,mana:10,stamina:20,power:2},skill:"Thorn Volley",skillDesc:"A volley of thorns strikes nearby foes.",hybrid:null}
};
const ITEMS = {
 herb:{name:"Moonleaf",type:"material",rarity:"Common",desc:"A cool, silver-veined herb found beside old trees. Used in healing draughts.",value:3},
 mushroom:{name:"Embercap Mushroom",type:"material",rarity:"Common",desc:"A warm orange fungus that grows on fallen logs. A useful alchemical base.",value:4},
 wood:{name:"Heartwood",type:"material",rarity:"Common",desc:"Strong, fragrant wood gathered from deadfall. Used for simple tools and weapons.",value:3},
 ore:{name:"Iron Ore",type:"material",rarity:"Common",desc:"Rough iron-bearing stone. Smelt and shape it into reliable equipment.",value:5},
 hide:{name:"Wolf Pelt",type:"material",rarity:"Common",desc:"A sturdy pelt. Leatherworkers prize its flexibility.",value:6},
 crystal:{name:"Veil Crystal",type:"material",rarity:"Uncommon",desc:"A faintly luminous shard that hums near rifts. Handle with care.",value:18},
 potion:{name:"Minor Healing Draught",type:"consumable",rarity:"Common",desc:"Restores 35 health. A field staple brewed from Moonleaf and Embercap.",value:12},
 ether:{name:"Lesser Ether",type:"consumable",rarity:"Common",desc:"Restores 25 mana. Tastes sharply of mint and thunder.",value:12},
 ironSword:{name:"Roadwarden's Iron Sword",type:"weapon",rarity:"Common",desc:"A plain, serviceable blade with a wrapped ash handle. +3 Power.",value:35,power:3},
 oakStaff:{name:"Oak-and-Glass Staff",type:"weapon",rarity:"Uncommon",desc:"A balanced staff capped with a river-glass focus. +4 Power and +8 Mana.",value:52,power:4,mana:8},
 leatherArmor:{name:"Trail-Leather Jerkin",type:"armor",rarity:"Common",desc:"Layered leather that gives freedom of movement. +12 Health.",value:28,health:12},
 veilCharm:{name:"Veilglass Charm",type:"accessory",rarity:"Rare",desc:"A shard set in old silver. It feels warm when another world is close. +12 Mana, +2 Power.",value:90,mana:12,power:2}
};
const RECIPES = [
 {id:"potion",name:"Minor Healing Draught",desc:"Brew a small restorative tonic for dangerous roads.",needs:{herb:2,mushroom:1},gives:{potion:1},station:"Campfire / Alchemy"},
 {id:"ether",name:"Lesser Ether",desc:"A sharp, mint-scented infusion that restores mana.",needs:{herb:1,crystal:1},gives:{ether:1},station:"Campfire / Alchemy"},
 {id:"ironSword",name:"Roadwarden's Iron Sword",desc:"Forge a sturdy one-handed blade for your first serious expedition.",needs:{ore:3,wood:1},gives:{ironSword:1},station:"Forge"},
 {id:"leatherArmor",name:"Trail-Leather Jerkin",desc:"Patch wolf pelt into a flexible protective jerkin.",needs:{hide:3,wood:1},gives:{leatherArmor:1},station:"Workbench"},
 {id:"oakStaff",name:"Oak-and-Glass Staff",desc:"Bind a Veil Crystal into a heartwood staff to guide arcane power.",needs:{wood:3,crystal:2},gives:{oakStaff:1},station:"Arcane Workbench"}
];
const ENEMY_TYPES = {
 wolf:{name:"Gloam Wolf",hp:34,power:6,xp:18,gold:5,color:"#9ba9a1",speed:48,desc:"A hungry predator driven close to the road by the strange blue light in the woods.",drops:{hide:.75,herb:.25}},
 goblin:{name:"Briar Goblin",hp:27,power:5,xp:15,gold:4,color:"#79a56a",speed:42,desc:"A scavenger with a chipped blade. Clever in a pack, reckless alone.",drops:{wood:.35,ore:.15}},
 skeleton:{name:"Roadside Skeleton",hp:42,power:7,xp:25,gold:8,color:"#d1c6a2",speed:28,desc:"An old traveler pulled upright by a thread of necromantic force.",drops:{ore:.2,crystal:.12}},
 bandit:{name:"Roadside Bandit",hp:48,power:8,xp:27,gold:12,color:"#9b765f",speed:34,desc:"A desperate outlaw who has mistaken the Shattering's chaos for opportunity.",drops:{hide:.3,ore:.2}}
};
const NPCS = [
 {id:"mira",name:"Mira Ashwillow",x:7.5,y:8.2,icon:"M",role:"Herbalist",desc:"A roadwise herbalist who has kept a small camp alive since the first strange lights appeared.",lines:["The trees have been whispering in a voice I don't recognize.","Find three Moonleaf herbs and one Embercap. I can make you a healing draught.","If you hear your own voice calling from the trees, do not answer it."]},
 {id:"brom",name:"Brom Stonevein",x:13.8,y:11.5,icon:"B",role:"Smith",desc:"A dwarf smith traveling with a handcart and a stubborn old mule.",lines:["Iron still bends to honest work. The world may be cracking, but a good blade is a good blade.","Bring me ore and heartwood and I can show you the basics of forging.","The old crown-mark is older than the kingdom. Older than the roads, perhaps."]},
 {id:"elder",name:"Elder Cael",x:26.8,y:7.5,icon:"C",role:"Lorekeeper",desc:"A keeper of records who remembers stories that official histories quietly omit.",lines:["The Shattering did not begin with an army. It began with a door.","Somewhere beyond the Veil, another version of this world is still burning.","The Hollow Sovereign believes control is mercy. That is what makes him dangerous."]}
];
const QUESTS = [
 {id:"firstSteps",name:"A Light in the Trees",kind:"main",desc:"Speak with Mira Ashwillow at the roadside camp. She has seen strange lights among the roots.",objective:"Speak with Mira at the camp",reward:{xp:35,gold:10},status:"active"},
 {id:"moonleaf",name:"The Herbalist's Request",kind:"side",desc:"Gather 3 Moonleaf and 1 Embercap Mushroom for Mira. She can prepare a healing draught for your journey.",objective:"Collect 3 Moonleaf and 1 Embercap",requirements:{herb:3,mushroom:1},reward:{xp:55,gold:18,items:{potion:1}},status:"locked"},
 {id:"road",name:"The Broken Road",kind:"side",desc:"Defeat 3 hostile creatures near the old road to make travel safer.",objective:"Defeat 3 enemies near the road",requirements:{kills:3},reward:{xp:70,gold:25,items:{ore:1}},status:"locked"},
 {id:"echo",name:"An Echo Without a Face",kind:"main",desc:"Find the cracked standing stone east of camp and examine the strange mark.",objective:"Inspect the standing stone",reward:{xp:80,gold:30,items:{crystal:1}},status:"locked"}
];
const LORE = [
 {title:"The Shattering",text:"Seventeen years ago, the sky above the old capital split into a web of pale fire. The official account blames a rebel sorcerer. Older records describe a failed attempt to open a door between worlds. Since then, roads sometimes lead to places that should not exist."},
 {title:"The Hollow Sovereign",text:"A name spoken in frightened whispers. He is said to command the dead and wear a crown made from black glass. The oldest witnesses claim his voice sounds like someone you once knew. The truth is worse: he may be a hero from another version of your world."},
 {title:"The Heart of the Veil",text:"A relic capable of thinning the boundary between dimensions. The Heart does not create power; it magnifies the desire of whoever holds it. In the wrong hands, a wish to prevent catastrophe can become a plan to control every living thing."},
 {title:"The Question",text:"Can you save the world without becoming the monster you set out to destroy? The answer will depend on what you learn, whom you help, and what you are willing to sacrifice."}
];
let game = null, activeTab="character", keys={}, moveTouch={x:0,y:0}, lastTime=0, toastTimer=null, soundOn=false, audioCtx=null;
function newGame(name,race,klass){
 const r=RACES[race], c=CLASSES[klass];
 return {name:name||"Wayfarer",race,klass,level:1,xp:0,nextXp:100,gold:25,x:5.5,y:10.5,face:1,health:100+r.stats.health+c.stats.health,mana:40+r.stats.mana+c.stats.mana,stamina:100+r.stats.stamina+c.stats.stamina,maxHealth:100+r.stats.health+c.stats.health,maxMana:40+r.stats.mana+c.stats.mana,maxStamina:100+r.stats.stamina+c.stats.stamina,power:8+r.stats.power+c.stats.power,inventory:{herb:2,mushroom:1,wood:2,ore:1},equipment:{weapon:null,armor:null,accessory:null},kills:0,day:1,minutes:480,weather:"Clear",region:"Whisperwood Outskirts",unlocked:{},completed:[],activeQuest:"firstSteps",seenLore:[],messages:[],enemies:[],worldSeed:7321,storyFlags:{miraMet:false,stoneSeen:false,sovereignHint:0},cooldowns:{attack:0,spell:0,dodge:0},invulnerable:0};
}
function saveGame(){if(!game)return;try{localStorage.setItem("eldervaleSave",JSON.stringify(game));showToast("Adventure saved in this browser.");}catch(e){showToast("Save failed. Your browser may block local storage.");}}
function loadGame(){try{const s=localStorage.getItem("eldervaleSave");if(s){game=JSON.parse(s);game.enemies=game.enemies||[];return true;}}catch(e){}return false;}
function showToast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2400);}
function say(text){$("dialogueText").textContent=text;}
function addItem(id,n=1){game.inventory[id]=(game.inventory[id]||0)+n;if(game.inventory[id]<=0)delete game.inventory[id];}
function countItem(id){return game.inventory[id]||0;}
function itemName(id){return ITEMS[id]?.name||id;}
function totalPower(){return game.power+(game.equipment.weapon?ITEMS[game.equipment.weapon]?.power||0:0)+(game.equipment.accessory?ITEMS[game.equipment.accessory]?.power||0:0);}
function totalHealth(){return game.maxHealth+(game.equipment.armor?ITEMS[game.equipment.armor]?.health||0:0);}
function totalMana(){return game.maxMana+(game.equipment.weapon?ITEMS[game.equipment.weapon]?.mana||0:0)+(game.equipment.accessory?ITEMS[game.equipment.accessory]?.mana||0:0);}
function drawCreationOptions(){
 $("raceSelect").innerHTML=Object.keys(RACES).map(x=>`<option>${x}</option>`).join("");
 $("classSelect").innerHTML=["Tank","Wizard","Knight","Berserker","Ranger","Spellblade"].map(x=>`<option>${x}</option>`).join("");
 $("raceSelect").value="Human";$("classSelect").value="Spellblade";updateCreationDescription();
 $("raceSelect").addEventListener("change",updateCreationDescription);$("classSelect").addEventListener("change",updateCreationDescription);
}
function updateCreationDescription(){const r=RACES[$("raceSelect").value],c=CLASSES[$("classSelect").value];$("creationDescription").innerHTML=`<b>${$("raceSelect").value}:</b> ${r.desc}<br><span class="tag">${r.passive}</span><br><b>${$("classSelect").value} — ${c.skill}:</b> ${c.desc}<br><i>${c.skillDesc}</i>`;}
function begin(){game=newGame($("nameInput").value.trim()||"Wayfarer",$("raceSelect").value,$("classSelect").value);game.enemies=seedEnemies();$("creationModal").classList.remove("visible");say("The campfire crackles. Mira Ashwillow watches the tree line, where a blue light pulses between the roots. Speak to her to begin your first quest.");renderAll();startLoop();saveSilent();}
function saveSilent(){try{localStorage.setItem("eldervaleSave",JSON.stringify(game));}catch(e){}}
function seedEnemies(){return [
 {type:"wolf",x:18.5,y:12.2,hp:34,maxHp:34,alive:true,aggro:false,respawn:0},
 {type:"goblin",x:22.3,y:16.2,hp:27,maxHp:27,alive:true,aggro:false,respawn:0},
 {type:"skeleton",x:30.5,y:14.5,hp:42,maxHp:42,alive:true,aggro:false,respawn:0},
 {type:"bandit",x:34.5,y:21.5,hp:48,maxHp:48,alive:true,aggro:false,respawn:0},
 {type:"wolf",x:15.5,y:23.2,hp:34,maxHp:34,alive:true,aggro:false,respawn:0}
];}
function terrain(tx,ty){
 if(tx<0||ty<0||tx>=WORLD_W||ty>=WORLD_H)return "wall";
 const v=(Math.sin(tx*12.9898+ty*78.233)*43758.5453)%1, n=Math.abs(v);
 if((tx===0||ty===0||tx===WORLD_W-1||ty===WORLD_H-1))return "wall";
 if((tx>25&&tx<31&&ty>19&&ty<26))return "water";
 if((tx===11&&ty>4&&ty<8)||(tx===12&&ty===6)||(tx===27&&ty===6)||(tx===28&&ty===6))return "stone";
 if((tx===7&&ty===8)||(tx===8&&ty===8)||(tx===13&&ty===11)||(tx===14&&ty===11)||(tx===26&&ty===7)||(tx===27&&ty===7))return "path";
 if(n>.90)return "flower";
 if(n>.78)return "bush";
 if(n>.68)return "tree";
 if(ty>17&&n>.57)return "moss";
 return "grass";
}
function blocked(x,y){const t=terrain(Math.floor(x),Math.floor(y));return ["wall","water","tree","stone"].includes(t);}
function interact(){
 if(!game)return;
 let nearest=null,dist=2.0;
 for(const npc of NPCS){const d=Math.hypot(game.x-npc.x,game.y-npc.y);if(d<dist){dist=d;nearest={kind:"npc",data:npc};}}
 const landmarks=[{id:"stone",name:"Cracked Standing Stone",x:27.5,y:6.5,desc:"A narrow black crack runs through the stone. Its carved mark resembles a crown seen in a reflection."},{id:"cache",name:"Abandoned Supply Cache",x:33.5,y:10.5,desc:"Inside the rotting box you find a few useful materials."},{id:"camp",name:"Roadside Campfire",x:5.2,y:8.8,desc:"A small campfire, safe enough to rest and recover."}];
 for(const l of landmarks){const d=Math.hypot(game.x-l.x,game.y-l.y);if(d<2.0&&d<dist){dist=d;nearest={kind:"landmark",data:l};}}
 if(!nearest){showToast("Nothing close enough to interact with.");return;}
 if(nearest.kind==="npc")talk(nearest.data);
 else landmark(nearest.data);
}
function talk(npc){
 say(`${npc.name}: “${npc.lines[Math.min(2,game.storyFlags[npc.id+"Talk"]||0)]}”`);
 game.storyFlags[npc.id+"Talk"]=(game.storyFlags[npc.id+"Talk"]||0)+1;
 if(npc.id==="mira"&&!game.storyFlags.miraMet){game.storyFlags.miraMet=true;completeQuest("firstSteps");unlockQuest("moonleaf");unlockQuest("road");say("Mira: “You look capable. Gather Moonleaf and Embercap, and I will make you a draught. The road is crawling with creatures too—clear a path if you can.”");}
 else if(npc.id==="brom"){activeTab="crafting";renderAll();say("Brom: “Choose a recipe. Mind the materials. Good craft begins with knowing what you can spare.”");}
 else if(npc.id==="elder"){game.storyFlags.sovereignHint=Math.min(3,game.storyFlags.sovereignHint+1);if(!game.seenLore.includes("The Hollow Sovereign"))game.seenLore.push("The Hollow Sovereign");activeTab="lore";renderAll();say("Elder Cael: “If the voice from the other side knows your name, do not mistake familiarity for kinship.”");}
 saveSilent();
}
function landmark(l){
 if(l.id==="stone"){if(!game.storyFlags.stoneSeen){game.storyFlags.stoneSeen=true;unlockQuest("echo");say("The stone answers your touch with a vision: a ruined throne room, a crown of black glass, and a figure wearing your face. A voice says, “I will not lose this world again.”");showToast("New story clue recorded.");if(!game.seenLore.includes("The Question"))game.seenLore.push("The Question");}else say(l.desc);completeQuest("echo");}
 else if(l.id==="cache"){if(!game.storyFlags.cacheTaken){game.storyFlags.cacheTaken=true;addItem("herb",2);addItem("wood",2);game.gold+=8;say("You find 2 Moonleaf, 2 Heartwood, and 8 Crowns in the cache.");}else say("The cache is empty.");}
 else {game.health=Math.min(totalHealth(),game.health+25);game.mana=Math.min(totalMana(),game.mana+20);game.stamina=game.maxStamina;say("You rest by the fire. Your wounds ease and your breathing settles.");}
 renderAll();saveSilent();
}
function unlockQuest(id){const q=QUESTS.find(q=>q.id===id);if(q&&q.status==="locked"){q.status="active";game.unlocked[id]=true;showToast("Quest unlocked: "+q.name);}}
function completeQuest(id){const q=QUESTS.find(q=>q.id===id);if(!q||game.completed.includes(id))return;if(id!=="firstSteps"&&q.requirements){if(q.requirements.kills&&game.kills<q.requirements.kills)return;if(q.requirements.herb&&countItem("herb")<q.requirements.herb)return;if(q.requirements.mushroom&&countItem("mushroom")<q.requirements.mushroom)return;}
 q.status="complete";game.completed.push(id);game.xp+=q.reward.xp;game.gold+=q.reward.gold;if(q.reward.items)Object.entries(q.reward.items).forEach(([k,v])=>addItem(k,v));showToast(`Quest complete: ${q.name} · +${q.reward.xp} XP · +${q.reward.gold} Crowns`);checkLevel();if(id==="moonleaf")say("Mira takes the ingredients and places a healing draught in your hand. “The light in the trees is no natural fire. Find the standing stone east of here.”");if(id==="road")say("The road grows quieter. You have bought the travelers a little time.");if(id==="echo")say("The vision fades, but the words remain: “I will not lose this world again.” The journal marks a new question.");saveSilent();renderAll();}
function checkQuestProgress(){if(game.storyFlags.miraMet)completeQuest("firstSteps");if(game.storyFlags.miraMet&&countItem("herb")>=3&&countItem("mushroom")>=1)completeQuest("moonleaf");if(game.kills>=3)completeQuest("road");if(game.storyFlags.stoneSeen)completeQuest("echo");}
function checkLevel(){while(game.xp>=game.nextXp){game.xp-=game.nextXp;game.level++;game.nextXp=Math.floor(game.nextXp*1.35);game.maxHealth+=12;game.maxMana+=6;game.maxStamina+=5;game.power+=2;game.health=totalHealth();game.mana=totalMana();game.stamina=game.maxStamina;showToast(`Level up! You are now level ${game.level}. +12 Health, +6 Mana, +2 Power.`);}}
function useSkill(){if(!game||game.cooldowns.spell>0)return;const cost=game.klass==="Tank"?0:15;if(game.mana<cost){showToast("Not enough mana.");return;}game.mana-=cost;game.cooldowns.spell=2.8;const cls=CLASSES[game.klass];if(game.klass==="Tank"){game.health=Math.min(totalHealth(),game.health+8);game.stamina=Math.min(game.maxStamina,game.stamina+20);game.invulnerable=1.2;showToast("Iron Guard: you brace behind your defenses.");}else if(["Paladin","Druid"].includes(game.klass)){game.health=Math.min(totalHealth(),game.health+18);areaDamage(12,game.power+10);showToast(cls.skill+"! Vitality surges through you.");}else if(["Knight","Berserker","Battlemage","Spellblade","Juggernaut","Death Knight","Shadowblade","Warlock"].includes(game.klass)){areaDamage(1.8,game.power+10);showToast(cls.skill+"!");}else{const e=nearestEnemy(8);if(e){damageEnemy(e,game.power+13);showToast(cls.skill+" strikes "+ENEMY_TYPES[e.type].name+".");}else showToast("Your spell crackles into the empty air.");}renderAll();playTone(420,.12);saveSilent();}
function nearestEnemy(maxDist=2.1){let best=null,d0=maxDist;for(const e of game.enemies){if(!e.alive)continue;const d=Math.hypot(e.x-game.x,e.y-game.y);if(d<d0){d0=d;best=e;}}return best;}
function attack(){if(!game||game.cooldowns.attack>0)return;game.cooldowns.attack=.45;const e=nearestEnemy(2.15);if(e){damageEnemy(e,totalPower()+Math.floor(Math.random()*4));playTone(160,.07);}else{showToast("Your strike cuts through empty air.");}renderAll();saveSilent();}
function areaDamage(range,dmg){let hit=false;for(const e of game.enemies){if(e.alive&&Math.hypot(e.x-game.x,e.y-game.y)<range){damageEnemy(e,dmg);hit=true;}}if(!hit)showToast("No enemies are close enough.");}
function damageEnemy(e,dmg){e.hp-=dmg;e.aggro=true;if(e.hp<=0){e.alive=false;game.kills++;game.xp+=ENEMY_TYPES[e.type].xp;game.gold+=ENEMY_TYPES[e.type].gold;Object.entries(ENEMY_TYPES[e.type].drops).forEach(([id,chance])=>{if(Math.random()<chance)addItem(id,1);});showToast(`${ENEMY_TYPES[e.type].name} defeated · +${ENEMY_TYPES[e.type].xp} XP`);checkLevel();checkQuestProgress();}else showToast(`${ENEMY_TYPES[e.type].name}: −${dmg} health`);}
function dodge(){if(!game||game.cooldowns.dodge>0||game.stamina<18)return;game.stamina-=18;game.cooldowns.dodge=.75;game.invulnerable=.55;const dx=moveTouch.x||((keys.ArrowRight||keys.d)?1:(keys.ArrowLeft||keys.a)?-1:game.face),dy=moveTouch.y||((keys.ArrowDown||keys.s)?1:(keys.ArrowUp||keys.w)?-1:0);const nx=game.x+dx*.95,ny=game.y+dy*.95;if(!blocked(nx,game.y))game.x=nx;if(!blocked(game.x,ny))game.y=ny;playTone(260,.06);renderAll();}
function move(dt){if(!game)return;let dx=0,dy=0;if(keys.ArrowLeft||keys.a)dx--;if(keys.ArrowRight||keys.d)dx++;if(keys.ArrowUp||keys.w)dy--;if(keys.ArrowDown||keys.s)dy++;dx+=moveTouch.x;dy+=moveTouch.y;if(dx||dy){const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;const speed=game.race==="Beastkin"?3.5:3.0,nx=game.x+dx*speed*dt,ny=game.y+dy*speed*dt;if(!blocked(nx,game.y))game.x=nx;if(!blocked(game.x,ny))game.y=ny;if(dx)game.face=Math.sign(dx);}}
function updateEnemies(dt){for(const e of game.enemies){if(!e.alive)continue;const d=Math.hypot(game.x-e.x,game.y-e.y);if(d<6)e.aggro=true;if(e.aggro&&d>1.05&&d<8){const dx=(game.x-e.x)/(d||1),dy=(game.y-e.y)/(d||1),sp=ENEMY_TYPES[e.type].speed/48;e.x+=dx*sp*dt;e.y+=dy*sp*dt;}if(d<1.12&&Math.random()<dt*.85&&game.invulnerable<=0){const hit=Math.max(1,ENEMY_TYPES[e.type].power-Math.floor(game.level/3));game.health-=hit;showToast(`${ENEMY_TYPES[e.type].name} hits you for ${hit}.`);if(game.health<=0){game.health=Math.max(1,Math.floor(totalHealth()*.45));game.gold=Math.max(0,game.gold-8);game.x=5.5;game.y=10.5;game.enemies.forEach(en=>en.aggro=false);say("You awaken by the roadside campfire, battered but alive. Some Crowns were lost in the confusion.");showToast("You were rescued. Rest and prepare before returning.");}}}}
function update(dt){if(!game)return;move(dt);updateEnemies(dt);for(const k of Object.keys(game.cooldowns))game.cooldowns[k]=Math.max(0,game.cooldowns[k]-dt);game.invulnerable=Math.max(0,game.invulnerable-dt);game.minutes+=dt*2;if(game.minutes>=1440){game.minutes-=1440;game.day++;}if(game.stamina<game.maxStamina)game.stamina=Math.min(game.maxStamina,game.stamina+dt*7);if(Math.random()<dt*.0005){game.weather=["Clear","Misty","Light Rain"][Math.floor(Math.random()*3)];} }
function draw(){
 ctx.clearRect(0,0,W,H);if(!game)return;
 const camX=game.x*TILE-W/2,camY=game.y*TILE-H/2;
 ctx.fillStyle="#172820";ctx.fillRect(0,0,W,H);
 for(let ty=Math.floor(camY/TILE)-1;ty<Math.ceil((camY+H)/TILE)+1;ty++)for(let tx=Math.floor(camX/TILE)-1;tx<Math.ceil((camX+W)/TILE)+1;tx++){
 const t=terrain(tx,ty),x=tx*TILE-camX,y=ty*TILE-camY;
 const rand=Math.abs(Math.sin(tx*21.2+ty*13.8));
 ctx.fillStyle=t==="path"?"#625640":t==="water"?"#244c57":t==="stone"?"#525b56":t==="moss"?"#213d30":t==="wall"?"#11191b":t==="bush"?"#284d35":t==="flower"?"#294431":"#1c3b2b";ctx.fillRect(x,y,TILE+1,TILE+1);
 if(t==="path"){ctx.fillStyle="#8a7957";ctx.fillRect(x+rand*18,y+rand*20,3,3);ctx.fillRect(x+30,y+9,2,2);}
 if(t==="tree"){ctx.fillStyle="#112a20";ctx.beginPath();ctx.arc(x+24,y+21,18,0,Math.PI*2);ctx.fill();ctx.fillStyle="#315b3d";ctx.beginPath();ctx.arc(x+18,y+17,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#70563a";ctx.fillRect(x+21,y+28,6,18);}
 if(t==="bush"){ctx.fillStyle="#426c43";ctx.beginPath();ctx.arc(x+24,y+28,10,0,Math.PI*2);ctx.fill();}
 if(t==="flower"){ctx.fillStyle="#c6ad70";ctx.fillRect(x+14,y+17,3,3);ctx.fillStyle="#b9c2a1";ctx.fillRect(x+24,y+32,3,3);}
 if(t==="water"){ctx.strokeStyle="#4e8190";ctx.beginPath();ctx.moveTo(x+5,y+15);ctx.lineTo(x+28,y+12);ctx.stroke();}
 if(t==="stone"){ctx.fillStyle="#82887b";ctx.fillRect(x+12,y+8,24,35);ctx.fillStyle="#303b38";ctx.fillRect(x+20,y+15,3,17);ctx.fillRect(x+20,y+25,10,3);}
 }
 // Landmark hints
 for(const l of [{x:27.5,y:6.5,icon:"◆"},{x:33.5,y:10.5,icon:"■"}]){const x=l.x*TILE-camX,y=l.y*TILE-camY;ctx.fillStyle="#d8bd72";ctx.font="18px serif";ctx.fillText(l.icon,x-5,y);}
 // NPCs
 for(const n of NPCS){const x=n.x*TILE-camX,y=n.y*TILE-camY;ctx.fillStyle="#d5b36a";ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.fill();ctx.fillStyle="#26362d";ctx.fillRect(x-7,y-7,14,17);ctx.fillStyle="#f1dfb1";ctx.font="bold 11px Inter";ctx.textAlign="center";ctx.fillText(n.icon,x,y+4);ctx.fillStyle="#eee5ce";ctx.font="10px Inter";ctx.fillText(n.name,x,y-18);}
 // Enemies
 for(const e of game.enemies){if(!e.alive)continue;const x=e.x*TILE-camX,y=e.y*TILE-camY,t=ENEMY_TYPES[e.type];ctx.fillStyle=t.color;ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#171a17";ctx.fillRect(x-5,y-4,3,3);ctx.fillRect(x+3,y-4,3,3);ctx.fillStyle="#5a1f20";ctx.fillRect(x-15,y-22,30,4);ctx.fillStyle="#ce655a";ctx.fillRect(x-15,y-22,30*Math.max(0,e.hp/e.maxHp),4);}
 // Player
 const px=game.x*TILE-camX,py=game.y*TILE-camY;ctx.fillStyle=game.invulnerable>0?"#ffffffaa":"#d6bc79";ctx.beginPath();ctx.arc(px,py,13,0,Math.PI*2);ctx.fill();ctx.fillStyle="#243b37";ctx.fillRect(px-7,py-6,14,17);ctx.fillStyle="#f2e5c7";ctx.fillRect(px+(game.face>0?2:-5),py-4,3,3);ctx.fillStyle="#6c5030";ctx.fillRect(px-10,py+7,20,5);
 // lighting vignette, day/night tint
 const hour=game.minutes/60;ctx.fillStyle=hour<6||hour>19?"rgba(8,14,32,.42)":hour<8||hour>17?"rgba(193,140,72,.10)":"rgba(0,0,0,.03)";ctx.fillRect(0,0,W,H);
 const vg=ctx.createRadialGradient(W/2,H/2,100,W/2,H/2,Math.max(W,H)*.7);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.45)");ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
 drawMiniMap();
}
function drawMiniMap(){mctx.clearRect(0,0,mapCanvas.width,mapCanvas.height);const sx=mapCanvas.width/WORLD_W,sy=mapCanvas.height/WORLD_H;for(let y=0;y<WORLD_H;y++)for(let x=0;x<WORLD_W;x++){const t=terrain(x,y);mctx.fillStyle=t==="water"?"#244e5a":t==="tree"?"#10271e":t==="stone"?"#60675f":t==="path"?"#746443":t==="wall"?"#0c1314":"#294634";mctx.fillRect(x*sx,y*sy,sx+1,sy+1);}for(const n of NPCS){mctx.fillStyle="#d8b968";mctx.fillRect(n.x*sx-2,n.y*sy-2,4,4);}mctx.fillStyle="#ffdd7c";mctx.beginPath();mctx.arc(game.x*sx,game.y*sy,3.2,0,Math.PI*2);mctx.fill();mctx.strokeStyle="#f5e5ae";mctx.strokeRect(game.x*sx-4,game.y*sy-4,8,8);}
function renderHUD(){
 $("heroName").textContent=game.name;$("heroMeta").textContent=`${game.race} · ${game.klass} · Level ${game.level}`;$("portrait").textContent=RACES[game.race].icon;
 $("xpFill").style.width=`${Math.min(100,game.xp/game.nextXp*100)}%`;$("xpText").textContent=`${game.xp} / ${game.nextXp} XP`;
 const hp=Math.max(0,Math.min(100,game.health/totalHealth()*100));$("healthFill").style.width=hp+"%";$("healthText").textContent=`${Math.floor(game.health)} / ${totalHealth()}`;
 $("manaFill").style.width=Math.max(0,Math.min(100,game.mana/totalMana()*100))+"%";$("manaText").textContent=`${Math.floor(game.mana)} / ${totalMana()}`;
 $("staminaFill").style.width=Math.max(0,Math.min(100,game.stamina/game.maxStamina*100))+"%";$("staminaText").textContent=`${Math.floor(game.stamina)} / ${game.maxStamina}`;
 $("goldText").textContent=game.gold;$("powerText").textContent=totalPower();
 const h=Math.floor(game.minutes/60),m=Math.floor(game.minutes%60);$("clock").textContent=`Day ${game.day} · ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;$("weather").textContent=game.weather;
 $("regionName").textContent=game.region;$("objectiveText").textContent=currentObjective();
}
function currentObjective(){const q=QUESTS.find(q=>q.id===game.activeQuest&&q.status==="active")||QUESTS.find(q=>q.status==="active");if(!q)return "Explore, craft, and uncover the Veil";return q.objective;}
function renderAll(){if(!game)return;renderHUD();renderTab();$("quickbar").innerHTML=`<button data-quick="potion">🧪 Draught ×${countItem("potion")}</button><button data-quick="ether">✧ Ether ×${countItem("ether")}</button><button data-quick="spell">${CLASSES[game.klass].skill}</button><button data-quick="interact">Interact</button>`;}
function renderTab(){
 const p=$("menuPanel");
 if(activeTab==="character"){
 const c=CLASSES[game.klass],hybrid=c.hybrid?`<div class="list-item"><div class="item-row"><h4>Potential hybrid path: ${c.hybrid}</h4><span class="tag">Unlock later</span></div><p>${CLASSES[c.hybrid]?.desc||"A specialized path that blends the strengths of two callings."} In the expanded game, this path will unlock through training, quest milestones, and class-specific trials.</p></div>`:`<p class="muted">You have a specialized calling. More mastery branches can be added as the game expands.</p>`;
 p.innerHTML=`<h3 class="section-title">Hero overview</h3><p class="muted">${RACES[game.race].desc}</p><div class="stat-grid"><div class="stat"><b>${totalPower()}</b><small>Attack power</small></div><div class="stat"><b>${totalHealth()}</b><small>Max health</small></div><div class="stat"><b>${totalMana()}</b><small>Max mana</small></div><div class="stat"><b>${game.maxStamina}</b><small>Max stamina</small></div><div class="stat"><b>${game.kills}</b><small>Victories</small></div><div class="stat"><b>${game.gold}</b><small>Crowns</small></div></div><h4 class="subheading">CALLING: ${game.klass.toUpperCase()}</h4><div class="list-item"><h4>${c.skill}</h4><p>${c.skillDesc}</p><p class="muted">Tap SPELL to use this skill. Most skills consume 15 mana and have a short cooldown.</p></div>${hybrid}<h4 class="subheading">EQUIPPED</h4>${["weapon","armor","accessory"].map(slot=>`<div class="list-item"><div class="item-row"><h4>${slot[0].toUpperCase()+slot.slice(1)}</h4><span class="tag">${game.equipment[slot]?itemName(game.equipment[slot]):"Empty"}</span></div></div>`).join("")}<button class="gold-button" id="restBtn">Rest at Campfire</button>`;
 }else if(activeTab==="inventory"){
 const entries=Object.entries(game.inventory).filter(([,n])=>n>0);
 p.innerHTML=`<h3 class="section-title">Adventurer's bag</h3><p class="muted">Materials are used in crafting. Consumables can be used immediately. Weapons, armor, and charms can be equipped for permanent bonuses.</p>${entries.length?entries.map(([id,n])=>{const it=ITEMS[id];return `<div class="list-item"><div class="item-row"><div><h4>${it.name} <span class="rarity">${it.rarity}</span></h4><p>${it.desc}</p></div><span class="tag">×${n}</span></div><div class="item-actions">${it.type==="consumable"?`<button data-use="${id}">Use</button>`:""}${["weapon","armor","accessory"].includes(it.type)?`<button data-equip="${id}">Equip</button>`:""}<button data-sell="${id}">Sell 1 · ${Math.max(1,Math.floor(it.value*.5))}◈</button></div></div>`}).join(""):`<div class="empty">Your bag is empty. Explore the woods, defeat enemies, or craft useful gear.</div>`}<h4 class="subheading">EQUIPMENT BONUSES</h4><p class="muted">Weapon: ${game.equipment.weapon?itemName(game.equipment.weapon):"None"} · Armor: ${game.equipment.armor?itemName(game.equipment.armor):"None"} · Charm: ${game.equipment.accessory?itemName(game.equipment.accessory):"None"}</p>`;
 }else if(activeTab==="quests"){
 p.innerHTML=`<h3 class="section-title">Quest journal</h3><p class="muted">The main story follows the clues left by a mysterious figure called the Hollow Sovereign. Side quests help you learn the land, earn Crowns, and discover the truth behind the Shattering.</p>${QUESTS.map(q=>`<div class="list-item"><div class="item-row"><h4>${q.name}</h4><span class="quest-status">${q.status}</span></div><p>${q.desc}</p><p class="muted"><b>Objective:</b> ${q.objective}</p><p class="muted"><b>Reward:</b> ${q.reward.xp} XP, ${q.reward.gold} Crowns${q.reward.items?`, ${Object.entries(q.reward.items).map(([id,n])=>n+" "+itemName(id)).join(", ")}`:""}</p></div>`).join("")}<h4 class="subheading">QUEST DESIGN GUIDE</h4><p class="muted">Full release plan: multi-step main quests, branching dialogue, faction reputation, timed events, companion quests, hidden objectives, and endings shaped by choices. This prototype demonstrates the quest/reward framework.</p>`;
 }else if(activeTab==="crafting"){
 p.innerHTML=`<h3 class="section-title">Crafting & alchemy</h3><p class="muted">Gather materials from the world and enemies, then create consumables and equipment. Recipe stations are shown for world-building; recipes are craftable in this prototype from the Craft menu.</p><div class="recipe-grid">${RECIPES.map(r=>`<div class="list-item"><h4>${r.name}</h4><p>${r.desc}</p><p class="muted">Station: ${r.station}</p><div>${Object.entries(r.needs).map(([id,n])=>`<span class="tag">${itemName(id)} ×${n} (${countItem(id)})</span>`).join("")}</div><div class="item-actions"><button data-craft="${r.id}" ${Object.entries(r.needs).some(([id,n])=>countItem(id)<n)?"disabled":""}>Craft</button></div></div>`).join("")}</div><h4 class="subheading">CRAFTING DISCIPLINES</h4><p class="muted"><b>Alchemy:</b> potions, tonics, resistance draughts. <b>Smithing:</b> swords, axes, shields, armor. <b>Leatherworking:</b> light armor and bags. <b>Woodworking:</b> bows, staves, camp tools. <b>Runecraft:</b> socketed charms and magical upgrades. Future recipes can add quality grades, discoveries, and station bonuses.</p>`;
 }else{
 p.innerHTML=`<h3 class="section-title">Field journal & lore</h3><p class="muted">Fragments of the world's history. Some entries are known from the beginning; others are discovered through conversations and landmarks.</p>${LORE.filter(l=>l.title!=="The Hollow Sovereign"||game.seenLore.includes(l.title)||game.storyFlags.sovereignHint>0).map(l=>`<div class="list-item"><h4>${l.title}</h4><p>${l.text}</p></div>`).join("")}<h4 class="subheading">THE HOLLOW SOVEREIGN</h4><p class="muted">The antagonist is an alternate-dimensional version of the player: once a hero, now a necromancer seeking to use the Heart of the Veil to merge worlds under his control. His race, silhouette, dialogue, and combat style can mirror the player's choices. The planned endings are: destroy the Heart, take the Sovereign's place, or redeem him by uncovering enough truths and completing key side quests.</p><h4 class="subheading">WORLD NOTES</h4><p class="muted">Planned regions: Whisperwood, Hearthglen Village, Frostmere Heights, Sunken Archive, Ashen March, the Veilscar, and the Shattered Capital. Each region will have its own landmarks, weather, enemy families, quest chains, resources, and music identity.</p>`;
 }
 p.querySelectorAll("[data-use]").forEach(b=>b.addEventListener("click",()=>useItem(b.dataset.use)));
 p.querySelectorAll("[data-equip]").forEach(b=>b.addEventListener("click",()=>equipItem(b.dataset.equip)));
 p.querySelectorAll("[data-sell]").forEach(b=>b.addEventListener("click",()=>sellItem(b.dataset.sell)));
 p.querySelectorAll("[data-craft]").forEach(b=>b.addEventListener("click",()=>craft(b.dataset.craft)));
 const rest=$("restBtn");if(rest)rest.addEventListener("click",()=>{game.health=totalHealth();game.mana=totalMana();game.stamina=game.maxStamina;game.minutes=(game.minutes+360)%1440;showToast("You rested. Health, mana, and stamina restored.");renderAll();saveSilent();});
}
function useItem(id){if(countItem(id)<=0)return;if(id==="potion"){game.health=Math.min(totalHealth(),game.health+35);showToast("Healing draught restores up to 35 health.");}else if(id==="ether"){game.mana=Math.min(totalMana(),game.mana+25);showToast("Lesser Ether restores up to 25 mana.");}else{showToast("That item cannot be used directly.");return;}addItem(id,-1);renderAll();saveSilent();}
function equipItem(id){const it=ITEMS[id];if(!it)return;const slot=it.type==="weapon"?"weapon":it.type==="armor"?"armor":it.type==="accessory"?"accessory":null;if(!slot)return;game.equipment[slot]=id;showToast(`${it.name} equipped.`);renderAll();saveSilent();}
function sellItem(id){if(countItem(id)<=0)return;const it=ITEMS[id];addItem(id,-1);game.gold+=Math.max(1,Math.floor(it.value*.5));showToast(`Sold ${it.name}.`);renderAll();saveSilent();}
function craft(id){const r=RECIPES.find(r=>r.id===id);if(!r)return;if(Object.entries(r.needs).some(([k,n])=>countItem(k)<n)){showToast("You do not have the required materials.");return;}Object.entries(r.needs).forEach(([k,n])=>addItem(k,-n));Object.entries(r.gives).forEach(([k,n])=>addItem(k,n));showToast(`Crafted ${r.name}.`);renderAll();checkQuestProgress();saveSilent();playTone(550,.09);}
function playTone(freq,duration){if(!soundOn)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="triangle";o.frequency.value=freq;g.gain.setValueAtTime(.035,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}catch(e){}}
function loop(t){if(!game)return;const dt=Math.min(.05,(t-lastTime)/1000||0);lastTime=t;update(dt);draw();renderHUD();requestAnimationFrame(loop);}
function startLoop(){lastTime=performance.now();requestAnimationFrame(loop);}
function setupInputs(){
 window.addEventListener("keydown",e=>{keys[e.key]=true;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();if(e.repeat)return;if(e.key===" "||e.key==="j")attack();if(e.key==="q"||e.key==="Q")useSkill();if(e.key==="e"||e.key==="E")interact();if(e.key==="Shift")dodge();});
 window.addEventListener("keyup",e=>{keys[e.key]=false;});
 document.querySelectorAll("[data-move]").forEach(b=>{const dir=b.dataset.move;const vec={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};const on=e=>{e.preventDefault();moveTouch={x:vec[dir][0],y:vec[dir][1]};};const off=e=>{e.preventDefault();if(moveTouch.x===vec[dir][0]&&moveTouch.y===vec[dir][1])moveTouch={x:0,y:0};};b.addEventListener("pointerdown",on);["pointerup","pointercancel","pointerleave"].forEach(ev=>b.addEventListener(ev,off));});
 $("attackBtn").addEventListener("click",attack);$("spellBtn").addEventListener("click",useSkill);$("dodgeBtn").addEventListener("click",dodge);$("interactBtn").addEventListener("click",interact);
 $("quickbar").addEventListener("click",e=>{const b=e.target.closest("[data-quick]");if(!b)return;const q=b.dataset.quick;if(q==="potion")useItem("potion");else if(q==="ether")useItem("ether");else if(q==="spell")useSkill();else interact();});
 document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{activeTab=b.dataset.tab;document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));renderTab();}));
 $("saveBtn").addEventListener("click",saveGame);$("resetBtn").addEventListener("click",()=>{if(confirm("Start a new adventure? This replaces the saved adventure in this browser.")){localStorage.removeItem("eldervaleSave");$("creationModal").classList.add("visible");}});
 $("soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("soundToggle").textContent=soundOn?"♫ On":"♫";if(soundOn)playTone(660,.12);});
 $("dialogueContinue").addEventListener("click",()=>say("The road bends east toward an old standing stone. Gather what you can, learn the rhythm of combat, and remember: every choice leaves a mark."));
 $("beginBtn").addEventListener("click",begin);$("closeModal").addEventListener("click",()=>$("modal").classList.remove("visible"));
}
function boot(){drawCreationOptions();setupInputs();if(loadGame()){ $("creationModal").classList.remove("visible");renderAll();say("Welcome back, "+game.name+". Your adventure was restored from this browser's local save.");startLoop();}else{game=newGame("Wayfarer","Human","Spellblade");game.enemies=seedEnemies();renderAll();draw();}}
boot();
})();
