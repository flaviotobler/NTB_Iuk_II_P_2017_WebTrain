//lode required modules
var express = require('express');
var app = express();
var request = require('request');
var pfio = require("piface");
var url = require("url");

//initialize GPIO
pfio.init();
//set starting position
pfio.digital_write(0, 1);
pfio.digital_write(0, 0);
pfio.digital_write(1, 0);

var state=0;

/* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });

/*
If the links button is pressed on the homepage, the homepage will send a /links message,
then the first relay on the piface is switched on and off again after a short period of time.
*/
app.post('/innen', function (req, res)
		{
			console.log("Button innen pressed"); //Output a debug message
			pfio.digital_write(0, 1); //Turn the switch to the left
			setTimeout(linksaus, 1000); //Turn off the signal after a short period of time
			state=0; //Save state (required when checking status)
			res.status(200).send(""+state); //Answer the server request
		}
	);

/*
If the rechts button is pressed on the homepage, the homepage will send a /rechts message,
then the second relay on the piface is switched on and off again after a short period of time.
*/
app.post('/aussen', function (req, res) 
	 	{
 			console.log("Button aussen pressed"); //Output a debug message
			pfio.digital_write(1, 1); //Turn the switch to the right
			setTimeout(rechtsaus, 1000); //Turn off the signal after a short period of time
			state=1; //Save state (required when checking status)
			res.status(200).send(""+state); //Answer the server request
		}
	);

/*
When the server gets started via nodejs the HTML site weiche.html gets called.
*/

 app.get('/', function (req, res) 
	 	{
			var uri = url.parse(req.url).pathname;
			console.log(uri);
  			res.sendFile(__dirname + '/Webseite/index.html');
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
Is the getState button pressed on the homepage, the homepage will send a /getState message, then the server returns the current status of the switch.
*/
app.post('/getState', function (req, res) 
	 	{
 			console.log("Button getState pressed: " + state); //Output a debug message
			res.status(200).send(""+state); //return a Success status message and the status of the train.
		}
	);

/*
Function to turn of the second relay.
*/
function rechtsaus()
{
	pfio.digital_write(1, 0);
}

/*
Function to turn of the first relay.
*/
function linksaus()
{
	pfio.digital_write(0, 0);
}
