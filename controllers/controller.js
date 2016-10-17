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




router.post('/new/game', function(req, res) {
		console.log('HIT');
    var game;
    var character = req.body;
    var sequelizeConnection = models.sequelize
    sequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0')

    .then(function() {
        return sequelizeConnection.sync({
            force: true
        })
    })


    .then(function() {

        return models.Game.create({
                jwt: "filler",
            },

            {
                include: [models.Player]
            }
        )

        .then(function(game) {

            return models.Player.create(character)

            .then(function(player) {
                return game.setPlayer(player)

            }).then(function(){
							res.send('Test');
						})
        })

    })


});





module.exports = router;
