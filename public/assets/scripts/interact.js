function interactWithDoor( door ) {
    //     // var audio = new Audio( '/assets/audio/zombie-demon-spawn.mp3' );
    //     // audio.play();
  game.paused = true;
      // doorEntered = door;
  $('#building-message').text('You entered the pharmacy and found some crack. Your HP increased by 300.')
  $( '#modal-door' ).modal( 'show' );
  player.hp += 300;
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
