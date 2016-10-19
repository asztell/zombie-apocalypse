var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function () {
	passport.use(new TwitterStrategy({
	    consumerKey: 'TGAr77vQ664rErgXJem3rZM0Q',
	    consumerSecret: 'YG0GxkD6zFlC07P8Uqlg3yIvd4JkBZfHPnUiRSFGs1Ryv5Ot7x',
	    // callbackURL needs to change when deployed
	    callbackUrl: 'http://localhost:3000/twitter/callback',
	    passReqToCallback: true
	  }
	  ,function(req, token, tokenSecret, profile, done) {
	    var user = {};

	    // user.email = profile.emails[0].value;
	    user.image = profile.photos.value;
	    user.displayName = profile.username;

	    user.twitter = {};
	    user.twitter.id = profile.id;
	    user.twitter.token = token;

	    done(null, user);
	  }
	));
};