'use strict';

var Character = require('../models')["Character"];

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Character.bulkCreate([
      {
        name: 'Rick Grimes',
        picture: 'www.google.com',
        description: 'Bad to the bone.',
        hp: 100,
        ap: 20
      },
      {
        name: 'Maggie Greene',
        picture: 'www.google.com',
        description: 'Bad to the bone.',
        hp: 100,
        ap: 20
      },
      {
        name: 'Daryl Dixon',
        picture: 'www.google.com',
        description: 'Bad to the bone.',
        hp: 100,
        ap: 20
      },
      {
        name: 'Glenn Rhee',
        picture: 'www.google.com',
        description: 'Bad to the bone.',
        hp: 100,
        ap: 20
      }
    ])
  },

  down: function (queryInterface, Sequelize) {
    // remove all instances of these fandoms from the table
    return Character.destroy({where:{username: [
        'Rick Grimes',
        'Maggie Greene',
        'Daryl Dixon',
        'Glenn Rhee'
    ]}})
  }
}
