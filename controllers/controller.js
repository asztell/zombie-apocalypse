var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/characters', function(req, res){

	//SC need something like this to display characters
	//We could probably use Sequelize for this and make a character model
	var queryString = 'SELECT * FROM characters';
	connection.query(queryString, function(err, result){
		if(err) throw err;
		var hbsObj = {characters: result};
		res.render('characters', hbsObj);
	});
});

router.post('/signup', function (req, res) {
	//TODO: Process registering
});

router.post('/login', function (req, res) {
	//TODO: Process registering
});

router.get('/building', function (req, res) {
	//TODO: Return building metadata
});

router.get('/zombie', function (req, res) {
	//TODO: Return zombie metadata
});

module.exports = router;
