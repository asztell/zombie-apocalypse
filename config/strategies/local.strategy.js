var passport 		= require('passport'),
	LocalStrategy 	= require('passport-local').Strategy;
	db				= require(__dirname+'/db');

module.exports = function () {
	passport.use(new LocalStrategy( function (username, password, done) {
		db.users.findUserByUsername(username, function(err, user) {
			console.log('inside local-strategy');
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			if (user.password != password) { return done(null, false); }
			return done(null, user);
		});
	}));
};