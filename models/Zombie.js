'use strict';
module.exports = function(sequelize, DataTypes) {
  var Zombie = sequelize.define('Zombie', {
    name: DataTypes.STRING,
    hp: DataTypes.INTEGER,
    ap: DataTypes.INTEGER,
    isAlive: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Zombie;
};