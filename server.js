var express = require('express');
var cors = require('cors');
var http = require('https');
var q = require('q');
var app = express();

//static
app.use(express.static(__dirname + '/src/'));
app.use(cors());

urls = {
	"reddit": "https://www.reddit.com/user/",
	"twitter": "https://www.twitter.com/",
	"instagram": "https://www.instagram.com/",
	"youtube": "https://www.youtube.com/",
	"imgur": "https://www.imgur.com/"
}
//routes
app.get('/', function(req, res) {
	res.sendFile('./src/index.html');
});

//TODO: either return a promise, or use Futures.sequence to make it synchronous.

// function that returns promises to handle the urls
var query_url = function(url, name) {
	var deferred = q.defer();
	urls[url] += name;
  http.get(urls[url], function(response) {

		//handle a redirect
	  if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
			http.get(response.headers.location, function(response2) {
		    if (response2.statusCode == 200) {
					deferred.resolve(url);
		    } else {
					deferred.resolve();
				}
			});
		} else {
	    if (response.statusCode == 200) {
				deferred.resolve(url);
	    } else {
				deferred.resolve();
			}
		}

  });
	return deferred.promise;
};

app.get('/api/get_hits', function(req, res) {
	name = req.query.user;
	var promises = [];
	for (url in urls) {
		promises.push(query_url(url, name));
  }
	q.all(promises).then(function(val) {
		res.send(val);
	});
});

//create server
var server = app.listen(8000, function () {
	var host = "127.0.0.1";
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
