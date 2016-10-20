var express 	= require('express'),
	passport	= require('passport'),
	router 		= express.Router();
	
//Will use this later for authentication

// router.post('/login',
// 	passport.authenticate('local', {
// 		failureRedirect: '/error'
// 	}),
// 	function (req, res) {
// 		res.redirect('/users');
// 	}
// );

module.exports = router;
