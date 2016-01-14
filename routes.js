var express = require('express');
var moment = require('moment');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var config = require(path.join(__dirname, 'config'));

// Connect Postgres
var connectionString = 'postgres://' +
  ((config.username !== '' && config.password !== '') ? (config.username + ':' + config.password + '@') : '') +
  'localhost/' + config.dbname;

var client = new pg.Client(connectionString);
client.connect();

router.post('/api/posts', function(req, res) {

  // Grab data from http request
  var data = req.body.articles;

  var ids = [];
  var query = null;

  // Insert Posts
  data.forEach(function (post, index) {
    if (index < 200) {
      query = client.query('INSERT INTO Post(content, author, date) values($1, $2, $3) RETURNING id', [post.content, post.author, moment(post.date, 'DD/MM/YYYY')]);

      // Add id to return data
      query.on('row', function (row) {
        ids.push(row.id);
      });
    }
  });

  // Return results
  query.on('end', function() {
    return res.json(ids);
  });
});

module.exports = router;
