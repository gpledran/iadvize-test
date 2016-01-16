'use strict';

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var app = express();
var server = http.createServer(app);
var routes = require(path.join(__dirname, 'routes'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', routes);

// Catch 404
app.use(function(req, res, next) {
  res.status(404).send('Not found');
});

// Error handler : print stacktrace
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message);
});

server.listen(3000, function () {
  console.log('Listening at http://localhost:3000');
});
