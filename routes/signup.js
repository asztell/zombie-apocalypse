var express 	= require('express'),
	router 		= express.Router();

router.get('/signup', function(req, res) {
    //TODO: Process registering
    res.render('/signup');
});


router.post('/signup', function(req, res) {
	res.redirect('/characters');
});

module.exports = router;