var game = new Phaser.Game( 800, 600, Phaser.AUTO, "", {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var map;
var player;
var zombie;
var cursors;
var baseLayer;
var collisionLayer;
var door;
var enteredDoor;
var zombies;
var buildingDoorRectangle;
var zombieSpawnPoint;
var zombieSpawnRectangle;

function preload() {

    // put the game "stage" in the middle of the page
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    // game.scale.pageAlignVertically = true;
    // game.stage.backgroundColor = '#eee';

    // load map and other images needed
    game.load.tilemap( "map", "assets/tilemaps/gameMap.json", null, Phaser.Tilemap.TILED_JSON );
    game.load.spritesheet( "playerAnimations", "assets/images/Character1Walk.png", 64, 64 );
    game.load.image( "building", "assets/images/Building.png" );
    game.load.image( "cars", "assets/images/Cars_final.png" );
    game.load.image( "food", "assets/images/foodfromcts1a.png" );
    game.load.image( "sidewalk", "assets/images/Sidewalk_dark.png" );
    game.load.image( "street", "assets/images/Street.png" );
    game.load.image( "jeep", "assets/images/wj2.png" );
    game.load.image( "player", "assets/images/player.png" );
    game.load.image( "zombie", "assets/images/zombie.png" );
}

function create() {

    game.physics.startSystem( Phaser.Physics.ARCADE );

    map = game.add.tilemap( "map" );
    map.addTilesetImage( "level1", "street" );
    map.addTilesetImage( "buildings", "building" );
    map.addTilesetImage( "cars1", "cars" );
    map.addTilesetImage( "cars2", "jeep" );
    map.addTilesetImage( "food1", "food" );
    map.addTilesetImage( "player1", "player" );

    baseLayer = map.createLayer( "base_layer" );
    collisionLayer = map.createLayer( "collision_layer" );
    baseLayer.resizeWorld();
    map.setCollisionBetween( 0, 1943, true, collisionLayer, true );

    // can see where/what the objects are in the map json, the objects on any layer are an array of objects, can get their properties and such like any object
    door = map.objects[ 'building_doors' ][ 0 ];
    // door = map.objects.map( function ( e ) { return e.name; }).indexOf( 'buildDoor' );
    // this creates a rectangle to put on the map that the player can interact with, in this case an overlap
    buildingDoorRectangle = new Phaser.Rectangle( door.x, door.y, door.width, door.height );

    // this is the zombie spawn point in front of the building, we can have the zombies, say 3, spawn in this area rather than all over the map
    zombieSpawnPoint = map.objects[ 'zombie_spawn_points' ][ 0 ];
    // zombieSpawnPoint = map.objects.map( function ( e ) { return e.name; }).indexOf( 'zombieSpawnPoint' );
    zombieSpawnRectangle = new Phaser.Rectangle( zombieSpawnPoint.x, zombieSpawnPoint.y, zombieSpawnPoint.width, zombieSpawnPoint.height );

    player = game.add.sprite( 0, 0, "playerAnimations" );
    player.frame = 18;
    game.physics.arcade.enable( player );
    player.body.collideWorldBounds = true;
    game.camera.follow( player );
    player.animations.add( "up", [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], 10, true );
    player.animations.add( "down", [ 18, 19, 20, 21, 22, 23, 24, 25, 26 ], 10, true );
    player.animations.add( "left", [ 9, 10, 11, 12, 13, 14, 15, 16, 17 ], 10, true );
    player.animations.add( "right", [ 27, 28, 29, 30, 31, 32, 33, 34, 35 ], 10, true );

    zombie = game.add.sprite( 100, 100, "zombie" );
    game.physics.arcade.enable( zombie );
    zombie.body.collideWorldBounds = true;
    zombie.immovable = true;
    zombie.body.moves = false;

    // TODO: commenting out for now until the simple map works, will need to place the zombies better so that they aren't on top of buildings
    var sqlZombies = [];
    zombies = game.add.group();

    for (var i = 0; i < 9; i++) {
      zombie = zombies.create(360 + Math.random() * 200, 160 + Math.random() * 200, 'zombie');
      game.physics.enable(zombie, Phaser.Physics.ARCADE);
      zombie.body.immovable = true;
      zombie.body.collideWorldBounds = true;
      zombie.name = "zom_" + i;
      //random numbers between 20 and 40
      zombie.hp = Math.floor(Math.random() * 20) + 20
      zombie.ap = Math.floor(Math.random() * 20) + 20
      zombies.add(zombie);
      var sqlZombie = {
        name: zombie.name,
        hp: zombie.hp,
        ap: zombie.ap,
        isAlive: true
      }
      sqlZombies.push(sqlZombie);
    }

    var chosenCharacter = localStorage.getItem( "character" );

    var newGame = {
        zombies: sqlZombies,
        character: chosenCharacter
    };
    console.log( newGame );
    $.ajax( {
        type: "post",
        url: "new/game",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify( newGame ),
        success: function ( response ) {
            if ( response.status === "success" ) {
                //something
            } else if ( response.status === "error" ) {
                console.log( response );
                // TODO: Pop up modal with error message
            }
        }
    });

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    var playerSpeed = 200;

    game.physics.arcade.collide( player, collisionLayer, interactCollisionLayer, null, this );
    game.physics.arcade.collide( player, zombie, interactZombie, null, this );

    // TODO: this is a hacky solution to get the building door to work, but it came from a tutorial so perhaps not totally hacky, and it works
    if ( buildingDoorRectangle.contains( player.x + player.width / 2, player.y + player.height / 2 ) ) {
        interactDoor();
    }

    // reset the player's velocity with each frame update
    player.body.velocity.setTo( 0, 0 );

    // check for an arrow key press
    if ( cursors.up.isDown ) {
        player.body.velocity.y -= playerSpeed;
        player.animations.play( 'up' );
    }
    else if ( cursors.down.isDown ) {
        player.body.velocity.y += playerSpeed;
        player.animations.play( 'down' );
    }
    else if ( cursors.left.isDown ) {
        player.body.velocity.x -= playerSpeed;
        player.animations.play( 'left' );
    }
    else if ( cursors.right.isDown ) {
        player.body.velocity.x += playerSpeed;
        player.animations.play( 'right' );
    }
    else {
        // when player stops moving maintains last direction and frame
        player.animations.stop();
    }

    //TODO: remove this when going final, just here for code reference in case needed
    // when no cursor is pressed, the player is no longer moving, the player animation is stopped and frame 18 (forward facing) is selected
    // if ( player.body.velocity.x === 0 && player.body.velocity.y === 0 ) {
    //     player.frame = 18;
    // }
}

// this is for debugging
function render() {
    var textColor = 'rgb(255, 255, 255)';

    //TODO: put the player's x/y coordinates on the screen, this same code can be used to get the player's coordinates to save to the database
    game.debug.text( 'Tile X: ' + baseLayer.getTileX( player.x ), 32, 48, textColor );
    game.debug.text( 'Tile Y: ' + baseLayer.getTileY( player.y ), 32, 64, textColor );
}

function interactCollisionLayer( player, layer ) {
    console.log( "Ran into the collision layer..." );
}

function interactZombie( player, zombie ) {
    //TODO: need a modal/interaction for zombie
    console.log( "Ran into a zombie..." );
    console.log( " x: " + zombie.x + " y: " + zombie.y );
    console.log( zombie.name );

    // this removes the zombie from the map, possibly use when zombie is killed, or cna switch graphic and show the zombie is dead and leave on the map
    // zombie.kill();
}

function interactDoor() {
    //TODO: need a modal/interaction for entering a building
    console.log( "Entered a door..." );
}
