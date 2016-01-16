'use strict';

var express = require('express');
var moment = require('moment');
var router = express.Router();
var client = require('./lib/db')();

router.post('/api/posts', function(req, res) {

  // Grab data from http request
  var data = req.body.articles;

  var ids         = [];
  var query       = null;
  var valuesIndex = 0;
  var values      = [];
  var queryParams = [];

  data.forEach(function (post) {
    values.push('($' + (++valuesIndex) + ', $' + (++valuesIndex) + ', $' + (++valuesIndex) + ')');
    queryParams.push(post.content);
    queryParams.push(post.author);
    queryParams.push(moment(post.date, 'DD/MM/YYYY'));
  });

  query = client.query('INSERT INTO Post(content, author, date) VALUES' + values.join(',') + ' RETURNING id', queryParams);

  query.on('error', function (err) {
    console.error(err);
    res.status(400);
    res.end('Bad request');
  });

  // Add id to return data
  query.on('row', function (row) {
    ids.push(row.id);
  });

  // Return results
  query.on('end', function() {
    return res.json(ids);
  });
});

/**
 * API GET /api/posts
 * Will return ....
 */
router.get('/api/posts', function(req, res) {

  var result = {
    posts : [],
    count : 0
  };

  var queryText = 'SELECT * FROM Post WHERE 1=1 ';
  var queryParams = [];

  // Grab URL parameters
  if (req.query.author !== null && req.query.author !== undefined) {
    queryParams.push(req.query.author);
    queryText += 'AND author=($' + queryParams.length + ') ';
  }
  if (req.query.from !== null && req.query.from !== undefined && moment(req.query.from, 'YYYY-MM-DD', true).isValid()) {
    queryParams.push(req.query.from);
    queryText += 'AND date >= to_date(($' + queryParams.length + '),\'YYYY-MM-DD\') ';
  }
  if (req.query.to !== null && req.query.to !== undefined && moment(req.query.to, 'YYYY-MM-DD', true).isValid()) {
    queryParams.push(req.query.to);
    queryText += 'AND date <= to_date(($' + queryParams.length + '),\'YYYY-MM-DD\') ';
  }
  queryText += 'ORDER BY id ASC;';

  // Select Posts and push into results
  var query = client.query(queryText, queryParams);

  query.on('error', function (err) {
    console.error(err);
    res.status(400);
    res.end('Bad request');
  });

  query.on('row', function(row) {
    row.date = moment(row.date).format('YYYY-MM-DD HH:mm:ss');
    result.posts.push(row);
  });

  // Return results
  query.on('end', function() {
    result.count = result.posts.length;
    return res.json(result);
  });
});

router.get('/api/posts/:id', function(req, res) {

  // Grab id from the URL parameters
  var id = req.params.id;

  var result = {
    post : {}
  };

  // Get Post
  var query = client.query('SELECT * FROM Post WHERE id=($1)', [id]);

  query.on('error', function (err) {
    console.error(err);
    res.status(400);
    res.end('Bad request');
  });

  query.on('row', function(row) {
    row.date = moment(row.date).format('YYYY-MM-DD HH:mm:ss');
    result.post = row;
  });

  // Return results
  query.on('end', function() {
    return res.json(result);
  });
});

module.exports = router;
