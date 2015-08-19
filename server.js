var express = require('express');
var cors = require('cors');
var http = require('http');
var app = express();

//static
app.use(express.static(__dirname + '/src/'));
app.use(cors());

urls = {
	"reddit": "http://www.reddit.com/user/",
	"twitter": "http://twitter.com/",
	"instagram": "http://instagram.com/",
	"facebook": "http://facebook.com/",
	"youtube": "http://youtube.com/",
	"imgur": "http://imgur.com/"
}
//routes
app.get('/', function(req, res) {
	res.sendFile('./src/index.html');
});

//TODO: either return a promise, or use Futures.sequence to make it synchronous.
app.get('/api/get_hits', function(req, res) {
	console.log(req.query.user);
	name = req.query.user;
	var hits = [];
  for (url in urls) {
		urls[url] += name;
    http.get(urls[url], function(response) {
      if (response.statusCode == 200) {
        hits.push(urls[url]);
      }
    })
  }
	res.send(hits);
});

//create server
var server = app.listen(8000, function () {
	var host = "127.0.0.1";
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
