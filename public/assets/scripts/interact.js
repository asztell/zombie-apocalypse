function interactWithDoor() {
    //     // var audio = new Audio( '/assets/audio/zombie-demon-spawn.mp3' );
    //     // audio.play();
    console.log('inside interactWithDoor()');
    var randomHP = game.rnd.integerInRange( 50, 150 ); 
    game.paused = true;
    // doorEntered = door;
    $( '#building-message' ).text( 'You entered the Grocery Store and found some crack. Your HP increased by ' + randomHP + '!' )
    $( '#modal-door' ).modal( 'show' );
    $( '#close-door-modal-button' ).focus();
    player.hp += randomHP;
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
    });
    player.y += 100;
}

function interactWithMedicalDoor() {
    //     // var audio = new Audio( '/assets/audio/zombie-demon-spawn.mp3' );
    //     // audio.play();
    var randomHP = game.rnd.integerInRange( 50, 150 );
    game.paused = true;
    player.hp += randomHP;
    // doorEntered = door;
    $( '#building-message' ).text( 'You entered the Pharmacy and found some crack. Your HP increased by ' + randomHP + '!' )
    $( '#modal-door' ).modal( 'show' );
    $('#close-door-modal-button').focus();
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
    player.y += 100;
}

$( '#modal-door' ).on( 'shown.bs.modal', function ( e ) {
    $( '#close-door-modal-button' ).show().focus();
} );

$( '#modal-door' ).on( 'hidden.bs.modal', function ( e ) {
    // this keeps the modal from popping up multiple times
    player.body.velocity.setTo( 0, 0 );
    game.paused = false;
} );

function interactWithZombie( player, zombie ) {

    zombieCryAudio.play();

    // save zombie to global so it can be accessed later
    zombieToKill = zombie;
    game.paused = true;
    $( '#modal #message' ).html( "Player HP: " + player.hp + "<br>Zombie HP: " + zombieToKill.hp );
    $( '#close-button' ).html( "RETREAT!" );
    $( '#modal' ).modal( 'show' );
}

// when modal is triggered, populate with current health stats for player and zombie
$( '#modal' ).on( 'shown.bs.modal', function ( e ) {
    $( '#attack-button' ).show().focus();
} );

// do a bunch of stuff each time the attack button is clicked when inside the modal
$( '#attack-button' ).on( 'click', function () {

    attackSmack.play();

    // call player attack function and pass in opponent
    player.attack( zombieToKill );

    // as long as the zombie is alive keep attacking
    if ( player.hp > 0 && zombieToKill.hp > 0 ) {
        $( '#modal #message' ).html( "Player HP: " + player.hp + "<br>Zombie HP: " + zombieToKill.hp );
    } else {

        if ( zombieToKill.hp <= 0 ) {
            // if the zombie is killed do all this
            player.zombieKills++;
            $( '#modal #message' ).html( "Player HP: " + player.hp + "<br>Zombie killed!" );

            $( '#attack-button' ).hide();
            $( '#close-button' ).html( "RESUME GAME" ).focus();

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

            // TODO: NEED TO FIX THIS FOR COLLECTING HEALTH AFTER ZOMBIE KILL, CURRENT FORMULA DOESN'T WORK'
            makeHealthPack( healthPacks, 1, -3, 3, -3, 3, 10, 20, true );
            console.log( healthPacks );
        }

        if ( player.hp <= 0 ) {
            //TODO: save game length(time), save zombie kills
            gameEndTime = Date.now();

            $( '#attack-button' ).hide();
            $( '#close-button' ).hide();
            $( '#modal #message' ).html( 'Death by Zombie!<br>Game Over!' );

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
                    setTimeout( gameOverRedirect, 3000 );
                }
            } );

            // $( '#modal' ).modal( 'toggle' );
            // player.destroy();
        }
    }
} );

$( '#modal' ).on( 'hidden.bs.modal', function ( e ) {
    // this keeps the modal from popping up multiple times
    player.body.velocity.setTo( 0, 0 );
    game.paused = false;
} );

function interactWithHole() {

    var hpLoss = 25;

    var style = {
        font: "36px Creepster",
        fill: "#910000"
    };
    var text = game.add.text( player.x, player.y, '-' + hpLoss + ' hp!', style );
    text.anchor.set( 0.5 );

    game.add.tween( text ).to( {
        alpha: 0
    }, 3000, Phaser.Easing.Linear.None, true );

    player.hp -= hpLoss;
    player.x = ( 99 * mapTileSize );
    player.y = ( 150 * mapTileSize );

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
}

function gameOverRedirect() {
    window.location = "/game/stats/" + gameID;
}