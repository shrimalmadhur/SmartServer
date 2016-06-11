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

// REST call for getting activity
app.get('/activity', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	var result = {
		steps: 5054,
		miles: 4.5,
		calories: 2222,
		floors: 10,
		active_minutes: 45
	};
    res.send(JSON.stringify(result));
});

// REST call for getting frinds
app.get('/friends', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	
	var result = {
		data: [
			{
				name: "Ambuj",
				steps: 4090,
				miles: 4.5
			},
			{
				name: "Suar",
				steps: 5490,
				miles: 5.5
			}
		]
	};
    res.send(JSON.stringify(result));
});

// REST call for getting calendar
app.get('/calendar', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	
	var result = {
		data: [
			{
				name: "Meeting with Bhawna",
				start: "09:00",
				end: "10:00",

			},
			{
				name: "All hands",
				start: "11:00",
				end: "12:00",

			}
		]
	};
    res.send(JSON.stringify(result));
});

// REST call for getting best route
app.get('/route', function(req, res){
	res.setHeader('Content-Type', 'application/json');
    var result = {
		data: [
			{
				start_point: "140 Pasito Terrace",
				end_point: "1 Infinite Loop, Cupertino",
				distance: 5.4,
				time: 44

			},
			{
				start_point: "140 Pasito Terrace",
				end_point: "1 Infinite Loop, Cupertino",
				distance: 6.4,
				time: 50

			},
			{
				start_point: "140 Pasito Terrace",
				end_point: "1 Infinite Loop, Cupertino",
				distance: 3.4,
				time: 45

			}
		]
	};
    res.send(JSON.stringify(result));
});


http.listen(80, function(){
   console.log('listening on *:80');
});

