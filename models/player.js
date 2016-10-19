'use strict';
module.exports = function(sequelize, DataTypes) {
  var Player = sequelize.define('Player', {
    name: DataTypes.STRING,
    hp: DataTypes.INTEGER,
    ap: DataTypes.INTEGER,
    timeAlive: DataTypes.INTEGER,
    zombieKills: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // Player.hasOne(models.Game, {onDelete: 'cascade', hooks: true});
      }
    }
  });
  return Player;
};
