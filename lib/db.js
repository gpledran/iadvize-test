'use strict';

var path = require('path');
var pg = require('pg');
var config = require(path.join(__dirname, 'config'));
var dbEnv = 'default';

module.exports = function (forceTest) {
  process.argv.forEach(function (arg, i) {
    if(arg === '--test') {
      dbEnv = 'test';
    }
  });

  if(forceTest) { dbEnv = 'test'; }

  // Connect Postgres
  var connectionString = 'postgres://' +
    ((config[dbEnv].username !== '' && config[dbEnv].password !== '') ? (config[dbEnv].username + ':' + config[dbEnv].password + '@') : '') +
    'localhost/' + config[dbEnv].dbname;

  var db = new pg.Client(connectionString);
  db.connect();

  return db;

};
