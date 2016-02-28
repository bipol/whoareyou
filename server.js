
var express = require('express');
var cors = require('cors');
var q = require('q');
var request = require('request');
var urls = require('./urls.json')

var app = express();
var onConnection = onConnection;
var queryUrl = queryUrl;

//create server
var server = app.listen(process.env.PORT || 8000, function () {
	var host = "127.0.0.1";
	var port = server.address().port;
	console.log('whoareyou listening at http://%s:%s', host, port);
});

//static
app.use(express.static(__dirname + "/src/"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(cors());

app.io = require('socket.io')(server);
app.io.on('connection', onConnection);

//routes
app.get('/', function(req, res) {
  res.sendFile('./src/index.html');
});

function onConnection(socket) {
  socket.on('usernames', function(data) {
    var name = data.name;

    console.log('received message on usernames ' + data.name);
    var promises = [];
  	for (site in urls) {
  		promises.push(queryUrl(urls[site], name, socket));
  	}
    q.all(promises).then(function() {
			socket.emit('name', {'username': 'finished'});
		});
  });
}

function queryUrl(site, name, socket) {
  var deferred = q.defer();
	console.log(site);
  request(site.url + name, {timeout: 2000}, function(error, response, body) {
  	if (!error && response.statusCode == 200) {
      console.log('emitting ' + site.url + name, site.nsfw);
      socket.emit('name', {'username': site.url + name, 'nsfw': site.nsfw})
  		deferred.resolve();
  	} else {
  		deferred.resolve();
  	}
  });
  return deferred.promise;
}
