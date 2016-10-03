// Not sure if a "Place" should be the constructor for both a home base and a "place" or if they should be separate, currently included the same notes for both


// Properties
// name: string
// picture: image file
// location: x/y coordinates = location on the map
// type: Home base, Weapons supply store, Medical supply store, Food supply store, Hardware store (for engineering items), to be determined randomly
// numberOfZombies: 1-3, randomly determined
// numberOfNPC: undetermined, randomly generated?
// mapIcon: need an icon to display on the map, perhaps depends on health of location (healthy, damaged, destroyed)
// health: integer = 100, if Home base
// food: integer = 10 (-3 food each day, so need to replenish), if Home base, perhaps set a maxFood since food supply can’t be infinite
// medicine: integer = 3, if Home base, also consider maxMedicine
// defense: integer = 5, if Home base, also consider maxDefense
// inventory: [ ] = array of items available at location depending on type of location
// Methods
// replenishFood( num )
// depleteFood (num)
// repairDefenses()
// buildDefenses()
// repairBase()
// setNumberOfZombies(): randomly generates a number of zombies at the location, from 1 to 3, when the location is created at the beginning of the game, or could adjust throughout the game
// setNumberOfNPC(): either determine at beginning of game or NPC move throughout the game on their own and enter locations periodically
// Etc. We’ll need methods for each type of interaction
// Scenarios / Other
// Location of Home Base must always be randomly assigned for each game, the location is just the x/y coordinates and or gMaps geocodes. A list of potential Places should be predetermined and randomly selected for each game.
// Location of Home Base is only known by the owner. Other Player(s), Zombies, and NPCs, can only find the Home Bases and Places through exploration. Once a Home Base or Place has been discovered, then it permanently displays on the Map/Mini-Map
// If health reaches 0:
// Base is overrun and the game ends/resets
// Base is overrun, but the player can take damage while attacking intruders. If intruders are defeated, player is given a chance to repair base damage.
// If another player attacks base and kills player, the attacker takes ownership of base, added to their list of bases.
// Other players, zombies, and enemy NPCs will periodically attack the home base. Owner player must defend the base in order to survive. If the base has enough defense(s), enemies can be defeated on their own. However, each attack on the base reduces defenses based on the attacker(s) strength. If the defense is reduced to 0, the base health will be reduced with each attack.