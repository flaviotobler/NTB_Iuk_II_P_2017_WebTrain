//benötigte Module laden
var express = require('express');
var app = express();
var request = require('request');
var pfio = require("piface");
var state = 0;

//GPIO initialisieren
pfio.init();

/*
Wird der Button start gedrückt auf der Homepage sendet dieser ein /start, mit einem wert in diesem Fall eine 0,1 (0->port, 1-> status).
*/
app.post('/start', function (req, res)
		{
			console.log("Button Start pressed"); //Debug-Meldung ausgeben
			pfio.digital_write(0, 1); //Zug starten
			state=1; //Zustand abspeichern (benoetigt bei der Abfrage)
			res.status(200).send(""+state); //Server-Request beantworten
		}
	);

/*
Wird der Button stop gedrückt auf der Homepage geschehen dieselben Schritte wie beim Drücken auf Button start
In diesem ändert die Variable state auf 0 und der Port wird auf low gesetzt
*/

app.post('/stop', function (req, res) {
 	console.log("Button Stop pressed");
	pfio.digital_write(0, 0);
	state=0;
	res.status(200).send(""+state);
});

//Wird der Server gestartet mittel node Zugindex wird die HTML Seite Zugindex.html aufgerufen

 app.get('/', function (req, res) {
  res.sendFile(__dirname + '/Zugindex.html');
});

//Die Seite ist auf dem Port 3000 aufzurufen und zeigt dies auf dem Terminal
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.post('/getState', function (req, res) {
 	console.log("Button getState pressed: " + state);
	
	res.status(200).send(""+state);

});