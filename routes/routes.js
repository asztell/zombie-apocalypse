var express = require('express');
var router = express.Router();
var models = require('../models');
var characters = require('../data/characters.js')

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/error', function(req, res) {
    res.render('error');
});

// router.get('/signup', function(req, res) {
//     res.render('signup');
// });

// router.get('/login', function(req, res) {
//     res.render('login');
// });

router.get('/characters', function(req, res) {
    var hbsObj = {
        characters: characters
    };
    res.render('characters', hbsObj);
});

router.get('/auth/login', function(req, res) {
    //TODO: Process registering
    res.render('login');
});

router.get('/game', function(req, res) {
    res.render('game', {
        title: 'game',
        layout: 'gamelayout'
    });
});


router.get('/game/over', function(req, res){
    res.render('gameover');
});


module.exports = router;