# Eldervale: The Shattered Crown
**A mobile-first fantasy RPG prototype for GitHub Pages**

## Included in this project
- Character creation: Human, Elf, Orc, Dwarf, Dark Elf, Beastkin.
- Starting classes: Tank, Wizard, Knight, Berserker, Ranger, Spellblade.
- Data for hybrid/specialized paths: Battlemage, Warlock, Paladin, Juggernaut, Death Knight, Shadowblade, Druid, Warden.
- Canvas-rendered top-down exploration, a persistent minimap, touch movement and action controls, keyboard support.
- Basic melee combat, class skills, enemies with simple pursuit behavior, enemy drops, XP, levels, gold, equipment, consumables, and browser-local saves.
- NPC dialogue, quest journal, quest rewards, a story clue, lore journal, and a small explorable region.
- Crafting recipes for alchemy, smithing, leatherworking, and arcane gear.
- Time-of-day tint, basic weather labels, and optional synthesized sound effects.
- Original simple canvas graphics; no third-party game assets are required.

## Run locally
Open `index.html` in a modern browser. Some browsers restrict storage on local files; hosting with GitHub Pages is recommended.

## Publish with GitHub Pages (iPad-friendly)
1. Open your repository in GitHub.
2. Upload **all three files**: `index.html`, `style.css`, and `game.js` (you may also upload this README).
3. Commit the changes.
4. Open **Settings → Pages**.
5. Under Build and deployment, choose **Deploy from a branch**; choose your main branch and `/ (root)`, then Save.
6. Wait for the Pages URL to appear. Open it in Safari and rotate to landscape for a better play area.
7. If you already have an `index.html`, replace the contents of that file instead of creating a second file with the same name.

## Controls
- **Move:** on-screen arrows or WASD / arrow keys
- **Attack:** ATTACK button or Space / J
- **Class skill:** SPELL button or Q
- **Interact:** INTERACT button or E
- **Dodge:** DODGE button or Shift
- **Menus:** Hero, Bag, Quests, Craft, Journal
- **Save:** Save now button; the game also autosaves progress to localStorage after important actions

## First quest walkthrough
1. Enter the game and walk to Mira Ashwillow at the camp (gold NPC marker).
2. Press **INTERACT** when near her to start the first story step and unlock side quests.
3. Gather materials from enemies and the supply cache. Moonleaf and Embercap can be used for crafting.
4. Attack enemies near the road. Use your class skill when several enemies are close or when a ranged attack is useful.
5. Walk to the black standing stone east of camp and press INTERACT to reveal a story vision.
6. Open Craft to make a healing draught, Ether, a sword, armor, or a staff when you have enough materials.

## Design guide and full-game feature plan

### Core premise
A mysterious necromancer known as **the Hollow Sovereign** is an alternate-dimensional version of the player. In his own world, a catastrophe called the Shattering destroyed everything he loved. He believes that controlling the Heart of the Veil and merging dimensions is the only way to prevent another disaster. The player gradually learns that his desire to protect the world has become a desire to control it.

Central question: **Can you save the world without becoming the monster you set out to destroy?**

### Intended full-game scope
The long-term target is a roughly 20-hour campaign, built through incremental releases rather than a single giant code drop. This download is the playable foundation, not yet a polished 20-hour game. It contains working examples of the key systems and data structures so future content can be added without rewriting the entire game.

### World and regions
Planned interconnected regions:
1. **Whisperwood Outskirts** — introductory forest, camp, gathering, first combat.
2. **Hearthglen Village** — shops, guild board, trainers, companions, village side quests.
3. **Frostmere Heights** — snowfields, dwarven ruins, cold-weather gear, mountain passes.
4. **Sunken Archive** — flooded libraries, puzzles, lost history of the Shattering.
5. **Ashen March** — haunted battlegrounds, undead, faction choices.
6. **The Veilscar** — unstable terrain where alternate-world fragments overlap.
7. **The Shattered Capital** — endgame city, the Hollow Sovereign, Heart of the Veil.

Each region should include a distinct color palette, music and ambience, enemies, gatherables, landmarks, NPCs, quest chains, optional dungeons, and a region boss.

### Races and their gameplay identities
- **Human:** adaptable; small XP bonus and balanced attributes.
- **Elf:** strong mana and precision; lower resilience.
- **Orc:** high health and attack power; less mana.
- **Dwarf:** durability and crafting affinity.
- **Dark Elf:** arcane aptitude and twilight lore.
- **Beastkin:** stamina, mobility, and wilderness bonuses.

Race should affect starting stats, selected dialogue, some faction reactions, and the visual form of the Hollow Sovereign in the full release.

### Class system and hybrid paths
Starting classes:
- **Tank:** protection, mitigation, stamina.
- **Wizard:** ranged arcane damage and mana management.
- **Knight:** balanced martial combat and control.
- **Berserker:** high damage and aggressive stamina use.
- **Ranger:** ranged pressure, scouting, and tracking.
- **Spellblade:** melee and magic hybrid.

Planned advanced paths:
- **Battlemage** (Knight/Wizard): arcane melee and weapon enchantments.
- **Warlock** (Wizard/forbidden pact): curses, drains, shadow damage.
- **Paladin** (Knight/light magic): defense, healing, radiant attacks.
- **Juggernaut** (Tank/Berserker): immense durability and area control.
- **Death Knight** (Berserker/necromancy): grave magic and life drain.
- **Shadowblade** (Ranger/Spellblade): mobility, stealth, critical strikes.
- **Druid** (Wizard/nature): healing, roots, and nature magic.
- **Warden** (Ranger/Tank): ranged combat and protective nature magic.

In a full progression system, players would unlock a hybrid by investing skill points in two parent class trees, completing a trainer trial, and meeting a level requirement. Advanced paths should be optional, not mandatory.

### Progression and combat
- XP from quests, exploration discoveries, crafting milestones, and combat.
- Level-ups increase health, mana, stamina, and power; later releases should add spendable skill points and talent trees.
- Combat goals: readable wind-up animations, dodge windows, stagger, status effects, armor/resistances, boss phases, threat/aggro, and class-specific skill interactions.
- Planned statuses: burn, poison, bleed, frost, curse, stun, warded.
- Planned enemy AI: patrol, investigate sound, pursue, retreat, call allies, guard territory, and boss phase logic.

### Enemies
Prototype enemies:
- **Gloam Wolf:** fast predator; may drop Wolf Pelt.
- **Briar Goblin:** scavenger; may drop Heartwood or Iron Ore.
- **Roadside Skeleton:** slow undead; chance to drop Veil Crystal.
- **Roadside Bandit:** tougher humanoid foe with more Crowns.

Future roster: cave spiders, wraiths, bog trolls, mimic chests, corrupted treants, golems, frost hounds, cultists, revenants, drakes, and region bosses. Enemy descriptions, drops, weaknesses, behaviors, and lore should be exposed in a bestiary.

### Economy, loot, and equipment
- Currency: Crowns.
- Loot tiers planned: Common, Uncommon, Rare, Epic, Legendary, Mythic.
- Equipment slots planned: main hand, off hand, head, chest, hands, legs, boots, accessory, relic.
- Gear can add attributes, resistances, skill modifiers, set bonuses, and cosmetic variations.
- Shops should have buy/sell prices and restock cycles. NPC merchants and quest rewards should form a useful economy without forcing grinding.

### Crafting systems
Crafting should be a real progression path with discovery, stations, recipes, quality, and specializations:
- **Alchemy:** healing/mana potions, resistance tonics, poisons, bombs.
- **Smithing:** swords, axes, hammers, shields, heavy armor, repairs.
- **Leatherworking:** light armor, bags, ranger gear, straps.
- **Woodworking:** bows, staves, arrows, camp tools.
- **Runecraft:** charms, enchantments, socketed runes, Veil artifacts.
- **Cooking:** meals that grant temporary health, stamina, or exploration buffs.
- **Campcraft:** tents, campfires, traps, travel upgrades.

Each recipe should describe its purpose, ingredients, station, skill requirement, output, and quality possibilities. Rare recipes should come from exploration, faction rewards, trainers, and bosses. This prototype includes five example recipes and ingredient requirements.

### NPCs, side quests, guilds, and companions
- NPCs should have a distinct name, role, portrait, schedule, disposition, history, and dialogue branches.
- Side quests should have multiple approaches and meaningful rewards, not only fetch tasks.
- Planned groups: Wayfarers' Guild, Hearthglen Smiths, Veil Scholars, Ashen Watch, and the Lantern Covenant.
- Companion candidates should have personal quests and opinions about the Hollow Sovereign. Their loyalty can influence the final act.
- Future NPC schedule: wake, work, socialize, sleep; weather and story events may change routines.

### Main story and possible endings
The story should unfold through clues rather than a full exposition dump:
1. **A Light in the Trees:** strange lights, first camp, first contact.
2. **The Broken Road:** local threats reveal the world is changing.
3. **An Echo Without a Face:** standing stone shows the player a mirror-world vision.
4. **Records Beneath the Village:** discover contradictory accounts of the Shattering.
5. **A Crown of Black Glass:** learn the Sovereign's identity is tied to the player.
6. **The Heart's Bargain:** the Heart offers a shortcut at a moral cost.
7. **The Shattered Capital:** final confrontation, with outcomes based on quests and decisions.

Planned endings:
- **Break the Heart:** destroy the Heart of the Veil and prevent forced merging.
- **Take the Crown:** replace the Hollow Sovereign and control the boundary yourself.
- **Redeem the Other Self:** possible only after collecting key records, completing companion quests, and choosing restraint at critical moments.

### Audio and presentation
The current project uses original procedural shapes and optional synthesized tones so it runs without external assets. For a polished release, add original or properly licensed ambient forest loops, wind, rain, footsteps, weapon swings, spell impacts, NPC themes, and region music. Add volume sliders and mute controls. Avoid copying commercial game assets or audio.

### Mobile-first design requirements
- Landscape recommended; touch controls remain available.
- Large buttons, responsive layout, high-contrast meters, simple tabs, always-visible minimap.
- Add pause menu, remappable controls, subtitles, colorblind-friendly status icons, reduced screen shake, and adjustable UI scale in later releases.
- Test on Safari iPad and Android browsers after every update.

## Important technical note
This prototype is a single-page JavaScript canvas game. It does not require a server, build step, external library, or API. Local saves are stored in the current browser's `localStorage`; clearing browser data will erase the save. A more advanced release can migrate to Phaser 3, split the game into modules, and use proper sprite sheets and audio files.
