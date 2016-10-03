var orm = require('../config/orm.js');

var burger = {
  selectAll: function(cb) {
    orm.selectAll(function(result){
      cb(result);
    });
  }
};
// create the code that will call the ORM functions using burger specific input for the ORM.
// orm.selectAll();
// orm.insertOne();
// orm.updateOne();
//export this file.

module.exports = burger;
