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
		// models.Zombie.bulkCreate(req.body.zombies);
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

router.get('/new/game', function(req, res){
  // extract our sequelize connection from the models object, to avoid confusion
var game;
var sequelizeConnection = models.sequelize

// We run this query so that we can drop our tables even though they have foreign keys
sequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0')

// make our tables
// note: force:true drops the table if it already exists
.then(function(){
	return sequelizeConnection.sync({force: true})
})
// only when those tables are made, do we want to run the next set of functions

// SOLUTION FOR THE UNIFORM OBJECT
.then(function(){
	// first, we create the uniform
	return models.Game.create(
		{
			jwt: "erfgkmnwerkfghkaewfh;q3ejhkqeyut",
		},
		// the second object in our 'create' call: options
		{
			// We need to 'include' the uniform and store models.
			// Otherwise, Sequelize won't know which fields to enter into which tables.
			include: [models.Player]
		}
	)
	// return models.Player.create({
	// 			name: 'Rick Grimes',
	// 			picture: 'www.google.com',
  //       description: 'Bad to the bone.',
  //       hp: 10,
  //       ap: 10
	// 		})
	.then(function(game){
		// then we give it to brad
		// return newGame.setPlayer(player);
		return models.Player.create({
					name: 'Rick Grimes',
					picture: 'www.google.com',
	        description: 'Bad to the bone.',
	        hp: 10,
	        ap: 10
				})
		// return models.Game.create(
		// 	{
		// 		jwt: "erfgkmnwerkfghkaewfh;q3ejhkqeyut",
		// 	},
		// 	// the second object in our 'create' call: options
		// 	{
		// 		// We need to 'include' the uniform and store models.
		// 		// Otherwise, Sequelize won't know which fields to enter into which tables.
		// 		include: [models.Player]
		// 	}
		// )
		// We're going to save the manager to our brad variable, so you can give him a uniform
		.then(function(player){
			return game.setPlayer(player)

	})
})

});

module.exports = router;