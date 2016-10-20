// new up a Phaser game
var game = new Phaser.Game( 800, 600, Phaser.AUTO, "", {
    // TODO: need to figure out how to have window size game with ~2x zoom
    // var game = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.CANVAS, "", {
    preload: preload,
    create: create,
    update: update,
    render: render
} );

var gameStartTime = Date.now();
var gameEndTime;
var gameID;

var chosenCharacter;
var player;

var gameMusic;
var zombieRoar;

var mapTileSize = 32; // pixels square
var map;
var grassLayer;
var baseLayer;
var collisionLayer;
var randomItemsLayer;
var door;
var doorEntered;
var buildingDoorRectangle;
var buildingDoor_TopLeft;
var cursors;
// var spacebar;

var healthPacks;

var zombieToKill;
var zombiesTopLeftBuilding;
var zombiesLowerLeftBuilding;
var zombiesCenterOfMap;
var zombiesByTheFirstJeep;
var zombiesBottomRightBuilding;
var zombieInteractionRadius;
var zombieChaseSpeed;
var bottomlessHole;
var bottomlessHoleRectangle;

var audio = new Audio( '/assets/audio/constance-kevin-macleod.m4a' );
// ======================================================
// PHASER FUNCTION
//
// load assets into memory
// ======================================================
function preload() {

    // put the game "stage" in the middle of the page
    // TODO: change scale to zoom in map, but still keep it full size on the screen
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    // game.scale.pageAlignVertically = true;
    // game.stage.backgroundColor = '#eee';
    // game.world.scale.x = 1.5;
    // game.world.scale.y = 1.5;
    // game.world.scale.y = 2;

    // load map and other images needed
    game.load.tilemap( "map", "assets/tilemaps/gameMap.json", null, Phaser.Tilemap.TILED_JSON );
    game.load.spritesheet( "playerAnimations", "assets/images/Character1Walk.png", 64, 64 );
    game.load.spritesheet( "zombieSpriteSheet", "assets/images/2ZombieSpriteSheet.png", 41, 36 );
    game.load.spritesheet( "healthPack", "assets/images/foodfromcts1a.png", 34, 34 );
    game.load.image( "building", "assets/images/Building.png" );
    game.load.image( "cars", "assets/images/Cars_final.png" );
    game.load.image( "food", "assets/images/foodfromcts1a.png" );
    game.load.image( "sidewalk", "assets/images/Sidewalk_dark.png" );
    game.load.image( "street", "assets/images/Street.png" );
    game.load.image( "jeep", "assets/images/wj2.png" );
    game.load.image( "player", "assets/images/player.png" );
    game.load.image( "zombie", "assets/images/zombie.png" );
    game.load.image( "dirt", "assets/images/dirt.png" );
    game.load.image( "grass", "assets/images/grass.png" );
    game.load.image( "logos", "assets/images/Logos.png" );
    game.load.image( "objects", "assets/images/Objects.png" );
    game.load.image( "cobble", "assets/images/cobbleset.png" );
    game.load.image( "trees", "assets/images/treetop.png" );
    game.load.image( "rock", "assets/images/rock.png" );
    game.load.image( "hole", "assets/images/hole.png" );
    game.load.audio( 'gameMusic', 'assets/audio/constance-kevin-macleod.m4a' );
    game.load.audio( 'zombieRoar', 'assets/audio/zombie-demon-spawn-mp3' );

    // var audio = new Audio( '/assets/audio/constance-kevin-macleod.m4a' );
    // audio.play();

    // var audio = new Audio( '/assets/audio/zombie-demon-spawn.mp3' );
    // audio.play();
}


// ======================================================
// PHASER FUNCTION
//
// create the map, player, zombies, NPCs, etc.
// ======================================================
function create() {

    game.physics.startSystem( Phaser.Physics.ARCADE );

    gameMusic = game.add.audio( 'gameMusic' );
    gameMusic.play();

    zombieRoar = game.add.audio( 'zombieRoar' );

    chosenCharacter = JSON.parse( localStorage.getItem( "character" ) );
    console.log( chosenCharacter );
    $.ajax( {
        type: "post",
        url: "game/new",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify( chosenCharacter ),
        success: function ( response ) {
            gameID = response.gameID;
        }
    } );

    // setup map images
    map = game.add.tilemap( "map" );
    map.addTilesetImage( "level1", "street" );
    map.addTilesetImage( "buildings", "building" );
    map.addTilesetImage( "cars1", "cars" );
    map.addTilesetImage( "cars2", "jeep" );
    map.addTilesetImage( "food1", "food" );
    map.addTilesetImage( "cobble", "cobble" );
    map.addTilesetImage( "player1", "player" );
    map.addTilesetImage( "side_objects", "objects" );
    map.addTilesetImage( "grass", "grass" );
    map.addTilesetImage( "logos", "logos" );
    map.addTilesetImage( "dirt", "dirt" );
    map.addTilesetImage( "trees", "trees" );
    map.addTilesetImage( "rocks", "rock" );
    map.addTilesetImage( "hole", "hole" );

    // setup layers and collision layer
    grassLayer = map.createLayer( "grass_layer" );
    baseLayer = map.createLayer( "base_layer" );
    collisionLayer = map.createLayer( "collision_layer" );
    randomItemsLayer = map.createLayer( "random_items_layer" );

    grassLayer.resizeWorld();
    map.setCollisionBetween( 0, 2000, true, collisionLayer, true );

    // can see where/what the objects are in the map json, the objects on any layer are an array of objects, can get their properties and such like any object
    buildingDoor_TopLeft = map.objects[ 'building_doors' ][ 0 ];

    // this creates a rectangle to put on the map that the player can interact with, in this case an overlap
    buildingDoorRectangle = new Phaser.Rectangle( buildingDoor_TopLeft.x, buildingDoor_TopLeft.y, buildingDoor_TopLeft.width, buildingDoor_TopLeft.height );

    bottomlessHole = map.objects[ 'other_objects' ][ 0 ];
    bottomlessHoleRectangle = new Phaser.Rectangle( bottomlessHole.x, bottomlessHole.y, bottomlessHole.width, bottomlessHole.height );


    // ======================================================
    // PLAYER CONSTRUCTOR
    // This is a Phaser sprite object extended by us with our own properties and methods
    // TODO: refactor this into its own module or elsewhere in the code to clean things up
    // ======================================================
    player = game.add.sprite( 0, 800, "playerAnimations" );
    player.frame = 18;
    // game.physics.arcade.enable( player );
    game.physics.enable( player, Phaser.Physics.ARCADE );
    player.body.collideWorldBounds = true;
    player.anchor.setTo( 0.5, 0.5 );
    game.camera.follow( player );

    // TODO: check the zombie size as well
    player.body.setSize( 18, 35, 0, 5 ); // woohoo!

    // these are the animations as the player walks around
    player.animations.add( "up", [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], 10, true );
    player.animations.add( "down", [ 18, 19, 20, 21, 22, 23, 24, 25, 26 ], 10, true );
    player.animations.add( "left", [ 9, 10, 11, 12, 13, 14, 15, 16, 17 ], 10, true );
    player.animations.add( "right", [ 27, 28, 29, 30, 31, 32, 33, 34, 35 ], 10, true );

    // these are our custom properties and methods added to the Phaser sprite object
    player.hp = player.hasOwnProperty( 'hp' ) ? logError( 'hp' ) : parseInt( chosenCharacter.hp );
    player.ap = player.hasOwnProperty( 'ap' ) ? logError( 'ap' ) : parseInt( chosenCharacter.ap );
    player.zombieKills = player.hasOwnProperty( 'zombieKills' ) ? logError( 'zombieKills' ) : 0;
    player.gameLength = player.hasOwnProperty( 'gameLength' ) ? logError( 'gameLength' ) : 10;
    player.isAlive = player.hasOwnProperty( 'isAlive' ) ? logError( 'isAlive' ) : true;
    player.weaponInventory = player.hasOwnProperty( 'weaponInventory' ) ? logError( 'weaponInventory' ) : [];
    player.itemInventory = player.hasOwnProperty( 'itemInventory' ) ? logError( 'itemInventory' ) : [];
    player.attack = player.hasOwnProperty( 'attack' ) ? logError( 'attack' ) :
        function ( opponent ) {
            opponent.hp -= player.ap;
            player.hp -= opponent.ap;
        }
    player.collectWeapon = player.hasOwnProperty( 'collectWeapon' ) ? logError( 'collectWeapon' ) :
        function ( weapon ) {
            player.weaponInventory.push( weapon );
        }
    player.collectItem = player.hasOwnProperty( 'collectItem' ) ? logError( 'collectItem' ) :
        function ( item ) {
            player.itemInventory.push( item );
        }


    // ======================================================
    // MAKE ZOMBIES
    // ======================================================
    var zombiesTopLeftBuildingTotal = 4;
    zombiesTopLeftBuilding = game.add.group();
    makeZombie( zombiesTopLeftBuilding, 2, 22, 25, 26, 27, 100, 200, 6, 7, 20, 50, 10, 20, 'x' );
    makeZombie( zombiesTopLeftBuilding, 2, 22, 27, 26, 27, 50, 75, 6, 7, 20, 50, 10, 20, 'y' );

    var zombiesLowerLeftBuildingTotal = 6;
    zombiesLowerLeftBuilding = game.add.group();
    makeZombie( zombiesLowerLeftBuilding, 3, 56, 62, 191, 197, 100, 300, 6, 7, 20, 50, 10, 20, 'x' );
    makeZombie( zombiesLowerLeftBuilding, 3, 59, 66, 191, 194, 100, 150, 6, 7, 20, 50, 10, 20, 'y' );

    var zombiesCenterOfMapTotal = 10;
    zombiesCenterOfMap = game.add.group();
    makeZombie( zombiesCenterOfMap, 5, 75, 85, 100, 115, 100, 300, 6, 7, 20, 50, 10, 20, 'x' );
    makeZombie( zombiesCenterOfMap, 5, 75, 85, 100, 115, 100, 300, 6, 7, 20, 50, 10, 20, 'y' );

    var zombiesByTheFirstJeep = 4;
    zombiesByTheFirstJeep = game.add.group();
    makeZombie( zombiesByTheFirstJeep, 2, 35, 48, 9, 11, 100, 300, 6, 7, 20, 50, 10, 20, 'x' );
    makeZombie( zombiesByTheFirstJeep, 2, 35, 48, 9, 11, 100, 300, 6, 7, 20, 50, 10, 20, 'y' );

    var zombiesBottomRightBuildingTotal = 6;
    zombiesBottomRightBuilding = game.add.group();
    makeZombie( zombiesBottomRightBuilding, 3, 138, 150, 140, 140, 100, 300, 6, 7, 20, 50, 10, 20, 'x' );
    makeZombie( zombiesBottomRightBuilding, 3, 138, 150, 140, 140, 100, 300, 6, 7, 20, 50, 10, 20, 'y' );    


    // ======================================================
    // MAKE HEALTH PACKS
    // ======================================================
    healthPacks = game.add.group();
    // sample function call to make a health pack or packs
    // makeHealthPack( healthPacks, 1, -7, 7, -7, 7, 10, 20 );  
          
    
    // ======================================================
    // KEYBOARD INPUTS
    // ======================================================    
    cursors = game.input.keyboard.createCursorKeys();
    // spacebar = game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
    // esc ...
}


// ======================================================
// PHASER FUNCTION
//
// updates with each screen cycle
// ======================================================
function update() {

    game.physics.arcade.collide( player, collisionLayer );
    game.physics.arcade.collide( player, zombiesTopLeftBuilding, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesLowerLeftBuilding, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesCenterOfMap, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesByTheFirstJeep, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesBottomRightBuilding, interactWithZombie, null, this );
    game.physics.arcade.overlap( player, healthPacks, collectHealthPack, null, this );
    game.physics.arcade.collide( zombiesTopLeftBuilding, collisionLayer );
    game.physics.arcade.collide( zombiesLowerLeftBuilding, collisionLayer );
    game.physics.arcade.collide( zombiesCenterOfMap, collisionLayer );
    game.physics.arcade.collide( zombiesByTheFirstJeep, collisionLayer );
    game.physics.arcade.collide( zombiesBottomRightBuilding, collisionLayer );
    game.physics.arcade.collide( healthPacks, collisionLayer );

    // triggered when player "enters" a building door
    if ( buildingDoorRectangle.contains( player.x + player.width / 2, player.y + player.height / 2 ) ) {
        interactWithDoor();
    }

    // triggered when player falls down hole
    if ( bottomlessHoleRectangle.contains( player.x, player.y ) ) {
        interactWithHole();
    }


    // this series handles the zombies following the player when the player gets too close    
    zombieInteractionRadius = 400;
    zombieChaseSpeed = 200;
    
    // group zombiesTopLeftBuilding
    if ( game.physics.arcade.distanceBetween( zombiesTopLeftBuilding.children[ 0 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesTopLeftBuilding.children[ 0 ], player, zombieChaseSpeed, this );
    }
    if ( game.physics.arcade.distanceBetween( zombiesTopLeftBuilding.children[ 2 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesTopLeftBuilding.children[ 2 ], player, zombieChaseSpeed, this );
    }

    // group zombiesLowerLeftBuilding
    if ( game.physics.arcade.distanceBetween( zombiesLowerLeftBuilding.children[ 0 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesLowerLeftBuilding.children[ 0 ], player, zombieChaseSpeed, this );
    }
    if ( game.physics.arcade.distanceBetween( zombiesLowerLeftBuilding.children[ 3 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesLowerLeftBuilding.children[ 3 ], player, zombieChaseSpeed, this );
    }

    // group zombiesCenterOfMap
    if ( game.physics.arcade.distanceBetween( zombiesCenterOfMap.children[ 0 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesCenterOfMap.children[ 0 ], player, zombieChaseSpeed, this );
    }
    if ( game.physics.arcade.distanceBetween( zombiesCenterOfMap.children[ 1 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesCenterOfMap.children[ 1 ], player, zombieChaseSpeed, this );
    }

    // group zombiesCenterOfMap
    if ( game.physics.arcade.distanceBetween( zombiesCenterOfMap.children[ 5 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesCenterOfMap.children[ 5 ], player, zombieChaseSpeed, this );
    }
    if ( game.physics.arcade.distanceBetween( zombiesCenterOfMap.children[ 6 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesCenterOfMap.children[ 6 ], player, zombieChaseSpeed, this );
    }

    // group zombiesByTheFirstJeep
    if ( game.physics.arcade.distanceBetween( zombiesByTheFirstJeep.children[ 0 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesByTheFirstJeep.children[ 0 ], player, zombieChaseSpeed, this );
    }
    if ( game.physics.arcade.distanceBetween( zombiesByTheFirstJeep.children[ 2 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesByTheFirstJeep.children[ 2 ], player, zombieChaseSpeed, this );
    }

    // group zombiesBottomRightBuilding
    if ( game.physics.arcade.distanceBetween( zombiesBottomRightBuilding.children[ 0 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesBottomRightBuilding.children[ 0 ], player, zombieChaseSpeed, this );
    }

    if ( game.physics.arcade.distanceBetween( zombiesBottomRightBuilding.children[ 3 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesBottomRightBuilding.children[ 3 ], player, zombieChaseSpeed, this );
    }


    // reset the player's velocity with each frame update
    player.body.velocity.setTo( 0, 0 );

    // check for an arrow key press
    // TODO: the current code doesn't allow for diagonal movement, but can be added in if we want by uncommenting the commented out lines
    var playerSpeed = 400;

    if ( cursors.up.isDown ) {
        player.body.velocity.y -= playerSpeed;
        player.animations.play( 'up' );
    } else if ( cursors.down.isDown ) {
        player.body.velocity.y += playerSpeed;
        player.animations.play( 'down' );
    } else if ( cursors.left.isDown ) {
        player.body.velocity.x -= playerSpeed;
        player.animations.play( 'left' );
    } else if ( cursors.right.isDown ) {
        player.body.velocity.x += playerSpeed;
        player.animations.play( 'right' );
    } else {
        // when player stops moving maintains last direction and frame
        player.animations.stop();
    }
}


// ======================================================
// PHASER FUNCTION
//
// this is for debugging
// ======================================================
function render() {

    var textColor = 'rgb(255, 255, 255)';

    //TODO: put the player's x/y coordinates on the screen, this same code can be used to get the player's coordinates to save to the database
    game.debug.text( 'Tile X: ' + grassLayer.getTileX( player.x ), 32, 48, textColor );
    game.debug.text( 'Tile Y: ' + grassLayer.getTileY( player.y ), 32, 64, textColor );
    game.debug.text( 'HP: ' + player.hp, 232, 48, textColor );
    game.debug.text( 'AP: ' + player.ap, 432, 48, textColor );
    game.debug.geom( buildingDoor_TopLeft, '#0fffff' );
}


// ======================================================
// SAJE GAMES FUNCTIONS
//
//
// ======================================================
function interactWithZombie( player, zombie ) {

    // zombie roar
    var audio = new Audio( '/assets/audio/zombie-demon-spawn.mp3' );
    audio.play();

    // save zombie to global so it can be accessed later
    zombieToKill = zombie;
    game.paused = true;
    $( '#modal' ).modal( 'show' );
}

// when modal is triggered, populate with current health stats for player and zombie
$( '#modal' ).on( 'shown.bs.modal', function ( e ) {

    $( '#attack-button' ).show();
    $( '#close-button' ).html( "RETREAT!" );

    $( '#modal #message' ).html( "Player HP: " + player.hp + "     " + "Zombie HP: " + zombieToKill.hp );
} );

// do a bunch of stuff each time the attack button is clicked when inside the modal
$( '#attack-button' ).on( 'click', function () {

    // play a weapon blow sound
    var audio = new Audio( '/assets/audio/weapon-blow.wav' );
    audio.play();

    // call player attack function and pass in opponent
    player.attack( zombieToKill );

    // as long as the zombie is alive keep attacking
    if ( player.hp > 0 && zombieToKill.hp > 0 ) {
        $( '#modal #message' ).html( "Player HP: " + player.hp + "     " + "Zombie HP: " + zombieToKill.hp );
    } else {

        if ( zombieToKill.hp <= 0 ) {
            // if the zombie is killed do all this
            player.zombieKills++;
            $( '#modal #message' ).html( "Player HP: " + player.hp + "     " + "Zombie HP: 0" );

            $( '#attack-button' ).hide();
            $( '#close-button' ).html( "RESUME GAME" );

            var updateObj = {
                gameID: gameID,
                ap: player.ap,
                hp: player.hp,
                zombieKills: player.zombieKills,
                timeAlive: Date.now() - gameStartTime
            }

            $.ajax( {
                type: "put",
                url: "game/update",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify( updateObj )
            } );

            console.log( zombiesTopLeftBuilding.countLiving() );
            zombieToKill.kill();
            console.log( zombiesTopLeftBuilding.countLiving() );
 
            // see function definition for more details on parameters
            // function makeHealthPack( group, howMany, startX, endX, startY, endY, hpMin, hpMax ) {
            // makeHealthPack( healthPacks, 1, 1, 7, 1, 7, 10, 20 );
            makeHealthPack( healthPacks, 1, 100, 200, 100, 200, 10, 20 );
            console.log( healthPacks );            
        }

        if ( player.hp <= 0 ) {
            //TODO: save game length(time), save zombie kills
            gameEndTime = Date.now();

            $( '#modal #message' ).html(
                "Player HP: 0" +
                "Zombie HP: " + zombieToKill.hp );

            console.log( gameStartTime );
            console.log( gameEndTime );
            console.log( "Game over..." );

            var gameObj = {
                gameID: gameID,
                ap: player.ap,
                hp: 0,
                zombieKills: player.zombieKills,
                timeAlive: gameEndTime - gameStartTime
            }

            $.ajax( {
                type: "put",
                url: "game/over",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify( gameObj ),
                success: function ( response ) {
                    window.location = "/game/stats/" + gameID;
                }
            } );

            $( '#modal' ).modal( 'toggle' );
            player.destroy();
        }
    }
} );

$( '#modal' ).on( 'hidden.bs.modal', function ( e ) {
    // this keeps the modal from popping up multiple times
    player.body.velocity.setTo( 0, 0 );
    game.paused = false;
} );

function interactWithHole() {
    // TODO: player destroy isn't working
    console.log( "You fell down the hole..." );
    player.kill();
    // then need to end the game because the collision is still triggering
}

function interactWithDoor( door ) {
    //     // var audio = new Audio( '/assets/audio/zombie-demon-spawn.mp3' );
    //     // audio.play();
    console.log( "Entered door..." );

    //     // doorEntered = door;
    //     // game.paused = true;
    //     // $( '#modal-door' ).modal( 'show' );
}

// // when modal is triggered, populate with current health stats for player and zombie
// $( '#modal-door' ).on( 'shown.bs.modal', function ( e ) {

//     $( '#collect-button' ).show();
//     $( '#close-button' ).html( "RETREAT!" );

//     $( '#modal-door #message' ).html(
//         "Player HP: " + player.hp + "\n" +
//         "Zombie name: " + zombieToKill.name + "\n" +
//         "Zombie HP: " + zombieToKill.hp );
// } );

// // do a bunch of stuff each time the attack button is clicked when inside the modal
// $( '#collect-button' ).on( 'click', function () {
//     // itemClickedOn
//     player.collectItem( itemClickedOn );

//     // if player has room in inventory, then allow them to collect item, otherwise, no
//     if ( player.hp > 0 && zombieToKill.hp > 0 ) {
//         $( '#modal #message' ).html(
//             "Player HP: " + player.hp + "\n" +
//             "Zombie name: " + zombieToKill.name + "\n" +
//             "Zombie HP: " + zombieToKill.hp );
//     } else {

//         if ( zombieToKill.hp <= 0 ) {
//             // if the zombie is killed do all this
//             player.zombieKills++;
//             $( '#modal #message' ).html(
//                 "Player HP: " + player.hp + "\n" +
//                 "Zombie name: " + zombieToKill.name + "\n" +
//                 "Zombie HP: 0" );

//             $( '#attack-button' ).hide();
//             $( '#close-button' ).html( "RESUME GAME" );
//             // var updateObj = {
//             //   gameID: gameID,
//             //   ap: player.ap,
//             //   hp: player.hp,
//             //   zombieKills: player.zombieKills,
//             //   timeAlive: Date.now() - gameStartTime
//             // }
//             // $.ajax( {
//             //     type: "put",
//             //     url: "game/update",
//             //     dataType: "json",
//             //     contentType: "application/json",
//             //     data: JSON.stringify( updateObj )
//             // } );

//             console.log(zombiesTopLeftBuilding.countLiving());
//             zombieToKill.kill();
//             console.log(zombiesTopLeftBuilding.countLiving());

//             createHealthPackOnZombieKill();
//         }

//         if ( player.hp <= 0 ) {
//             //TODO: save game length(time), save zombie kills
//             gameEndTime = Date.now();

//             $( '#modal #message' ).html(
//                 "Player HP: 0" +
//                 "Zombie name: " + zombieToKill.name + "\n" +
//                 "Zombie HP: " + zombieToKill.hp );

//             console.log( gameStartTime );
//             console.log( gameEndTime );
//             console.log( "Game over..." );

//             // var gameObj = {
//             //   gameID: gameID,
//             //   ap: player.ap,
//             //   hp: player.hp,
//             //   zombieKills: player.zombieKills,
//             //   timeAlive: gameEndTime - gameStartTime
//             // }
//             //
//             // $.ajax( {
//             //     type: "put",
//             //     url: "game/over",
//             //     dataType: "json",
//             //     contentType: "application/json",
//             //     data: JSON.stringify( gameObj ),
//             //     success: function ( response ) {
//             //       window.location = "/game/over";
//             //     }
//             // } );

//             $( '#modal' ).modal( 'toggle' );
//             player.destroy();
//         }
//     }
// });

// $( '#modal-door' ).on( 'hidden.bs.modal', function ( e ) {
//     player.body.velocity.setTo( 0, 0 );
//     game.paused = false;
// });


// make any number of zombies with a list of parameters, all parameters are required
// for a fixed position, enter equal X and equal Y coordinates for start and end, otherwise use different numbers to create bounds for random positioning; x and y are the number of tiles, which will be multiplied by the mapTileSize to determine the number of pixels
// for predetermined HP, enter the same number for min and max, using different numbers will create a random number between the two bounds
function makeZombie( group, howMany, startX, endX, startY, endY, pixelMoveMin, pixelMoveMax, moveSecondsMin, moveSecondsMax, minHP, maxHP, minAP, maxAP, moveAxis ) {

    for ( var i = 0; i < howMany; i++ ) {
        var randomX = game.rnd.integerInRange( ( startX * mapTileSize ), ( endX * mapTileSize ) );
        var randomY = game.rnd.integerInRange( ( startY * mapTileSize ), ( endY * mapTileSize ) );
        var randomMove = game.rnd.integerInRange( pixelMoveMin, pixelMoveMax );
        var randomSpeed = game.rnd.integerInRange( ( moveSecondsMin * 1000 ), ( moveSecondsMax * 1000 ) );

        // adds the zombie to the group passed in
        var zombie = group.create( randomX, randomY, 'zombieSpriteSheet' );
        zombie.frame = 2;
        zombie.scale.x = 1.2; // resize zombie, make a little bigger
        zombie.scale.y = 1.2; // resize zombie, make a little bigger

        game.physics.enable( zombie, Phaser.Physics.ARCADE );
        zombie.body.collideWorldBounds = true;
        zombie.body.immovable = true;
        zombie.anchor.setTo( 0.5, 0.5 );

        zombie.hp = zombie.hasOwnProperty( 'hp' ) ? logError( 'hp' ) : game.rnd.integerInRange( minHP, maxHP );
        zombie.ap = zombie.hasOwnProperty( 'ap' ) ? logError( 'ap' ) : game.rnd.integerInRange( minAP, maxAP );

        if ( moveAxis === 'x' ) {
            game.add.tween( zombie ).to( {
                x: zombie.x + randomMove
            }, randomSpeed, Phaser.Easing.Linear.InOut, true, 0, Number.MAX_VALUE, true );
        } else if ( moveAxis === 'y' ) {
            game.add.tween( zombie ).to( {
                y: zombie.y + randomMove
            }, randomSpeed, Phaser.Easing.Linear.InOut, true, 0, Number.MAX_VALUE, true );
        } else {
            console.error( "Axis must be either x or y ..." );
        }
    }
}

// for a fixed position, enter equal X and equal Y coordinates for start and end, otherwise use different numbers to create bounds for random positioning; x and y are the number of tiles, which will be multiplied by the mapTileSize to determine the number of pixels
// for predetermined HP, enter the same number for min and max, using different numbers will create a random number between the two bounds
// TODO: fix this, currently not work
function makeHealthPack( group, howMany, startX, endX, startY, endY, hpMin, hpMax ) {

    for ( var i = 0; i < howMany; i++ ) {
        var x = game.rnd.integerInRange( ( startX * mapTileSize ), ( endX * mapTileSize ) );
        var y = game.rnd.integerInRange( ( startY * mapTileSize ), ( endY * mapTileSize ) );

        // adds the health pack to the group passed in
        var healthPack = group.create( x, y, 'healthPack' );
        healthPack.frame = 95; //game.rnd.integerInRange( 65, 110 );
        healthPack.hp = game.rnd.integerInRange( hpMin, hpMax );
        game.physics.arcade.enable( healthPack );
        healthPack.body.enable = true;
        healthPack.body.immovable = true;
        healthPack.anchor.setTo( 0.5, 0.5 );
    }
}

function collectHealthPack( player, healthPack ) {
    player.hp += healthPack.hp;
    healthPack.destroy();
    var updateObj = {
        gameID: gameID,
        ap: player.ap,
        hp: player.hp,
        zombieKills: player.zombieKills,
        timeAlive: gameEndTime - gameStartTime
    }
    $.ajax( {
        type: "put",
        url: "game/update",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify( updateObj )
    } );
}

// logs an error if a property already exists on the player or zombie, this is to handle custom properties and functions we add
function logError( prop ) {
    console.error( prop + " already exists, please change the name to avoid conflicts with the Phaser engine!" );
}