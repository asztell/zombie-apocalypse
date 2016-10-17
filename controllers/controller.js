var express = require('express');
var router = express.Router();
var models = require('../models');
var characters = require('../data/characters.js')

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/characters', function(req, res) {
    var hbsObj = {
        characters: characters
    };
    res.render('characters', hbsObj);
});

router.post('/signup', function(req, res) {
    //TODO: Process registering
});

router.post('/login', function(req, res) {
    //TODO: Process registering
});

router.get('/game', function(req, res) {
    res.render('game', {
        title: 'game',
        layout: 'gamelayout'
    });
});

router.get('/building', function(req, res) {
    //TODO: Return building metadata
});

router.get('/zombie', function(req, res) {
    //TODO: Return zombie metadata
});


router.get('/new/game', function(req, res){
  // extract our sequelize connection from the models object, to avoid confusion
	var game;
	var sequelizeConnection = models.sequelize

	sequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0')

	.then(function(){
		return sequelizeConnection.sync({force: true});
	})
	// only when those tables are made, do we want to run the next set of functions

	// SOLUTION FOR THE UNIFORM OBJECT
	.then(function(){
		// first, we create the uniform
		return models.Game.create(
			{
				jwt: "erfgkmnwerkfghkaewfh;q3ejhkqeyut",
			},
			{
				include: [models.Player]
			}
		)

		.then(function(game){
			return game = game;
		});

	})

	.then(function(){
		// then we give it to brad
		// return newGame.setPlayer(player);
		return models.Player.create({
			name: 'Rick Grimes',
			picture: 'www.google.com',
	        description: 'Bad to the bone.',
	        hp: 10,
	        ap: 10
		})
		.then(function(player){
			return game.setPlayer(player);

		});

	});
});

module.exports = router;