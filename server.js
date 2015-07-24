var express = require('express');
var app = express();

//static
app.use(express.static(__dirname + '/src/'));    

//routes
app.get('*', function(req, res) {
	res.sendFile('./src/index.html');
});


//create server
var server = app.listen(8000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
