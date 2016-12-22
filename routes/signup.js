//This will be used later for authentication

var express 	= require('express'),
	router 		= express.Router();

router.get('/', function(req, res) {
    res.render('signup');
});


router.post('/', function(req, res) {
	res.redirect('/characters');
});

module.exports = router;
