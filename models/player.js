'use strict';
module.exports = function(sequelize, DataTypes) {
  var Player = sequelize.define('Player', {
    name: DataTypes.STRING,
    hp: DataTypes.INTEGER,
    ap: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        //
      }
    }
  });
  return Player;
};
