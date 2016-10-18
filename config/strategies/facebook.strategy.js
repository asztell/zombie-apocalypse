var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function () {
	passport.use(new FacebookStrategy({
	    clientID: '631067680387474',
	    clientSecret: '9671a5bda4951571b49831dd16808dbc',
	    // callbackURL needs to change when deployed
	    callbackURL: 'http://localhost:3000/auth/facebook/callback',
	    passReqToCallback: true
	  }
	  ,function(req, accessToken, refreshToken, profile, done) {
	    var user = {};

	    user.email = profile.emails[0].value;
	    // user.image = profile.photos.value;
	    user.displayName = profile.displayName;

	    user.facebook = {};
	    user.facebook.id = profile.id;
	    user.facebook.token = token;

	    done(null, user);
	  }
	));
};