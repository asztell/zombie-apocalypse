//test comment for commit
var game = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.AUTO, "", {
    preload: preload,
    create: create,
    update: update,
    render: render
} );

var gameStartTime = Date.now();
var gameEndTime;
var chosenCharacter;
var zombieToKill;
var map;
var player;
var zombie1;
var zombie2;
var zombie3;
var cursors;
var spacebar;
var grassLayer;
var baseLayer;
var collisionLayer;
var randomItemsLayer;
var door;
var enteredDoor;
var zombies;
var buildingDoorRectangle;
var zombieSpawnPoint;
var zombieSpawnRectangle;
var zombie1_tween;
var zombie2_tween;
var zombie3_tween;
var healthPack;

function preload() {

    // put the game "stage" in the middle of the page
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    // game.scale.pageAlignVertically = true;
    // game.stage.backgroundColor = '#eee';

    // load map and other images needed
    game.load.tilemap( "map", "assets/tilemaps/gameMap.json", null, Phaser.Tilemap.TILED_JSON );
    game.load.spritesheet( "playerAnimations", "assets/images/Character1Walk.png", 64, 64 );
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
    game.load.image( "trees", "assets/images/treetop.png" );
}

function create() {

    game.physics.startSystem( Phaser.Physics.ARCADE );

    chosenCharacter = JSON.parse( localStorage.getItem( "character" ) );
    console.log( chosenCharacter );
    $.ajax( {
        type: "post",
        url: "game/new",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify( chosenCharacter ),
        success: function ( response ) {
            console.log( response.gameID );
            if ( response.status === "success" ) {
                //do something
            } else if ( response.status === "error" ) {
                console.log( response );
                // do something
            }
        }
    } );

    // setup map images
    map = game.add.tilemap( "map" );
    map.addTilesetImage( "level1", "street" );
    map.addTilesetImage( "buildings", "building" );
    map.addTilesetImage( "cars1", "cars" );
    map.addTilesetImage( "cars2", "jeep" );
    map.addTilesetImage( "food1", "food" );
    map.addTilesetImage( "player1", "player" );
    map.addTilesetImage( "side_objects", "objects" );
    map.addTilesetImage( "grass", "grass" );
    map.addTilesetImage( "logos", "logos" );
    map.addTilesetImage( "dirt", "dirt" );
    map.addTilesetImage( "trees", "trees" );

    // setup layers and collision layer
    grassLayer = map.createLayer( "grass_layer" );
    baseLayer = map.createLayer( "base_layer" );    
    collisionLayer = map.createLayer( "collision_layer" );
    randomItemsLayer = map.createLayer( "random_items_layer" );
    grassLayer.resizeWorld();
    map.setCollisionBetween( 0, 1943, true, collisionLayer, true );

    // can see where/what the objects are in the map json, the objects on any layer are an array of objects, can get their properties and such like any object
    door = map.objects[ 'building_doors' ][ 0 ];
    // door = map.objects.map( function ( e ) { return e.name; }).indexOf( 'buildDoor' );
    // this creates a rectangle to put on the map that the player can interact with, in this case an overlap
    buildingDoorRectangle = new Phaser.Rectangle( door.x, door.y, door.width, door.height );

    healthPack = game.add.sprite(100, 100, 'healthPack' );
    healthPack.frame = 95;
    game.physics.arcade.enable( healthPack );

    //TODO: keep for now for reference, but likely will end up deleting it
    // this is the zombie spawn point in front of the building, we can have the zombies, say 3, spawn in this area rather than all over the map
    // zombieSpawnPoint = map.objects[ 'zombie_spawn_points' ][ 0 ];
    // zombieSpawnPoint = map.objects.map( function ( e ) { return e.name; }).indexOf( 'zombieSpawnPoint' );
    // zombieSpawnRectangle = new Phaser.Rectangle( zombieSpawnPoint.x, zombieSpawnPoint.y, zombieSpawnPoint.width, zombieSpawnPoint.height );

    // ======================================================
    // PLAYER CONSTRUCTOR
    // This is a Phaser sprite object extended by us with our own properties and methods
    // TODO: refactor this into its own module or elsewhere in the code to clean things up
    // ======================================================
    player = game.add.sprite( 0, 800, "playerAnimations" );
    player.frame = 18;
    game.physics.arcade.enable( player );
    player.body.collideWorldBounds = true;
    player.anchor.setTo( 0.5, 0.5 );
    game.camera.follow( player );

    // these are the animations as the player walks around
    player.animations.add( "up", [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], 10, true );
    player.animations.add( "down", [ 18, 19, 20, 21, 22, 23, 24, 25, 26 ], 10, true );
    player.animations.add( "left", [ 9, 10, 11, 12, 13, 14, 15, 16, 17 ], 10, true );
    player.animations.add( "right", [ 27, 28, 29, 30, 31, 32, 33, 34, 35 ], 10, true );

    // these are our custom properties and methods added to the Phaser sprite object
    player.hp = player.hasOwnProperty( 'hp' ) ? logError( 'hp' ) : parseInt(chosenCharacter.hp);
    player.ap = player.hasOwnProperty( 'ap' ) ? logError( 'ap' ) : parseInt(chosenCharacter.ap);
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

    zombie1 = game.add.sprite( ( 22 * 32 ), ( 26 * 32 ), 'zombie' );
    zombie2 = game.add.sprite( ( 23 * 32 ), ( 27 * 32 ), 'zombie' );
    zombie3 = game.add.sprite( ( 24 * 32 ), ( 26 * 32 ), 'zombie' );
    zombie1.anchor.setTo( 0.5, 0.5 );
    zombie2.anchor.setTo( 0.5, 0.5 );
    zombie3.anchor.setTo( 0.5, 0.5 );



    game.add.tween(zombie1).to( { x: (zombie1.x + 200) }, 4000, Phaser.Easing.Linear.InOut, true, 0, Number.MAX_VALUE, true);
    // game.add.tween(zombie1).to( { x: (24 * 32) }, 2000, Phaser.Easing.Cubic.InOut, true, 0, Number.MAX_VALUE, true);

    //tween move right
    // zombie1_tween = game.add.tween( zombie1 ).to( {
    //     x: zombie1.x + ( 2 * 32 )
    // }, 2000, 'Linear', true, 0 );
    // zombie1_tween.onComplete.add( zombie1_tween_left, this );
    // zombie2_tween = game.add.tween( zombie2 ).to( {
    //     x: zombie2.x + ( 2 * 32 )
    // }, 2000, 'Linear', true, 0 );
    // zombie2_tween.onComplete.add( zombie2_tween_left, this );
    // zombie3_tween = game.add.tween( zombie3 ).to( {
    //     x: zombie3.x + ( 2 * 32 )
    // }, 2000, 'Linear', true, 0 );
    // zombie3_tween.onComplete.add( zombie3_tween_left, this );

    game.physics.arcade.enable( zombie1 );
    game.physics.arcade.enable( zombie2 );
    game.physics.arcade.enable( zombie3 );
    zombie1.body.collideWorldBounds = true;
    zombie1.immovable = true;
    zombie1.body.moves = false;
    zombie1.name = "Zom_1";
    zombie1.hp = 100;
    zombie1.ap = 10;

    zombie2.body.collideWorldBounds = true;
    zombie2.immovable = true;
    zombie2.body.moves = false;
    zombie2.name = "Zom_2";
    zombie2.hp = 100;
    zombie2.ap = 10;

    zombie3.body.collideWorldBounds = true;
    zombie3.immovable = true;
    zombie3.body.moves = false;
    zombie3.name = "Zom_3";
    zombie3.hp = 100;
    zombie3.ap = 10;

    zombies = game.add.group();


    // game.add.tween(zombie1).to( { x: (zombie1.x + 200) }, 4000, Phaser.Easing.Linear.InOut, true, 0, Number.MAX_VALUE, true);
    // this creates 10 zombies and randomly places them on the map along with currently randomly generated hp and ap points

    // zombies by lower left building
    for ( var i = 0; i < 3; i ++ ) {
        var randomX = game.rnd.integerInRange(1800, 2000);
        var randomY = game.rnd.integerInRange(6100, 6300);
        var randomMove = game.rnd.integerInRange( 100, 300 );
        var randomSpeed = game.rnd.integerInRange( 5000, 6000 );

        var zombie = zombies.create( randomX, randomY, 'zombie' );
        game.add.tween(zombie).to( {x: zombie.x + randomMove }, randomSpeed, Phaser.Easing.Linear.InOut, true, 0, Number.MAX_VALUE, true );
        game.physics.enable( zombie, Phaser.Physics.ARCADE );
        zombie.body.immovable = true;
        zombie.body.collideWorldBounds = true;
        zombie.anchor.setTo( 0.5, 0.5 );
        // zombie.name = "zom_" + i;
        zombie.hp = game.rnd.integerInRange( 30, 80 );
        zombie.ap = game.rnd.integerInRange( 10, 20 );
    }

    for ( var i = 0; i < 3; i ++ ) {
        var randomX = game.rnd.integerInRange(1900, 2100);
        var randomY = game.rnd.integerInRange(6100, 6200);
        var randomMove = game.rnd.integerInRange( 100, 150 );
        var randomSpeed = game.rnd.integerInRange( 5000, 6000 );

        var zombie = zombies.create( randomX, randomY, 'zombie' );
        game.add.tween(zombie).to( {y: zombie.y + randomMove }, randomSpeed, Phaser.Easing.Linear.InOut, true, 0, Number.MAX_VALUE, true );
        game.physics.enable( zombie, Phaser.Physics.ARCADE );
        zombie.body.immovable = true;
        zombie.body.collideWorldBounds = true;
        zombie.anchor.setTo( 0.5, 0.5 );
        // zombie.name = "zom_" + i;
        zombie.hp = game.rnd.integerInRange( 30, 80 );
        zombie.ap = game.rnd.integerInRange( 10, 20 );
    }


    for ( var i = 0; i < 10; i++ ) {
        var randomX = game.rnd.integerInRange(2000, 4000);
        var randomY = game.rnd.integerInRange(2000, 4000);
        var randomMove = game.rnd.integerInRange( 100, 300 );
        var randomSpeed = game.rnd.integerInRange( 4000, 10000 );

        var zombie = zombies.create( randomX, randomY, 'zombie' );
        game.add.tween(zombie).to( {x: zombie.x + randomMove }, randomSpeed, Phaser.Easing.Linear.InOut, true, 0, Number.MAX_VALUE, true );
        game.physics.enable( zombie, Phaser.Physics.ARCADE );
        zombie.body.immovable = true;
        zombie.body.collideWorldBounds = true;
        zombie.anchor.setTo( 0.5, 0.5 );
        // zombie.name = "zom_" + i;
        zombie.hp = game.rnd.integerInRange( 30, 80 );
        zombie.ap = game.rnd.integerInRange( 10, 20 );
    }

    console.log( zombies );
    console.log( "Zombie HP: " + zombies.children[ 0 ].hp );

    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
}

function update() {

    var playerSpeed = 400;

    game.physics.arcade.collide( player, collisionLayer );
    // game.physics.arcade.collide( player, collisionLayer, interactCollisionLayer, null, this );
    game.physics.arcade.collide( player, zombies, interactZombie, null, this );   
    game.physics.arcade.collide( player, zombie1, interactZombie, null, this );
    game.physics.arcade.collide( player, zombie2, interactZombie, null, this );
    game.physics.arcade.collide( player, zombie3, interactZombie, null, this );
    game.physics.arcade.overlap( player, healthPack, collectHealth, null, this );

    if ( buildingDoorRectangle.contains( player.x + player.width / 2, player.y + player.height / 2 ) ) {
        console.log( "Entering door..." );
        interactDoor();
    }

    // reset the player's velocity with each frame update
    player.body.velocity.setTo( 0, 0 );

    // check for an arrow key press
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

function interactZombie( player, zombie ) {

    zombieToKill = zombie;
    game.paused = true;
    $( '#modal' ).modal( 'show' );        
}

// when modal is triggered, populate with current health stats for player and zombie
$('#modal').on('shown.bs.modal', function (e) {
    
    $( '#attack-button' ).show();
    $( '#close-button' ).html( "RETREAT!" );
    
    $( '#modal #message' ).html(
        "Player HP: " + player.hp + "\n" +
        "Zombie name: " + zombieToKill.name + "\n" +
        "Zombie HP: " + zombieToKill.hp );
});

// do a bunch of stuff each time the attack button is clicked when inside the modal
$( '#attack-button' ).on( 'click', function () {
    player.attack( zombieToKill );

    // as long as the zombie is alive keep attacking
    if ( player.hp > 0 && zombieToKill.hp > 0 ) {
        $( '#modal #message' ).html(
            "Player HP: " + player.hp + "\n" +
            "Zombie name: " + zombieToKill.name + "\n" +
            "Zombie HP: " + zombieToKill.hp );
    } else {

        if ( zombieToKill.hp <= 0 ) {
            // if the zombie is killed do all this
            player.zombieKills++;
            $( '#modal #message' ).html(
                "Player HP: " + player.hp + "\n" +
                "Zombie name: " + zombieToKill.name + "\n" +
                "Zombie HP: 0" );

            $( '#attack-button' ).hide();
            $( '#close-button' ).html( "RESUME GAME" );

            zombieToKill.destroy();
            dropHealthPack();    
        }

        if ( player.hp <= 0 ) {                        
            //TODO: save game length(time), save zombie kills
            gameEndTime = Date.now();

            $( '#modal #message' ).html(
            "Player HP: 0" +
            "Zombie name: " + zombieToKill.name + "\n" +
            "Zombie HP: " + zombieToKill.hp );

            console.log( gameStartTime );
            console.log( gameEndTime );
            console.log( "Game over..." );

            $( '#modal').modal( 'toggle' );            
            player.destroy();
            // window.location = "/game/over";
        }
    }
});

$( '#modal' ).on( 'hidden.bs.modal', function ( e ) {
    player.body.enable = true;
    player.y += 100;
    game.paused = false;
});

function dropHealthPack() {
    healthPack = game.add.sprite( player.x, player.y + 100, 'healthPack' );
    healthPack.frame = 95;
    game.physics.arcade.enable( healthPack );
    healthPack.body.enable = true;
}

function collectHealth( player, healthPack ) {
    player.hp += 10;
    healthPack.destroy();
}

function interactDoor() {
    //TODO: need a modal/interaction for entering a building
    console.log( "Entered a door..." );
}

// logs an error if a properly already exists on the player or zombie, this is to handle customer properties and functions we add
function logError( prop ) {
    console.error( prop + " already exists, please change the name to avoid conflicts with the Phaser engine!" );
}

// this is for debugging
function render() {
    var textColor = 'rgb(255, 255, 255)';

    //TODO: put the player's x/y coordinates on the screen, this same code can be used to get the player's coordinates to save to the database
    game.debug.text( 'Tile X: ' + grassLayer.getTileX( player.x ), 32, 48, textColor );
    game.debug.text( 'Tile Y: ' + grassLayer.getTileY( player.y ), 32, 64, textColor );
    game.debug.text( 'Health: ' + player.hp, 232, 48, textColor );
    game.debug.text( 'Health: ' + player.ap, 432, 48, textColor );
}