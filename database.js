var pg = require('pg');
var path = require('path');
var config = require(path.join(__dirname, 'config'));

var connectionString = 'postgres://' +
  ((config.username !== '' && config.password !== '') ? (config.username + ':' + config.password + '@') : '') +
  'localhost/' + config.dbname;

var client = new pg.Client(connectionString);
client.connect();

var query = client.query('CREATE TABLE IF NOT EXISTS Posts(id SERIAL PRIMARY KEY, content TEXT not null, author TEXT not null, date DATE not null)');
query.on('end', function() { client.end(); });
