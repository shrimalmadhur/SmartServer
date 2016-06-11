var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var socket = io;

app.get('/', function(req, res){
	console.log("Defualt URL");
}

// REST call for getting sleep data
app.get('/sleep', function(req, res){

});

// REST call for getting calendar
app.get('/calendar', function(req, res){

});

// REST call for getting best route
app.get('/route', function(req, res){

});

