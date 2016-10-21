// new up a Phaser game
var game = new Phaser.Game( 800, 600, Phaser.AUTO, "", {
    // TODO: need to figure out how to have window size game with ~2x zoom
    // var game = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.CANVAS, "", {
    preload: preload,
    create: create,
    update: update,
    render: render
} );

// sets the player to super strength
var demoMode = true;
var demoModeHP = 1000;
var demoModeAP = 1000;

var gameStartTime = Date.now();
var gameEndTime;
var gameID;

var chosenCharacter;
var player;
var playerHPDisplay;
var playerAPDisplay;
var playerKillsDisplay;
var playerStatsDisplayStyle;

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
var buildingMedicalDoorRectangle;
var medicalDoor;
var cursors;
// var spacebar;

var tweeningZombiesAreReleased;

var healthPacks;

var zombieToKill;
var zombiesTopLeftBuilding;
var zombiesRoadBlock;
var zombiesLowerLeftBuilding;
var zombiesCenterOfMap;
var zombiesByTheFirstJeep;
var zombiesBottomRightBuilding;
var zombiesByDirtTopRight;
var zombiesTweeningFromTopRight;
var zombiesUnderTopRightRoad;
var zombiesRightSideMiddle;
var zombiesBottomLeftQuadrant;
var zombiesBottomLeftQuadrantSecondGroup;
var zombiesTriggeredTopRight;
var zombieKillerLeftQuadrant;
var zombieInteractionRadius;
var zombieChaseSpeed;
var bottomlessHole;
var bottomlessHoleRectangleTrigger;
var zombiesEnterFromTopRightRectangleTrigger;
var zombiesEnterFromTopRight;

var audio = new Audio( '/assets/audio/constance-kevin-macleod.m4a' );
var zombieCryAudio = new Audio( '/assets/audio/zombie-demon-spawn.mp3' );
var attackSmack = new Audio( '/assets/audio/weapon-blow.wav' );

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
    // game.scale.setScreenSize( true );
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

    // gameMusic = game.add.audio( 'gameMusic' );
    // gameMusic.play();

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
    bottomlessHoleRectangleTrigger = new Phaser.Rectangle( bottomlessHole.x, bottomlessHole.y, bottomlessHole.width, bottomlessHole.height );

    // need an object on the map to trigger this
    zombiesEnterFromTopRight = map.objects[ 'other_objects' ][ 1 ];
    zombiesEnterFromTopRightRectangleTrigger = new Phaser.Rectangle( zombiesEnterFromTopRight.x, zombiesEnterFromTopRight.y, zombiesEnterFromTopRight.width, zombiesEnterFromTopRight.height );
    //TO DO: This needs to be updated to the proper door
    medicalDoor = map.objects[ 'building_doors' ][ 0 ];
    buildingMedicalDoorRectangle = new Phaser.Rectangle( medicalDoor.x, medicalDoor.y, medicalDoor.width, medicalDoor.height );

    // need an object on the map to trigger this
    // zombiesEnterFromTopRightRectangleTrigger = new Phaser.Rectangle( )


    // ======================================================
    // PLAYER CONSTRUCTOR
    // This is a Phaser sprite object extended by us with our own properties and methods
    // TODO: refactor this into its own module or elsewhere in the code to clean things up
    // ======================================================
    player = game.add.sprite( ( 2 * 32 ), ( 7 * 32 ), "playerAnimations" );
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

    if ( demoMode ) {
        player.hp = demoModeHP;
        player.ap = demoModeAP;
    }

    // ======================================================
    // MAKE ZOMBIE GROUPS
    // ======================================================
    var zombiesTopLeftBuildingTotal = 4;
    zombiesTopLeftBuilding = game.add.group();
    makeZombie( zombiesTopLeftBuilding, 1, 22, 25, 26, 27, 100, 200, 6, 7, 20, 50, 10, 20, 'x' );
    // makeZombie( zombiesTopLeftBuilding, 2, 22, 27, 26, 27, 50, 75, 6, 7, 20, 50, 10, 20, 'y' );

    var zombiesRoadBlockTotal = 20;
    zombiesRoadBlock = game.add.group();
    makeZombie( zombiesRoadBlock, 10, 70, 100, 28, 30, 300, 500, 6, 8, 50, 50, 50, 50, 'x' );
    makeZombie( zombiesRoadBlock, 10, 70, 100, 28, 30, 100, 200, 5, 6, 50, 50, 50, 50, 'y' );

    var zombiesTriggeredTopRight = 12;
    zombiesTriggeredTopRight = game.add.group();
    makeZombie( zombiesTriggeredTopRight, 6, 190, 198, 28, 32, 200, 300, 6, 8, 20, 30, 15, 20, 'x' );
    makeZombie( zombiesTriggeredTopRight, 6, 190, 198, 28, 32, 100, 150, 6, 8, 20, 30, 15, 20, 'y' );

    var zombiesLowerLeftBuildingTotal = 6;
    zombiesLowerLeftBuilding = game.add.group();
    makeZombie( zombiesLowerLeftBuilding, 3, 56, 62, 191, 197, 100, 300, 6, 7, 20, 50, 40, 50, 'x' );
    makeZombie( zombiesLowerLeftBuilding, 3, 59, 66, 191, 194, 100, 150, 6, 7, 20, 50, 40, 50, 'y' );

    var zombiesCenterOfMapTotal = 10;
    zombiesCenterOfMap = game.add.group();
    makeZombie( zombiesCenterOfMap, 5, 75, 85, 100, 115, 100, 300, 6, 7, 20, 50, 10, 20, 'x' );
    makeZombie( zombiesCenterOfMap, 5, 75, 85, 100, 115, 100, 300, 6, 7, 20, 50, 10, 20, 'y' );

    var zombiesByTheFirstJeepTotal = 4;
    zombiesByTheFirstJeep = game.add.group();
    makeZombie( zombiesByTheFirstJeep, 2, 35, 48, 9, 11, 100, 300, 6, 7, 20, 50, 10, 20, 'x' );
    makeZombie( zombiesByTheFirstJeep, 2, 35, 48, 9, 11, 100, 300, 6, 7, 20, 50, 10, 20, 'y' );

    var zombiesBottomRightBuildingTotal = 6;
    zombiesBottomRightBuilding = game.add.group();
    makeZombie( zombiesBottomRightBuilding, 3, 138, 150, 140, 140, 100, 300, 6, 7, 20, 50, 10, 20, 'x' );
    makeZombie( zombiesBottomRightBuilding, 3, 138, 150, 140, 140, 100, 300, 6, 7, 20, 50, 10, 20, 'y' );

    var zombiesTweeningFromTopRightTotal = 6;
    zombiesTweeningFromTopRight = game.add.group();
    makeZombie( zombiesTweeningFromTopRight, 3, 210, 215, 29, 31, 100, 300, 6, 7, 20, 50, 10, 20, 'x' );
    makeZombie( zombiesTweeningFromTopRight, 3, 210, 215, 29, 31, 100, 300, 6, 7, 20, 50, 10, 20, 'y' );

    var zombiesByDirtTopRightTotal = 4;
    makeZombie( zombiesByTheFirstJeep, 2, 184, 188, 11, 13, 100, 100, 3, 4, 40, 50, 20, 30, 'x' );
    makeZombie( zombiesByTheFirstJeep, 2, 184, 188, 11, 13, 100, 100, 3, 4, 40, 50, 20, 30, 'y' );

    var zombiesUnderTopRightRoadTotal = 4;
    zombiesUnderTopRightRoad = game.add.group();
    makeZombie( zombiesUnderTopRightRoad, 2, 192, 194, 37, 39, 100, 100, 5, 5, 50, 50, 50, 50, 'x' );
    makeZombie( zombiesUnderTopRightRoad, 2, 191, 194, 38, 41, 150, 150, 6, 6, 50, 50, 50, 50, 'y' );

    var zombiesRightSideMiddleTotal = 6;
    zombiesRightSideMiddle = game.add.group();
    makeZombie( zombiesRightSideMiddle, 3, 188, 194, 89, 91, 200, 200, 5, 6, 10, 20, 10, 20, 'x' );
    makeZombie( zombiesRightSideMiddle, 3, 189, 192, 90, 98, 200, 200, 5, 6, 10, 20, 10, 20, 'y' );

    var zombiesBottomLeftQuadrantTotal = 10;
    zombiesBottomLeftQuadrant = game.add.group();
    makeZombie( zombiesBottomLeftQuadrant, 5, 92, 102, 158, 162, 200, 300, 5, 7, 20, 25, 15, 20, 'x' );
    makeZombie( zombiesBottomLeftQuadrant, 5, 92, 102, 158, 162, 150, 200, 5, 7, 20, 25, 15, 20, 'y' );

    var zombiesBottomLeftQuadrantSecondGroupTotal = 6;
    zombiesBottomLeftQuadrantSecondGroup = game.add.group();
    makeZombie( zombiesBottomLeftQuadrantSecondGroup, 3, 92, 98, 168, 172, 150, 200, 6, 8, 20, 25, 40, 60, 'x' );
    makeZombie( zombiesBottomLeftQuadrantSecondGroup, 3, 92, 98, 168, 172, 150, 200, 6, 8, 20, 25, 40, 60, 'y' );

    var zombieKillerLeftQuadrantTotal = 1;
    zombieKillerLeftQuadrant = game.add.group();
    makeZombie( zombieKillerLeftQuadrant, 1, 120, 120, 46, 52, 150, 200, 6, 8, 20, 25, 75, 100, 'y' );

    // ======================================================
    // MAKE HEALTH PACKS
    // ======================================================
    healthPacks = game.add.group();
    // sample function call to make a health pack or packs
    // makeHealthPack( healthPacks, 1, -7, 7, -7, 7, 10, 20 );


    // left of first building
    makeHealthPack( healthPacks, 2, 2, 5, 19, 21, 20, 30, false );
    // midpoint between first and second sections, top of map
    makeHealthPack( healthPacks, 1, 83, 83, 1, 2, 10, 20, false );
    // at the end of the top road, first quadrant
    makeHealthPack( healthPacks, 1, 123, 123, 19, 19, 20, 30, false );
    // to the left of the one above
    makeHealthPack( healthPacks, 1, 97, 97, 38, 38, 100, 150, false );
    // top right of map on dirt
    makeHealthPack( healthPacks, 1, 194, 194, 5, 5, 10, 20, false );
    // top right under dirt
    makeHealthPack( healthPacks, 1, 185, 185, 13, 13, 40, 50, false );
    // beginning of dirt path, top of map
    makeHealthPack( healthPacks, 1, 168, 168, 3, 3, 5, 10, false );
    // right side of zombie road block
    makeHealthPack( healthPacks, 1, 105, 105, 36, 36, 10, 15, false );
    // by car road blaock on right of map
    makeHealthPack( healthPacks, 1, 131, 131, 87, 87, 10, 15, false );
    // corner of road, top right of map
    makeHealthPack( healthPacks, 1, 162, 162, 39, 39, 10, 15, false );
    // top right of map, under road
    makeHealthPack( healthPacks, 1, 195, 195, 37, 37, 50, 70, false );
    // top right of map, under road, to the left
    makeHealthPack( healthPacks, 1, 183, 183, 78, 78, 20, 30, false );
    // right side middle
    makeHealthPack( healthPacks, 1, 196, 196, 81, 81, 10, 20, false );
    // right side bottom
    makeHealthPack( healthPacks, 1, 198, 198, 196, 196, 20, 30, false );
    makeHealthPack( healthPacks, 1, 174, 174, 187, 187, 20, 30, false );
    // dirt patch left side of map
    makeHealthPack( healthPacks, 1, 77, 77, 99, 99, 80, 120, false );
    makeHealthPack( healthPacks, 1, 70, 70, 102, 102, 100, 150, false );
    // bottom left quadrant
    makeHealthPack( healthPacks, 1, 87, 87, 173, 173, 100, 150, false );
    makeHealthPack( healthPacks, 1, 92, 92, 177, 177, 100, 150, false );
    // left side
    makeHealthPack( healthPacks, 1, 67, 67, 42, 42, 10, 20, false );
    // below game start point
    makeHealthPack( healthPacks, 1, 3, 3, 42, 42, 50, 100, false );

    // ======================================================
    // KEYBOARD INPUTS
    // ======================================================
    cursors = game.input.keyboard.createCursorKeys();
    // spacebar = game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
    // esc ...

    // ======================================================
    // PLAYER STATS
    // ======================================================
    playerStatsDisplayStyle = {
        font: "24px Creepster",
        fill: "#fff"        
    };
    playerHPDisplay = game.add.text( 32, 38, "HP: " + player.hp, playerStatsDisplayStyle );
    playerAPDisplay = game.add.text( 32, 62, "AP: " + player.ap, playerStatsDisplayStyle );
    playerKillsDisplay = game.add.text( 32, 86, "KILLS: " + player.zombieKills, playerStatsDisplayStyle );   
    playerHPDisplay.fixedToCamera = true;
    playerAPDisplay.fixedToCamera = true;
    playerKillsDisplay.fixedToCamera = true;
}


// ======================================================
// PHASER FUNCTION
//
// updates with each screen cycle
// ======================================================
function update() {

    game.physics.arcade.collide( player, collisionLayer );
    game.physics.arcade.collide( player, zombiesTopLeftBuilding, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesRoadBlock, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesLowerLeftBuilding, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesCenterOfMap, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesByTheFirstJeep, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesBottomRightBuilding, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesTweeningFromTopRight, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesByDirtTopRight, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesUnderTopRightRoad, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesRightSideMiddle, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesBottomLeftQuadrant, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesBottomLeftQuadrantSecondGroup, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombiesTriggeredTopRight, interactWithZombie, null, this );
    game.physics.arcade.collide( player, zombieKillerLeftQuadrant, interactWithZombie, null, this );
    game.physics.arcade.overlap( player, healthPacks, collectHealthPack, null, this );
    game.physics.arcade.collide( zombiesTopLeftBuilding, collisionLayer );
    game.physics.arcade.collide( zombiesRoadBlock, collisionLayer );
    game.physics.arcade.collide( zombiesLowerLeftBuilding, collisionLayer );
    game.physics.arcade.collide( zombiesCenterOfMap, collisionLayer );
    game.physics.arcade.collide( zombiesByTheFirstJeep, collisionLayer );
    game.physics.arcade.collide( zombiesBottomRightBuilding, collisionLayer );
    game.physics.arcade.collide( zombiesTweeningFromTopRight, collisionLayer );
    game.physics.arcade.collide( zombiesByDirtTopRight, collisionLayer );
    game.physics.arcade.collide( zombiesUnderTopRightRoad, collisionLayer );
    game.physics.arcade.collide( zombiesRightSideMiddle, collisionLayer );
    game.physics.arcade.collide( zombiesBottomLeftQuadrant, collisionLayer );
    game.physics.arcade.collide( zombiesBottomLeftQuadrantSecondGroup, collisionLayer );
    game.physics.arcade.collide( zombiesTriggeredTopRight, collisionLayer );
    game.physics.arcade.collide( zombieKillerLeftQuadrant, collisionLayer );
    game.physics.arcade.collide( healthPacks, collisionLayer );

    // player stats
    playerAPDisplay.setText( " AP: " + player.ap );
    playerHPDisplay.setText( "HP: " + player.hp );
    playerKillsDisplay.setText( " KILLS: " + player.zombieKills );

    // triggered when player "enters" a building door
    if ( buildingDoorRectangle.contains( player.x + player.width / 2, player.y + player.height / 2 ) ) {
        interactWithMedicalDoor();
    }

    // triggered when player falls down hole
    if ( bottomlessHoleRectangleTrigger.contains( player.x, player.y ) ) {
        interactWithHole();
    }

    // triggered when player reaches top right corner of map
    if ( zombiesEnterFromTopRightRectangleTrigger.contains( player.x, player.y ) ) {
        // releaseZombiesFromTopRight();
    }

    if ( buildingMedicalDoorRectangle.contains( player.x + player.width / 2, player.y + player.height / 2 ) ) {
        interactWithMedicalDoor();
    }

    // ======================================================
    // CHASING ZOMBIES
    // ======================================================        
    zombieInteractionRadius = 400;
    zombieChaseSpeed = 200;

    // group zombiesTopLeftBuilding
    if ( game.physics.arcade.distanceBetween( zombiesTopLeftBuilding.children[ 0 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesTopLeftBuilding.children[ 0 ], player, zombieChaseSpeed, this );
    }
    // if ( game.physics.arcade.distanceBetween( zombiesTopLeftBuilding.children[ 2 ], player ) < zombieInteractionRadius ) {
    //     game.physics.arcade.moveToObject( zombiesTopLeftBuilding.children[ 2 ], player, zombieChaseSpeed, this );
    // }

    // group zombiesLowerLeftBuilding
    for ( var i = 0; i < zombiesLowerLeftBuilding.children.length; i++ ) {
        if ( game.physics.arcade.distanceBetween( zombiesLowerLeftBuilding.children[ i ], player ) < zombieInteractionRadius ) {
            game.physics.arcade.moveToObject( zombiesLowerLeftBuilding.children[ i ], player, zombieChaseSpeed, this );
        }
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

    // group zombiesTweeningFromTopRight
    if ( game.physics.arcade.distanceBetween( zombiesTweeningFromTopRight.children[ 0 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesTweeningFromTopRight.children[ 0 ], player, zombieChaseSpeed, this );
    }
    if ( game.physics.arcade.distanceBetween( zombiesTweeningFromTopRight.children[ 3 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombiesTweeningFromTopRight.children[ 3 ], player, zombieChaseSpeed, this );
    }

    // group zombiesRightSideMiddle
    for ( var i = 0; i < zombiesRightSideMiddle.children.length; i++ ) {
        if ( game.physics.arcade.distanceBetween( zombiesRightSideMiddle.children[ i ], player ) < zombieInteractionRadius ) {
            game.physics.arcade.moveToObject( zombiesRightSideMiddle.children[ i ], player, zombieChaseSpeed, this );
        }
    }

    // group zombiesBottomLeftQuadrantSecondGroup
    for ( var i = 0; i < zombiesBottomLeftQuadrantSecondGroup.children.length; i++ ) {
        if ( game.physics.arcade.distanceBetween( zombiesBottomLeftQuadrantSecondGroup.children[ i ], player ) < zombieInteractionRadius ) {
            game.physics.arcade.moveToObject( zombiesBottomLeftQuadrantSecondGroup.children[ i ], player, zombieChaseSpeed, this );
        }
    }

    // group zombieKillerLeftQuadrant
    if ( game.physics.arcade.distanceBetween( zombieKillerLeftQuadrant.children[ 0 ], player ) < zombieInteractionRadius ) {
        game.physics.arcade.moveToObject( zombieKillerLeftQuadrant.children[ 0 ], player, zombieChaseSpeed, this );
    }


    // ======================================================
    // KEYBOARD INPUTS
    // ======================================================

    // reset the player's velocity with each frame update
    player.body.velocity.setTo( 0, 0 );

    // check for an arrow key press
    // TODO: the current code doesn't allow for diagonal movement, but can be added in if we want by uncommenting the commented out lines
    var playerSpeed = 500;

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

    //TODO: comment all of this out for the final game
    // game.debug.text( 'Tile X: ' + grassLayer.getTileX( player.x ), 32, 48, textColor );
    // game.debug.text( 'Tile Y: ' + grassLayer.getTileY( player.y ), 32, 64, textColor );
}


// ======================================================
// SAJE GAMES FUNCTIONS
//
//
// ======================================================


// function interactWithDoor( door ) {
//     //     // var audio = new Audio( '/assets/audio/zombie-demon-spawn.mp3' );
//     //     // audio.play();
//     console.log( "Entered door..." );
//
//     //     // doorEntered = door;
//     //     // game.paused = true;
//     //     // $( '#modal-door' ).modal( 'show' );
// }

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
function makeHealthPack( group, howMany, startX, endX, startY, endY, hpMin, hpMax, forZombieKill ) {

    for ( var i = 0; i < howMany; i++ ) {
        if ( forZombieKill ) {
            var x = game.rnd.integerInRange( player.x + ( startX * mapTileSize ), player.x + ( endX * mapTileSize ) );
            var y = game.rnd.integerInRange( player.y + ( startY * mapTileSize ), player.y + ( endY * mapTileSize ) );
        } else {
            var x = game.rnd.integerInRange( ( startX * mapTileSize ), ( endX * mapTileSize ) );
            var y = game.rnd.integerInRange( ( startY * mapTileSize ), ( endY * mapTileSize ) );
        }

        // adds the health pack to the group passed in
        var healthPack = group.create( x, y, 'healthPack' );
        healthPack.frame = game.rnd.integerInRange( 65, 110 );
        healthPack.hp = game.rnd.integerInRange( hpMin, hpMax );
        game.physics.arcade.enable( healthPack );
        healthPack.body.enable = true;
        healthPack.body.immovable = true;
        healthPack.anchor.setTo( 0.5, 0.5 );
    }
}

function collectHealthPack( player, healthPack ) {

    var style = {
        font: "36px Creepster",
        fill: "#D4EB51"
    };
    var text = game.add.text( healthPack.x, healthPack.y, '+' + healthPack.hp + ' hp!', style );
    text.anchor.set( 0.5 );

    game.add.tween( text ).to( {
        alpha: 0
    }, 3000, Phaser.Easing.Linear.None, true );

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