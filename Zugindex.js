//lode required modules
var express = require('express');
var app = express();
var request = require('request');
var pfio = require("piface");
var state = 0;

//initialize GPIO
pfio.init();

/*
If the start button is pressed on the homepage, the homepage will send a /start message, then the relay on the piface is switched on.
*/
app.post('/start', function (req, res)
		{
			console.log("Button Start pressed"); //Output a debug message
			pfio.digital_write(0, 1); //start the train
			state=1; //Save state (required when checking status)
			res.status(200).send(""+state); //Answer the server request
		}
	);

/*
If the stop button is pressed on the homepage, the homepage will send a /stop message, then the relay on the piface is switched of.
*/

app.post('/stop', function (req, res)
		{
 			console.log("Button Stop pressed"); //Output a debug message
			pfio.digital_write(0, 0); //stop the train
			state=0; //Save state (required when checking status)
			res.status(200).send(""+state); //Answer the server request
		}
);

/*
When the server gets started via nodejs the HTML site Zugindex.html gets called.
*/

 app.get('/', function (req, res) 
	 	{
  			res.sendFile(__dirname + '/Zugindex.html'); 
		}
);

/*
Port 3000 is defined for the server call
*/
app.listen(3000, function () 
	   	{
  			console.log('Example app listening on port 3000!'); //Output a debug message
		}
);

/*
Is the getState button pressed on the homepage, the homepage will send a /getState message, then the server returns the current status of the train.
*/
app.post('/getState', function (req, res) 
	 	{
 			console.log("Button getState pressed: " + state); //Output a debug message
			res.status(200).send(""+state); //return a Success status message and the status of the train.
		}
);
