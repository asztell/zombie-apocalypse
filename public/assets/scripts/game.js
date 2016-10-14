var game = new Phaser.Game( 800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

var player;
var zombie;
var cursors;
var zombies;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    game.load.image( 'player', 'assets/images/player.png' );
    game.load.image( 'zombie', 'assets/images/zombie.png' );
}

function create() {
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

    var chosenCharacter = localStorage.getItem('character');

    var newGame = {
      zombies: sqlZombies,
      character: chosenCharacter
    }
    console.log(newGame);
    $.ajax({
       type: "post",
       url: "new/game",
       dataType:"json",
       contentType: 'application/json',
       data: JSON.stringify(newGame),
       success: function (response) {
           if(response.status === "success") {
             //something
           } else if(response.status === "error") {
               console.log(response);
               // TODO: Pop up modal with error message
           }
       }
   });

    game.physics.startSystem( Phaser.Physics.ARCADE );

    player = game.add.sprite( 25, 25, 'player' );
    game.physics.arcade.enable( player );
    player.body.collideWorldBounds = true;
    game.camera.follow( player );
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    game.physics.arcade.collide( player, zombies, interact );

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
    console.log(" x: " + zombie.x + " y: " + zombie.y);
    console.log(zombie.name);
    zombie.kill();
}
