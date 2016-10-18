'use strict';
module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define('Game', {
    zombiesKilled: DataTypes.STRING,
    timeAlive: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // Game.hasOne(models.User, {onDelete: 'cascade', hooks: true});
        Game.hasOne(models.Player, {onDelete: 'cascade', hooks: true});
        // Game.hasMany(models.Zombie, {onDelete: 'cascade', hooks: true});
      }
    }
  });
  return Game;
};

// Manager.hasOne(models.Uniform, {onDelete: 'cascade', hooks:true});
// Manager.hasOne(models.Store);
// Manager.hasMany(models.Employee, {onDelete: 'cascade', hooks:true});
