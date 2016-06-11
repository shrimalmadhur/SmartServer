var express = require('express');
var app = express();
var http = require('http').Server(app);
var Fitbit = require('fitbit');
var io = require('socket.io')(http);
var socket = io;
var config = require('./config/app')

app.use(express.cookieParser());
app.use(express.session({secret: 'hekdhthigib'}));
app.listen(3000);

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var google_access_token;
var google_referesh_access_token;

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
/*
app.get('/', function(req, res){
	res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ action: "default"}));
});
*/
app.get('/google_oauth_callback', function(req, res){
	var code = req.code;
	console.log(code);
	var oauth2Client = new OAuth2('1068057328836-1727i5d1gp73hrf5t6ln48ps42icpogv.apps.googleusercontent.com', '_hI329fYfj1Y8MIrcW8x6fno', 'http:////ec2-54-89-42-141.compute-1.amazonaws.com');
	oauth2Client.getToken(code, function(err, tokens) {
	  // Now tokens contains an access_token and an optional refresh_token. Save them.
	  console.log(tokens);
	  if(!err) {
	    oauth2Client.setCredentials(tokens);
	  }
	});
	res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ action: "default"}));
});


// REST call for getting sleep data
app.get('/sleep', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	// get data from fitbit
	var sleepdata = {
		"action": "sleep",
		"sleep_duration": 436
	};
	socket.emit('message', sleepdata);

    res.send(JSON.stringify(sleepdata));
});

// REST call for getting activity
app.get('/activity', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	var result = {
		"action": "activity",
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
		"action": "friends",
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
		"action": "calendar",
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
    	"action": "route",
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

// // OAuth flow
// app.get('/', function (req, res) {
//   // Create an API client and start authentication via OAuth
//   var client = new Fitbit(config.CONSUMER_KEY, config.CONSUMER_SECRET);

//   client.getRequestToken(function (err, token, tokenSecret) {
//     if (err) {
//       // Take action
//       return;
//     }

//     req.session.oauth = {
//         requestToken: token
//       , requestTokenSecret: tokenSecret
//     };
//     res.redirect(client.authorizeUrl(token));
//   });
// });

// // On return from the authorization
// app.get('/oauth_callback', function (req, res) {
//   var verifier = req.query.oauth_verifier
//     , oauthSettings = req.session.oauth
//     , client = new Fitbit(config.CONSUMER_KEY, config.CONSUMER_SECRET);

//   // Request an access token
//   client.getAccessToken(
//       oauthSettings.requestToken
//     , oauthSettings.requestTokenSecret
//     , verifier
//     , function (err, token, secret) {
//         if (err) {
//           // Take action
//           return;
//         }

//         oauthSettings.accessToken = token;
//         oauthSettings.accessTokenSecret = secret;

//         res.redirect('/stats');
//       }
//   );
// });

// // Display some stats
// app.get('/stats', function (req, res) {
//   client = new Fitbit(
//       config.CONSUMER_KEY
//     , config.CONSUMER_SECRET
//     , { // Now set with access tokens
//           accessToken: req.session.oauth.accessToken
//         , accessTokenSecret: req.session.oauth.accessTokenSecret
//         , unitMeasure: 'en_GB'
//       }
//   );

//   // Fetch todays activities
//   client.getActivities(function (err, activities) {
//     if (err) {
//       // Take action
//       return;
//     }

//     // `activities` is a Resource model
//     res.send('Total steps today: ' + activities.steps());
//   });
// });


http.listen(80, function(){
   console.log('listening on *:80');
});

