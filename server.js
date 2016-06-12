var express = require('express');
var app = express();
var http = require('http').Server(app);
// var Fitbit = require('fitbit');
var io = require('socket.io')(http);
var socket = io;
// var config = require('./config/app')

// app.use(express.cookieParser());
// app.use(express.session({secret: 'hekdhthigib'}));
// app.listen(3000);

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var google_access_token;
var google_referesh_access_token;

// var WebSocketServer = require('ws').Server;

// var port = 8888; 

// var wss = new WebSocketServer({port: port});

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, res) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  console.log(credentials.web.redirect_uris);
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, res);
    }
  });
}

function getNewToken(oauth2Client, callback, res) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, res);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function listEvents(auth, res) {
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {i
      var data = [];
      console.log('Upcoming 10 events:');
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        console.log(event);
        var start = event.start.dateTime || event.start.date;
        data.push( {"name": event['summary'], "start": event['start']['dateTime'], "end": event['end']['dateTime']});
    }
      var result = {"action": "calendar", "data" : data};
        socket.emit('message', result);
        res.send(JSON.stringify(result));
    }
  });
}





// wss.on('connection', function(ws) {
//     ws.on('message', function(message) {
//         console.log('received: %s', message);
//         ws.send('echo: ' + message);
//     });
//     ws.send('connected');
// });
 
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));


app.get('/googleauth', function(req, res){
        fs.readFile('client_secret.json', function processClientSecrets(err, content) {
          if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
          }
          console.log(JSON.parse(content))
          // Authorize a client with the loaded credentials, then call the
          // Google Calendar API.
          authorize(JSON.parse(content), listEvents, res);
        });
});
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
	socket.emit('message', result);
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
	socket.emit('message', result);
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
	socket.emit('message', result);
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
	socket.emit('message', result);
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

