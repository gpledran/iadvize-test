var expect = require("chai").expect;
var should = require("chai").should;
var request = require('supertest');
var api = request('http://localhost:3000');

describe("Unit testing API", function() {

  describe("#/api/posts", function() {

    it('- should GET posts', function(done){
      api.get('/api/posts')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          var data = JSON.parse(res.text);
          expect(data).to.have.property("posts");
          expect(data.posts).to.not.equal(null);
          expect(data).to.have.property("count");
          expect(data.count).to.not.equal(null);
          var post = data.posts[0];
          expect(post).to.have.property("content");
          expect(post.content).to.not.equal(null);
          expect(post).to.have.property("author");
          expect(post.author).to.not.equal(null);
          expect(post).to.have.property("date");
          expect(post.date).to.not.equal(null);
          done();
        });
    });

    it('- should GET a post by id 1', function(done){
      api.get('/api/posts/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          var data = JSON.parse(res.text);
          expect(data).to.have.property("post");
          expect(data.post).to.not.equal(null);
          var post = data.post[0];
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

});
