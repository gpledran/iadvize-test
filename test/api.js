'use strict';

var expect = require("chai").expect;
var should = require("chai").should;
var request = require('supertest');
var api = request('http://localhost:3000');
var db = require('../lib/db')(true);

describe("Unit testing API", function() {

  beforeEach(function (done) {
    var query = db.query('TRUNCATE TABLE post RESTART IDENTITY');
    query.on('error', function (e) { console.error(e); done(e); });
    query.on('end',   function ()  { done();  });
  });

  describe("/api/posts", function() {

    it('- should GET posts', function(done){
      var query = db.query('INSERT INTO post (content, author, date) VALUES ($1, $2, $3), ($4, $5, $6)',
        ['VDM', 'Author', new Date(), 'VDM2', 'Author2', new Date()]);
      query.on('error', function (e) { console.error(e); done(e); });
      query.on('end', function () {
        api.get('/api/posts')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            var data = JSON.parse(res.text);
            expect(data).to.have.property("posts");
            expect(data.posts).to.not.equal(null);
            expect(data).to.have.property("count");
            expect(data.count).to.not.equal(null);
            expect(data.count).to.equal(2);
            expect(data.posts.length).to.equal(2);
            var post = data.posts[0];
            expect(post).to.have.property("content");
            expect(post.content).to.not.equal(null);
            expect(post.content).to.equal('VDM');
            expect(post).to.have.property("author");
            expect(post.author).to.not.equal(null);
            expect(post.author).to.equal("Author");
            expect(post).to.have.property("date");
            expect(post.date).to.not.equal(null);
            post = data.posts[1];
            expect(post).to.have.property("content");
            expect(post.content).to.not.equal(null);
            expect(post.content).to.equal('VDM2');
            expect(post).to.have.property("author");
            expect(post.author).to.not.equal(null);
            expect(post.author).to.equal("Author2");
            expect(post).to.have.property("date");
            expect(post.date).to.not.equal(null);
            done();
          });
      });
    });

    it('- should GET posts search by author', function (done) {
      var query = db.query('INSERT INTO post (content, author, date) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
        ['VDM', 'Author', new Date(), 'VDM2', 'Author2', new Date(), 'VDM3', 'Author', new Date()]);
      query.on('error', function (e) { console.error(e); done(e); });
      query.on('end', function () {
        api.get('/api/posts?author=Author')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            var data = JSON.parse(res.text);
            expect(data).to.have.property("posts");
            expect(data.posts).to.not.equal(null);
            expect(data).to.have.property("count");
            expect(data.count).to.not.equal(null);
            expect(data.count).to.equal(2);
            expect(data.posts.length).to.equal(2);
            data.posts.forEach(function (post) {
              expect(post).to.have.property("author");
              expect(post.author).to.not.equal(null);
              expect(post.author).to.equal("Author");
            });
            done();
          });
      });
    });

    it('- should GET posts search by date from', function (done) {
      var query = db.query('INSERT INTO post (content, author, date) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
        ['VDM', 'Author', new Date('2016', '00', '15'), 'VDM2', 'Author2', new Date('2016', '00', '16'), 'VDM3', 'Author', new Date('2016', '00', '17')]);
      query.on('error', function (e) { console.error(e); done(e); });
      query.on('end', function () {
        api.get('/api/posts?from=2016-01-16')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            var data = JSON.parse(res.text);
            expect(data).to.have.property("posts");
            expect(data.posts).to.not.equal(null);
            expect(data).to.have.property("count");
            expect(data.count).to.not.equal(null);
            expect(data.count).to.equal(2);
            expect(data.posts.length).to.equal(2);
            done();
          });
      });
    });

    it('- should GET posts search by date to', function (done) {
      var query = db.query('INSERT INTO post (content, author, date) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
        ['VDM', 'Author', new Date('2016', '00', '15'), 'VDM2', 'Author2', new Date('2016', '00', '16'), 'VDM3', 'Author', new Date('2016', '00', '17')]);
      query.on('error', function (e) { console.error(e); done(e); });
      query.on('end', function () {
        api.get('/api/posts?to=2016-01-15')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            var data = JSON.parse(res.text);
            expect(data).to.have.property("posts");
            expect(data.posts).to.not.equal(null);
            expect(data).to.have.property("count");
            expect(data.count).to.not.equal(null);
            expect(data.count).to.equal(1);
            expect(data.posts.length).to.equal(1);
            done();
          });
      });
    });

    it('- should GET a post by id 1', function(done){
      var query = db.query('INSERT INTO post (content, author, date) VALUES ($1, $2, $3)', ['VDM', 'Author', new Date()]);
      query.on('error', function (e) { console.error(e); done(e); });
      query.on('end', function () {
        api.get('/api/posts/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            var data = JSON.parse(res.text);
            expect(data).to.have.property("post");
            expect(data.post).to.not.equal(null);
            var post = data.post;
            expect(post).to.have.property("content");
            expect(post.content).to.not.equal(null);
            expect(post).to.have.property("author");
            expect(post.author).to.not.equal(null);
            expect(post).to.have.property("date");
            expect(post.date).to.not.equal(null);
            done();
          });
      });
    });

    it('- should GET a post and return an error when id does not exist', function(done){
      api.get('/api/posts/1')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function (err, res) {
          var data = JSON.parse(res.text);
          expect(data).to.have.property("post");
          expect(data.post).to.not.equal(null);
          expect(data.post).to.be.empty; /* jshint ignore:line */
          done();
        });
    });

  });

});
