$(document).ready(function(){

//   var myPlaylist = new jPlayerPlaylist({
//     jPlayer: "#jquery_jplayer_N",
//     cssSelectorAncestor: "#jp_container_N"
//   }, [
//   {
//     title:"",  artist:"",
//     mp3:"../audio/28_Weeks_Later.mp3",
//     oga:"",  poster: ""
//   }
//   ,
//   {
//     title:"",  artist:"",
//     mp3:"../audio/Constance.mp3",
//     oga:"",  poster: ""
//   }
//   ,
//   {
//     title:"",  artist:"",
//     mp3:"../audio/It_Follows.mp3",
//     oga:"",  poster: ""
//   }
//   ,
//   {
//     title:"",  artist:"",
//     mp3:"../audio/The_Thing.mp3",
//     oga:"",  poster: ""
//   }
//     ],
//   {
//     playlistOptions: {
//     enableRemoveControls: true,
//     autoPlay: true
//     },
//     swfPath: "/js",
//     supplied: "mp3",
//     smoothPlayBar: true,
//     keyEnabled: true,
//     audioFullScreen: false // Allows the audio poster to go full screen via keyboard
//   });

  $("#jquery_jplayer_1").jPlayer({
    
    ready: function() {
      
      $(this).jPlayer("setMedia", {
      
        mp3: "../assets/audio/Constance.mp3",
        mp3: "../assets/audio/28_Weeks_Later.mp3",
        mp3: "../assets/audio/It_Follows.mp3",
        mp3: "../assets/audio/The_Thing.mp3"
      
      }).jPlayer("play");
    
      var click = document.ontouchstart === undefined ? 'click' : 'touchstart';
      
      var kickoff = function () {
        $("#jquery_jplayer_1").jPlayer("play");
        document.documentElement.removeEventListener(click, kickoff, true);
      };
      
      document.documentElement.addEventListener(click, kickoff, true);
    },

    swfPath: "/js",
    loop: true

  });


});