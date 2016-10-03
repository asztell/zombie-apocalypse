"use strict";

//===============================================================
// DEPENDENCIES
//===============================================================

// nothing yet


//===============================================================
// CONSTRUCTOR
//===============================================================

// size is an object of { x: ??, y: ?? } representing the number of "tiles" that are in the map, on each axis
var Map = function( size ) {


    // PROPERTIES
    // these names are not set in stone, they can be refactored, and simple error checking was applied, making sure something useful is passed in

    // sets up the possible x/y coordinates
    this.x_min = 0;
    this.x_max = size.x;
    this.y_min = 0;
    this.y_max = size.y;

    // predefined possible locations for home bases, these need to be determined, and then the homeBase locations needs to be randomly selected for each game
    this.homeBaseLocations = [];

    // predefined possible locations for all other places other than home bases, these need to be determined, can be static for each game or randonly determined for each game
    this.placeLocations = [];


    // METHODS

    // characterLocation is an object { x: ??, y: ?? }
    Map.prototype.inBounds = function( characterLocation ) {
        var cX = characterLocation.x;
        var cY = characterLocation.y;

        var xIsOk = ( cX >= this.x_min && cX <= this.x_max );
        var yIsOk = ( cY >= this.y_min && cY <= this.y_max );

        return ( xIsOk && yIsOK );
    };

    Map.prototype.displayHomeBases = function() {
        // use the homeBaseLocations array and display homeBases on the map
    };

    Map.prototype.displayPlaces = function() {
        // use the placeLocations array and display places on the map
        // maybe this is run each turn because as Zombies destroy locations the map updates with each turn
    };

    Map.prototype.displayMiniMap = function() {
        // need to display a mini-map of the total map on the screen, could be it's own object
    };
};


//===============================================================
// EXPORTS
//===============================================================

module.exports = Map;