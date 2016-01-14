var webpage = require('webpage');

var page = null;
var articles = [];

var baseUrl = 'http://www.viedemerde.fr/';

var currentPage = 0;
var maxPage = 15;

function getPage() {
  console.log('** Going to page ' + currentPage);

  if (page !== null) {
    page.close();
  }

  page = webpage.create();

  page.onConsoleMessage = function(msg) {
  };
  page.onError = function (msg, trace) {
  };

  page.open(baseUrl + '?page=' + currentPage, function () {
    console.log('** Page ' + currentPage + ' opened');

    var newArticles = page.evaluate(function () {
      var articles = [];
      Array.prototype.slice.call(document.querySelectorAll('.post.article')).map(function (articleSelector) {
        var p = articleSelector.querySelector('.right_part p:nth-child(2)').innerHTML;

        var content = '';
        Array.prototype.slice.call(articleSelector.querySelectorAll('.fmllink')).map(function (fml) {
          return (content += fml.innerHTML);
        });

        var article = {
          content : content,
          date    : p.substring(3, 13),
          author  : p.substring(p.indexOf('par ') + 4, (p.indexOf(' (') !== -1 ? p.indexOf(' (') : p.length - 1))
        };
        return articles.push(article);
      });
      return articles;
    });

    articles = articles.concat(newArticles);

    console.log('** End of the page ' + currentPage);

    setTimeout(function () {
      if (currentPage < maxPage) {
        currentPage++;
        return getPage();
      }

      postAPI();
    });
  });
}

function postAPI() {
  console.log('** Saving posts in database');

  var api = webpage.create();
  var settings = {
    operation : "POST",
    encoding: "utf8",
    headers : {
      "Content-Type": "application/json"
    },
    data : JSON.stringify({ articles : articles})
  };
  console.log(JSON.stringify({ articles : articles}, null, 2));
  api.open('http://localhost:3000/api/posts', settings, function (status) {
    console.log('** End status : ' + status);
    phantom.exit();
  });
}

getPage();
