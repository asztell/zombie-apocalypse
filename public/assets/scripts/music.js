$(document).ready(function(){


  $("#jquery_jplayer_1").jPlayer({
    
    ready: function() {
      
      $(this).jPlayer("setMedia", {
      
        mp3: "../assets/audio/zombie_music.mp3"

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







  // var myPlaylist = new jPlayerPlaylist({
  //   jPlayer: "#jquery_jplayer_1"
  //   ,cssSelectorAncestor: "#jp"
  // }, [
  // {
  //   title:"",  artist:"",
  //   mp3:"../assets/audio/28_Weeks_Later.mp3",
  //   oga:"",  poster: ""
  // }
  // ,
  // {
  //   title:"",  artist:"",
  //   mp3:"../assets/audio/Constance.mp3",
  //   oga:"",  poster: ""
  // }
  // ,
  // {
  //   title:"",  artist:"",
  //   mp3:"../assets/audio/It_Follows.mp3",
  //   oga:"",  poster: ""
  // }
  // ,
  // {
  //   title:"",  artist:"",
  //   mp3:"../assets/audio/The_Thing.mp3",
  //   oga:"",  poster: ""
  // }
  //   ],
  // {
  //   playlistOptions: {
  //   enableRemoveControls: true
  //   // ,autoPlay: true
  //   },
  //   swfPath: "/js",
  //   supplied: "mp3",
  //   smoothPlayBar: true,
  //   keyEnabled: true,
  //   audioFullScreen: true // Allows the audio poster to go full screen via keyboard
  // });





/*! jPlayerInspector for jPlayer 2.9.2 ~ (c) 2009-2014 Happyworm Ltd ~ MIT License */
// !function (a, b) {
//     a.jPlayerInspector = {
//     },
//     a.jPlayerInspector.i = 0,
//     a.jPlayerInspector.defaults = {
//         jPlayer: b,
//         idPrefix: 'jplayer_inspector_',
//         visible: !1
//     };
//     var c = {
//         init: function (b) {
//             var c = a(this),
//             d = a.extend({
//             }, a.jPlayerInspector.defaults, b);
//             a(this).data('jPlayerInspector', d),
//             d.id = a(this).attr('id'),
//             d.jPlayerId = d.jPlayer.attr('id'),
//             d.windowId = d.idPrefix + 'window_' + a.jPlayerInspector.i,
//             d.statusId = d.idPrefix + 'status_' + a.jPlayerInspector.i,
//             d.configId = d.idPrefix + 'config_' + a.jPlayerInspector.i,
//             d.toggleId = d.idPrefix + 'toggle_' + a.jPlayerInspector.i,
//             d.eventResetId = d.idPrefix + 'event_reset_' + a.jPlayerInspector.i,
//             d.updateId = d.idPrefix + 'update_' + a.jPlayerInspector.i,
//             d.eventWindowId = d.idPrefix + 'event_window_' + a.jPlayerInspector.i,
//             d.eventId = {
//             },
//             d.eventJq = {
//             },
//             d.eventTimeout = {
//             },
//             d.eventOccurrence = {
//             },
//             a.each(a.jPlayer.event, function (b, c) {
//                 d.eventId[c] = d.idPrefix + 'event_' + b + '_' + a.jPlayerInspector.i,
//                 d.eventOccurrence[c] = 0
//             });
//             var e = '<p><a href="#" id="' + d.toggleId + '">' + (d.visible ? 'Hide' : 'Show') + '</a> jPlayer Inspector</p><div id="' + d.windowId + '"><div id="' + d.statusId + '"></div><div id="' + d.eventWindowId + '" style="padding:5px 5px 0 5px;background-color:#eee;border:1px dotted #000;"><p style="margin:0 0 10px 0;"><strong>jPlayer events that have occurred over the past 1 second:</strong><br />(Backgrounds: <span style="padding:0 5px;background-color:#eee;border:1px dotted #000;">Never occurred</span> <span style="padding:0 5px;background-color:#fff;border:1px dotted #000;">Occurred before</span> <span style="padding:0 5px;background-color:#9f9;border:1px dotted #000;">Occurred</span> <span style="padding:0 5px;background-color:#ff9;border:1px dotted #000;">Multiple occurrences</span> <a href="#" id="' + d.eventResetId + '">reset</a>)</p>',
//             f = 'float:left;margin:0 5px 5px 0;padding:0 5px;border:1px dotted #000;';
//             return e += '<div id="' + d.eventId[a.jPlayer.event.ready] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.setmedia] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.flashreset] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.resize] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.repeat] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.click] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.warning] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.loadstart] + '" style="clear:left;' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.progress] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.timeupdate] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.volumechange] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.error] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.play] + '" style="clear:left;' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.pause] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.waiting] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.playing] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.seeking] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.seeked] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.ended] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.loadeddata] + '" style="clear:left;' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.loadedmetadata] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.canplay] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.canplaythrough] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.suspend] + '" style="clear:left;' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.abort] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.emptied] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.stalled] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.ratechange] + '" style="' + f + '"></div><div id="' + d.eventId[a.jPlayer.event.durationchange] + '" style="' + f + '"></div><div style="clear:both"></div>',
//             e += '</div><p><a href="#" id="' + d.updateId + '">Update</a> jPlayer Inspector</p><div id="' + d.configId + '"></div></div>',
//             a(this).html(e),
//             d.windowJq = a('#' + d.windowId),
//             d.statusJq = a('#' + d.statusId),
//             d.configJq = a('#' + d.configId),
//             d.toggleJq = a('#' + d.toggleId),
//             d.eventResetJq = a('#' + d.eventResetId),
//             d.updateJq = a('#' + d.updateId),
//             a.each(a.jPlayer.event, function (b, e) {
//                 d.eventJq[e] = a('#' + d.eventId[e]),
//                 d.eventJq[e].text(b + ' (' + d.eventOccurrence[e] + ')'),
//                 d.jPlayer.bind(e + '.jPlayerInspector', function (a) {
//                     d.eventOccurrence[a.type]++,
//                     d.eventOccurrence[a.type] > 1 ? d.eventJq[a.type].css('background-color', '#ff9')  : d.eventJq[a.type].css('background-color', '#9f9'),
//                     d.eventJq[a.type].text(b + ' (' + d.eventOccurrence[a.type] + ')'),
//                     clearTimeout(d.eventTimeout[a.type]),
//                     d.eventTimeout[a.type] = setTimeout(function () {
//                         d.eventJq[a.type].css('background-color', '#fff')
//                     }, 1000),
//                     setTimeout(function () {
//                         d.eventOccurrence[a.type]--,
//                         d.eventJq[a.type].text(b + ' (' + d.eventOccurrence[a.type] + ')')
//                     }, 1000),
//                     d.visible && c.jPlayerInspector('updateStatus')
//                 })
//             }),
//             d.jPlayer.bind(a.jPlayer.event.ready + '.jPlayerInspector', function () {
//                 c.jPlayerInspector('updateConfig')
//             }),
//             d.toggleJq.click(function () {
//                 return d.visible ? (a(this).text('Show'), d.windowJq.hide(), d.statusJq.empty(), d.configJq.empty())  : (a(this).text('Hide'), d.windowJq.show(), d.updateJq.click()),
//                 d.visible = !d.visible,
//                 a(this).blur(),
//                 !1
//             }),
//             d.eventResetJq.click(function () {
//                 return a.each(a.jPlayer.event, function (a, b) {
//                     d.eventJq[b].css('background-color', '#eee')
//                 }),
//                 a(this).blur(),
//                 !1
//             }),
//             d.updateJq.click(function () {
//                 return c.jPlayerInspector('updateStatus'),
//                 c.jPlayerInspector('updateConfig'),
//                 !1
//             }),
//             d.visible || d.windowJq.hide(),
//             a.jPlayerInspector.i++,
//             this
//         },
//         destroy: function () {
//             a(this).data('jPlayerInspector') && a(this).data('jPlayerInspector').jPlayer.unbind('.jPlayerInspector'),
//             a(this).empty()
//         },
//         updateConfig: function () {
//             var b = '<p>This jPlayer instance is running in your browser where:<br />';
//             for (i = 0; i < a(this).data('jPlayerInspector').jPlayer.data('jPlayer').solutions.length; i++) {
//                 var c = a(this).data('jPlayerInspector').jPlayer.data('jPlayer').solutions[i];
//                 if (b += '&nbsp;jPlayer\'s <strong>' + c + '</strong> solution is', a(this).data('jPlayerInspector').jPlayer.data('jPlayer') [c].used) {
//                     b += ' being <strong>used</strong> and will support:<strong>';
//                     for (format in a(this).data('jPlayerInspector').jPlayer.data('jPlayer') [c].support) a(this).data('jPlayerInspector').jPlayer.data('jPlayer') [c].support[format] && (b += ' ' + format);
//                     b += '</strong><br />'
//                 } else b += ' <strong>not required</strong><br />'
//             }
//             b += '</p>',
//             b += a(this).data('jPlayerInspector').jPlayer.data('jPlayer').html.active ? a(this).data('jPlayerInspector').jPlayer.data('jPlayer').flash.active ? '<strong>Problem with jPlayer since both HTML5 and Flash are active.</strong>' : 'The <strong>HTML5 is active</strong>.' : a(this).data('jPlayerInspector').jPlayer.data('jPlayer').flash.active ? 'The <strong>Flash is active</strong>.' : 'No solution is currently active. jPlayer needs a setMedia().',
//             b += '</p>';
//             var d = a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.formatType;
//             b += '<p><code>status.formatType = \'' + d + '\'</code><br />',
//             b += d ? '<code>Browser canPlay(\'' + a.jPlayer.prototype.format[d].codec + '\')</code>' : '</p>',
//             b += '<p><code>status.src = \'' + a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.src + '\'</code></p>',
//             b += '<p><code>status.media = {<br />';
//             for (prop in a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.media) b += '&nbsp;' + prop + ': ' + a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.media[prop] + '<br />';
//             b += '};</code></p>',
//             b += '<p>',
//             b += '<code>status.videoWidth = \'' + a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.videoWidth + '\'</code>',
//             b += ' | <code>status.videoHeight = \'' + a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.videoHeight + '\'</code>',
//             b += '<br /><code>status.width = \'' + a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.width + '\'</code>',
//             b += ' | <code>status.height = \'' + a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.height + '\'</code>',
//             b += '</p>',
//             a(this).data('jPlayerInspector').jPlayer.data('jPlayer').html.audio.available && (b += '<code>htmlElement.audio.canPlayType = ' + typeof a(this).data('jPlayerInspector').jPlayer.data('jPlayer').htmlElement.audio.canPlayType + '</code><br />'),
//             a(this).data('jPlayerInspector').jPlayer.data('jPlayer').html.video.available && (b += '<code>htmlElement.video.canPlayType = ' + typeof a(this).data('jPlayerInspector').jPlayer.data('jPlayer').htmlElement.video.canPlayType + '</code>'),
//             b += '</p>',
//             b += '<p>This instance is using the constructor options:<br /><code>$(\'#' + a(this).data('jPlayerInspector').jPlayer.data('jPlayer').internal.self.id + '\').jPlayer({<br />&nbsp;swfPath: \'' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'swfPath') + '\',<br />&nbsp;solution: \'' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'solution') + '\',<br />&nbsp;supplied: \'' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'supplied') + '\',<br />&nbsp;preload: \'' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'preload') + '\',<br />&nbsp;volume: ' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'volume') + ',<br />&nbsp;muted: ' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'muted') + ',<br />&nbsp;backgroundColor: \'' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'backgroundColor') + '\',<br />&nbsp;cssSelectorAncestor: \'' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'cssSelectorAncestor') + '\',<br />&nbsp;cssSelector: {';
//             var e = a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'cssSelector');
//             for (prop in e) b += '<br />&nbsp;&nbsp;' + prop + ': \'' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'cssSelector.' + prop) + '\',';
//             return b = b.slice(0, - 1),
//             b += '<br />&nbsp;},<br />&nbsp;errorAlerts: ' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'errorAlerts') + ',<br />&nbsp;warningAlerts: ' + a(this).data('jPlayerInspector').jPlayer.jPlayer('option', 'warningAlerts') + '<br />});</code></p>',
//             a(this).data('jPlayerInspector').configJq.html(b),
//             this
//         },
//         updateStatus: function () {
//             return a(this).data('jPlayerInspector').statusJq.html('<p>jPlayer is ' + (a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.paused ? 'paused' : 'playing') + ' at time: ' + Math.floor(10 * a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.currentTime) / 10 + 's. (d: ' + Math.floor(10 * a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.duration) / 10 + 's, sp: ' + Math.floor(a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.seekPercent) + '%, cpr: ' + Math.floor(a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.currentPercentRelative) + '%, cpa: ' + Math.floor(a(this).data('jPlayerInspector').jPlayer.data('jPlayer').status.currentPercentAbsolute) + '%)</p>'),
//             this
//         }
//     };
//     a.fn.jPlayerInspector = function (b) {
//         return c[b] ? c[b].apply(this, Array.prototype.slice.call(arguments, 1))  : 'object' != typeof b && b ? void a.error('Method ' + b + ' does not exist on jQuery.jPlayerInspector')  : c.init.apply(this, arguments)
//     }
// }(jQuery);

// new jPlayerPlaylist({
//     jPlayer: "#jquery_jplayer_1",
//     cssSelectorAncestor: "#jp_container_1"
//   }, [
//     {
//       title:"",
//       artist:"",
//       mp3:"../assets/audio/Constance.mp3",
//     },
//     {
//       title:"",
//       artist:"",
//       mp3:"../assets/audio/Constance.mp3",
//     },    
//     {
//       title:"",
//       artist:"",
//       mp3:"../assets/audio/Constance.mp3",
//     }, 
//     {
//       title:"",
//       artist:"",
//       mp3:"../assets/audio/Constance.mp3",
//     }, ], {
//     swfPath: "../dist/jplayer",
//     supplied: "webmv, ogv, m4v",
//     useStateClassSkin: true,
//     autoBlur: false,
//     smoothPlayBar: true,
//     keyEnabled: false
//     // ,autoPlay: true
//   });


//   $("#jplayer_inspector_1").jPlayerInspector({jPlayer:$("#jquery_jplayer_1")});


});