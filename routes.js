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

router.get('/api/posts', function(req, res) {

  // Grab URL parameters
  var where = '1=1 ';
  if (req.query.author !== null && req.query.author !== undefined) {
    where += "AND author ='" + req.query.author + "'";
    console.log(req.query.author);
  }

  var result = {
    posts : [],
    count : 0
  };

  // Select Posts and push into results
  var query = client.query('SELECT * FROM Post ORDER BY id ASC;');
  query.on('row', function(row) {
    row.date = moment(row.date).format('YYYY-MM-DD HH:mm:ss');
    result.posts.push(row);
  });
  result.count = result.posts.length;

  // Return results
  query.on('end', function() {
    return res.json(result);
  });
});

router.get('/api/posts/:id', function(req, res) {

  // Grab id from the URL parameters
  var id = req.params.id;

  var result = {
    post : []
  };

  // Get Post
  var query = client.query('SELECT * FROM Post WHERE id=($1)', [id]);
  query.on('row', function(row) {
    row.date = moment(row.date).format('YYYY-MM-DD HH:mm:ss');
    result.post.push(row);
  });

  // Return results
  query.on('end', function() {
    return res.json(result);
  });
});

module.exports = router;
