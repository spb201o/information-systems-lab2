var pg = require('pg-promise')({});

var db = function*(next) {
  this.db = pg('postgres://localhost/scattergather');
  yield next;
};

module.exports = db;
