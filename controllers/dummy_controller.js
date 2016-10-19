var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/new/game', function(req, res){
  // extract our sequelize connection from the models object, to avoid confusion
var sequelizeConnection = models.sequelize;

// We run this query so that we can drop our tables even though they have foreign keys
// sequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0')

// make our tables
// note: force:true drops the table if it already exists
.then(function(){
	return sequelizeConnection.sync()
})



// only when those tables are made, do we want to run the next set of functions
.then(function(){

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
	// We're going to save the manager to our brad variable, so you can give him a uniform
	.then(function(game){
		return newGame = game;
	});
})


// SOLUTION FOR THE UNIFORM OBJECT
.then(function(){
	// first, we create the uniform
	return models.Player.create({
				name: 'Rick Grimes',
				picture: 'www.google.com',
        description: 'Bad to the bone.'.
        hp: 10,
        ap: 10
			})
	.then(function(player){
		// then we give it to brad
		return newGame.setPlayer(player);
	})
})


// // Let's create some employees
// .then(function(){
//
// 	// here's mike!
// 	return models.Employee.create({
// 		fullName: "Mike Michaels",
// 		role: "Human Resources",
// 	})
// 	// we chain mike's create with .then, pass his name as an arg,
// 	.then(function(mike){
// 		// then call our manager's addAssociation method.
// 		// sequelize gives him addEmployee (since he hasMany employees)
// 		return brad.addEmployee(mike);
// 	})
// })
//
// // now let's add one more employee, to show that we can associate more than one with brad
// .then(function(){
//
// 	// now, let's create some employees
// 	// here's mike!
// 	return models.Employee.create({
// 		fullName: "Michelle Shelly",
// 		role: "Community Relations",
// 	})
// 	// like last time, we chain a then with michelle passed as the arg
// 	.then(function(michelle){
// 		return brad.addEmployee(michelle);
// 	})
// })


});
