var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/login', function (req, res) {
	//TODO: Return login view
});

router.get('/register', function (req, res) {
	//TODO: Return register view
});

router.post('/register', function (req, res) {
	//TODO: Process registering
});

router.get('/building', function (req, res) {
	//TODO: Return building metadata
});

router.get('/zombie', function (req, res) {
	//TODO: Return zombie metadata
});

module.exports = router;
