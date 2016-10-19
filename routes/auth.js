var express 	= require('express'),
	passport	= require('passport'),
	router 		= express.Router();

router.post('/login', 
	passport.authenticate('local', {
		failureRedirect: '/error'
	}),
	function (req, res) {
		res.redirect('/users');
	}
);



// router.post('/login', function(req, res){
// 	res.redirect('/characters');
// });

module.exports = router;