"use strict";

//===============================================================
// DEPENDENCIES
//===============================================================

// need the map to determine randomized coordinates to place the Zombies
var Map = require("./map");


//===============================================================
// CONSTRUCTOR
//===============================================================

var Zombie = function( image, location, health, physicalAttackStrength, defenseStrength ) {

    // PROPERTIES
    // these names are not set in stone, they can be refactored, and simple error checking was applied, making sure something useful is passed in

    // image file, likely a default file that we'll use for all zombies'
    this.image = typeof image !== "undefined" ? image : "NEED A DEFAULT IMAGE";

    // object of x/y coordinates, see below for the move method, to be either randomly generated or specifically placed, currently just placeholders
    this.location = typeof location !== "undefined" ? location : { x: 0, y: 0 };

    // health points, to be depleted when Zombie is attacked, regenerated with time if not killed
    this.health = typeof health !== "undefined" ? health : 100;

    // damage inflicted with each phyiscal attack against a player/NPC, currently 4 undefended attacks should kill a character at full health
    this.physicalAttackStrength = typeof physicalAttackStrength !== "undefined" ? physicalAttackStrength : 25;

    // if Zombie defends itself, amount by which Player's attack strength/damage is reduced
    // no corresponding method yet implemented
    this.defenseStrength = typeof defenseStrength !== "undefined" ? defenseStrength : 10;


    // METHODS

    // player.physicalAttack( enemy );

    // direction is an object of x/y coordinates
    // up = { x: 0, y: 1 },
    // down = { x: 0, y: -1 }
    // left = { x: -1, y: 0 }
    // right = { x: 1, y: 0 }
    Zombie.prototype.move = function( direction ) {
        this.location.x += direction.x;
        this.location.y += direction.y;
    };

    Zombie.prototype.physicalAttack = function( opponent ) {
        opponent.health -= this.physicalAttackStrength;
    };

};


//===============================================================
// EXPORTS
//===============================================================

module.exports = Zombie;