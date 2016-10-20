var express = require('express');
var router = express.Router();
var models = require('../models');
var characters = require('../data/characters.js')

router.get('/', function(req, res) {
    res.render('game', {
        title: 'game',
        layout: 'gamelayout'
    });
});

router.post('/new', function(req, res) {
    var game;
    var character = req.body;
    var sequelizeConnection = models.sequelize;
    sequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0')

    .then(function() {
        return sequelizeConnection.sync({
            force: true
        })
    })

    .then(function() {

        return models.Game.create({
            isGameOver: 0
        }, {
            include: [models.Player]
        })

        .then(function(game) {

            return models.Player.create(character)

            .then(function(player) {
                game.setPlayer(player);
                var sendObj = {
                    success: 'Updated Successfully',
                    status: 200,
                    gameID: game.id
                }
                res.end(JSON.stringify(sendObj));
                // res.end('{"success" : "Updated Successfully", "status" : 200}');
            })
        })
    })
})

router.put('/update', function(req, res) {
    models.Player.update({
        ap: req.body.ap,
        hp: req.body.hp,
        zombieKills: req.body.zombieKills,
        timeAlive: req.body.timeAlive
    }, {
        where: {
            GameId: req.body.gameID
        }
    })

    .then(function(result) {
        var sendObj = {
            success: 'Updated Successfully',
            status: 200
        }
        res.end(JSON.stringify(sendObj));
    });
});

router.put('/over', function(req, res) {
    models.Game.update({
        isGameOver: 1
    }, {
        where: {
            id: req.body.gameID
        }
    }).then(function() {
        models.Player.update({
            ap: req.body.ap,
            hp: req.body.hp,
            zombieKills: req.body.zombieKills,
            timeAlive: req.body.timeAlive
        }, {
            where: {
                GameId: req.body.gameID
            }
        })
    }).then(function(result) {
        var sendObj = {
            success: 'Updated Successfully',
            status: 200
        }
        res.end(JSON.stringify(sendObj));
    });
});


module.exports = router;
