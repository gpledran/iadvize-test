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
        var p = articleSelector.querySelector('.right_part p:last-child').innerHTML;
        var article = {
          content : articleSelector.querySelector('.fmllink').innerHTML,
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
      if(currentPage < maxPage) {
        currentPage++;
        return getPage();
      }

      console.log(JSON.stringify({ articles : articles }, null, 2));
      phantom.exit();
    });
  });
}

getPage();
