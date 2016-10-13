var game = new Phaser.Game( 200, 160, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

var player;
var zombie;
var cursors;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    game.load.image( 'player', 'assets/images/player.png' );
    game.load.image( 'zombie', 'assets/images/zombie.png' );
}

function create() {
    game.physics.startSystem( Phaser.Physics.ARCADE );

    player = game.add.sprite( 25, 25, 'player' );
    game.physics.arcade.enable( player );
    player.body.collideWorldBounds = true;
    game.camera.follow( player );
    zombie = game.add.sprite( 100, 100, 'zombie' );
    game.physics.arcade.enable( zombie );
    zombie.body.collideWorldBounds = true;
    zombie.body.immovable = true;
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    game.physics.arcade.collide( player, zombie, interact );

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if ( cursors.up.isDown ) {
        if ( player.body.velocity.y == 0 )
            player.body.velocity.y -= 200;
    }
    else if ( cursors.down.isDown ) {
        if ( player.body.velocity.y == 0 )
            player.body.velocity.y += 200;
    }
    else {
        player.body.velocity.y = 0;
    }
    if ( cursors.left.isDown ) {
        player.body.velocity.x -= 200;
    }
    else if ( cursors.right.isDown ) {
        player.body.velocity.x += 200;
    }
}

function interact( player, zombie ) {
    console.log("We have collision...");
    zombie.kill();
}