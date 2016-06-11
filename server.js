var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var socket = io;

// var WebSocketServer = require('ws').Server;

// var port = 8888; 

// var wss = new WebSocketServer({port: port});



// wss.on('connection', function(ws) {
//     ws.on('message', function(message) {
//         console.log('received: %s', message);
//         ws.send('echo: ' + message);
//     });
//     ws.send('connected');
// });
 
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// REST call for getting sleep data
app.get('/', function(req, res){
	res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ action: "default"}));
});

// REST call for getting sleep data
app.get('/sleep', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	
	// get data from fitbit
	var sleepdata = {
		"sleep_duration": 436
	};
	socket.emit('message', sleepdata);

    res.send(JSON.stringify(sleepdata));
});

// REST call for getting calendar
app.get('/calendar', function(req, res){
	res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ action: "calendar"}));
});

// REST call for getting best route
app.get('/route', function(req, res){
	res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ action: "route"}));
});


http.listen(80, function(){
   console.log('listening on *:80');
});

