"use strict";
module.exports = function(sequelize, DataTypes) {
    var Character = sequelize.define("Character", {
        name: DataTypes.STRING,
        picture: DataTypes.STRING,
        description: DataTypes.STRING,
        hp: DataTypes.INTEGER,
        ap: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
        // associations can be defined here
            }
        }
    });
    return Character;
};