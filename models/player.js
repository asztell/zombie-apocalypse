// Properties
// name: string
// picture: image file
// homeBase: Place
// currentLocation: x/y coordinates
// health: integer
// physicalStrength: integer
// weaponsSkill: integer = how good they are with ranged weapons
// communicationsSkill: integer = how well they can talk to others
// medicalSkill: integer = how good they are at healing wounds
// engineeringSkill: integer = how good they are at creating weapons based on Items
// interactionRadius: integer = distance from other players, NPCs, or Zombies, at which interaction between the characters happens
// Items: [ ] = array of items collected from different Home Bases and Places
// placesDiscovered: [ ] = array of Places and Home Bases discovered on the Map, which are then permanently displayed on the Map and Mini-Map
// Methods
// retrieveFoodFromBase()
// retrieveMedicineFromBase()
// buildBaseDefenses()
// repairBaseDefenses()
// repairBase()
// moveCharacter( direction ) = 1 move and a limited number of actions
// doAction(): need to decide what types of actions there are, like attack, trade, talk, do nothing, etc., similar to interactWithNPC
// attackEnemy()
// defendSelf()
// displayItemInventory()
// collectItem() = when entering a location, can collect whichever items are available at that location, one item at a time, and only part of the inventory with each collection/fetch
// interactWithNPC() = if Player communication skill is high enough, the NPC could become a friend and could trade items with or gain points from, or if communication skill is too low then the NPC could become an enemy, need to set a communication skill threshold for friend/enemy
// displayKnownPlaces() = display on the map all Places known from exploration, Home Base is always shown
// Scenarios / Other
// Can interact with their home base
// Can explore the map and travel to Locations on the map
// Can interact with Locations, collecting items based on the Location type
// Can interact with NPCs, potentially attack/defend from NPCs, and defend from Zombies
// In interaction zones, player can fight, interact, or do nothing, unless it is a Zombie, in which case it is always attack or defend.
// If multi-player, attack or defend is completely open
// If NPC, attack or interact/trade is up to the player, but some NPCs will be very strong, so could be deadly
