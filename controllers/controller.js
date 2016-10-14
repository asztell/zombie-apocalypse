var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/characters', function(req, res){
	models.Character.findAll().then(function(characters){
		var hbsObj = {characters: characters}
		res.render('characters', hbsObj);
	});
});

router.post('/signup', function (req, res) {
	//TODO: Process registering
});

router.post('/login', function (req, res) {
	//TODO: Process registering
});

router.post('/new/game', function(req, res){
	models.Zombie.bulkCreate(req.body.zombies);
});

router.get('/game', function(req, res){
	res.render('game', { title: 'game', layout: 'gamelayout' });
});

router.get('/building', function (req, res) {
	//TODO: Return building metadata
});

router.get('/zombie', function (req, res) {
	//TODO: Return zombie metadata
});

module.exports = router;
