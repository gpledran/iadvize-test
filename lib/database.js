'use strict';

var pg = require('pg');
var path = require('path');
var config = require(path.join(__dirname, 'config'));

var dbEnv = 'default';
process.argv.forEach(function (arg, i) {
  if(arg === '--test') {
    dbEnv = 'test';
  }
});

var connectionString = 'postgres://' +
  ((config[dbEnv].username !== '' && config[dbEnv].password !== '') ? (config[dbEnv].username + ':' + config[dbEnv].password + '@') : '') +
  'localhost/' + config[dbEnv].dbname;

var client = new pg.Client(connectionString);
client.connect();

var query = client.query('CREATE TABLE IF NOT EXISTS Post(id SERIAL PRIMARY KEY, content TEXT not null, author TEXT not null, date DATE not null)');
query.on('end', function() { client.end(); });
