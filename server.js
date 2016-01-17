var express = require('express');
var cors = require('cors');
var q = require('q');
var request = require('request');
var app = express();

//static
app.use(express.static(__dirname + "/src/"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(cors());

//create server
var server = app.listen(process.env.PORT || 8000, function () {
	var host = "127.0.0.1";
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

app.io = require('socket.io')(server);

app.io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
      console.log('user disconnected');
  });
});

app.io.on('connection', function(socket) {

  socket.on('name', function(data) {
    console.log('name' + data);
  });

  socket.on('usernames', function(data) {
    var name = data.name;

    console.log('received message on usernames ' + data.name);
    var promises = [];
  	for (site in urls) {
  		promises.push(query_url(urls[site], name, socket));
  	}
    q.all(promises).then(function() {
			socket.emit('name', {'username': 'finished'});
		});
  });
});

urls = {
  "reddit":  {
		url: "https://www.reddit.com/user/",
		protocol: 'https',
	},
  "twitter":  {
		url: "https://www.twitter.com/",
		protocol: 'https',
	},
  "instagram":  {
		url: "https://www.instagram.com/",
		protocol: 'https',
	},
  "youtube":  {
		url: "https://www.youtube.com/",
		protocol: 'https',
	},
  "imgur": {
		url: "https://www.imgur.com/",
		protocol: 'https',
	},
  "pornhub": {
		url: "http://www.pornhub.com/users/",
		protocol: 'http',
	},
  "xvideos": {
		url: "http://www.xvideos.com/profiles/",
		protocol: 'http',
	},
  "xhamster": {
		url: "http://xhamster.com/user/",
		protocol: 'http',
	},
  "pinterest": {
		url: "https://www.pinterest.com/",
		protocol: 'https',
	},
  "google+": {
		url: "https://plus.google.com/+",
		protocol: 'https',
	},
  "flickr": {
		url: "https://www.flickr.com/photos/",
		protocol: 'https',
	},
}

//routes
app.get('/', function(req, res) {
  res.sendFile('./src/index.html');
});

// function that returns promises to handle the urls
var query_url = function(site, name, socket) {
  var deferred = q.defer();
	console.log(site);
  request(site.url + name, {timeout: 2000}, function(error, response, body) {
  	if (!error && response.statusCode == 200) {
      console.log('emitting ' + site.url + name);
      socket.emit('name', {'username': site.url + name})
  		deferred.resolve();
  	} else {
  		deferred.resolve();
  	}
  });
  return deferred.promise;
};
