//benötigte Module laden
/*pw.js einbinden, in diesem File sind passwort und ip adresse der Netzwerkkamera hinterlegt
zusätzlich auch der PORT für den server*/
const PW = require('./pw.js');

/*verwendete module werden eingebunden*/
var express = require('express');
var app = express();
var request = require('request');
var MjpegProxy = require('mjpeg-proxy').MjpegProxy;

/* NEW */
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

var bodyParser = require('body-parser'); //um JSON Daten von POST request zu parsen
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data


var queue = [];
var director; //session id der session, welche die Kontrolle über die kamera hat


/*über das hinterlegte passwort und die IP Adresse wird die Url um der Kamera Befehle zu schicken gebildet */
var baseUrl = 'http://'+ PW.USERNAME +':'+ PW.PASSWORD +'@'+ PW.CAMERAIP +'';

/*dateien im Ordner 'public' werden als statische web dateien zur verfügung gestellt
public/ ist das root verzeichnis für die webseite, bei aufruf des nodejs servers über
einen Browser wird public/index.html angezeigt	*/
app.use(express.static('public'));

var prevTime = Date.now();
var actTime = 0;
var timeFlag = false;
var postData = {timePassed: false, postText: "", timeLeft: 0};

var zoom = 1;
camAction("zoom="+zoom+"");
/* http POST request werden vom node.js server verarbeitet in den folgenden express funktionen
wenn ein POST request die jeweilige URL ausgeführt wird, z.B. http://URLNODEJS/up wird die dazugehörige Funktion in app.post('/up, function(){} ausgeführt  */
/* app.post('/up', function (req, res) {
    doAction('start', function(httpRes){
        res.send(httpRes);
    })
});

app.post('/down', function (req, res) {
 	console.log("Button Down pressed");
    if(checkPassedTime()){
        camAction("move=down");
        postData.timePassed = true;
        postData.postText = "action successfully executed";
    }else{
        postData.timePassed = false;
        postData.postText = "not enough time passed";
    }
    res.send(postData);
});

app.post('/left', function (req, res) {
 	console.log("Button Left pressed");
    if(checkPassedTime()){
        camAction("move=left");
        postData.timePassed = true;
        postData.postText = "action successfully executed";
    }else{
        postData.timePassed = false;
        postData.postText = "not enough time passed";
    }
    res.send(postData);
});

app.post('/right', function (req, res) {
 	console.log("Button Right pressed");
    if(checkPassedTime()){
        camAction("move=right");
        postData.timePassed = true;
        postData.postText = "action successfully executed";
    }else{
        postData.timePassed = false;
        postData.postText = "not enough time passed";
    }
    res.send(postData);
  
});

app.post('/pos1', function (req, res) {
 	console.log("Button Pos1 pressed");
    
    if(checkPassedTime()){
        //mit pan= kann eine absolute pan (x) Position angegeben werden
        camAction("pan="+PW.POS1.x);
        //mit pan= kann eine absolute tilt (y) Position angegeben werden
        camAction("tilt="+PW.POS1.y);
        //code for focus zoom etc.
        postData.timePassed = true;
        postData.postText = "action successfully executed";
    }else{
        postData.timePassed = false;
        postData.postText = "not enough time passed";
    }
    res.send(postData);
  
});

app.post('/pos2', function (req, res) {
 	console.log("Button Pos2 pressed");
     if(checkPassedTime()){
        //mit pan= kann eine absolute pan (x) Position angegeben werden
        camAction("pan="+PW.POS2.x);
        //mit pan= kann eine absolute tilt (y) Position angegeben werden
        camAction("tilt="+PW.POS2.y);
        //code for focus zoom etc.
        postData.timePassed = true;
        postData.postText = "action successfully executed";
    }else{
        postData.timePassed = false;
        postData.postText = "not enough time passed";
    }
    res.send(postData);
  
}); */

app.get('/test', function (req, res) {
    
    getPosition(function(result){
        res.send(result);
        
    });  
  
});

//Zugsteuerung
//Request müssen zuerst an einen weiteren Raspberry pi weitergegeben werden. die zurückgegeben response wird dann an den Client geschickt
/* app.post('/start', function (req, res){
    doMovement('start');
    res.send("Befehl gesendet");
}); */

/* app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
}); */

//video stream über mjpeg proxy einbinden unter url /mjpg/video.mjpg
app.get('/video.mjpg', new MjpegProxy(baseUrl +'/mjpg/video.mjpg').proxyRequest);


//exress server starten auf gewähltem Port
app.listen(PW.PORT, function () {
  console.log('Example app listening on port 3000!');
});

//üer die vordefinierte url und die verfügbaren kommandos können auf der Kamera aktionen ausgeführt werden
function camAction(param){
    request(baseUrl +'/axis-cgi/com/ptz.cgi?' + param + '', function(error){
        	if(error){
			console.log('Error', error);
		}
	});
}

function getPosition(callback){
    var actPos = {};
    //asynchroner request, deshalb kann pos nicht ala rückgabewert übergeben werden!, deshalb mit callback function realisiert
    request(""+baseUrl+"/axis-cgi/com/ptz.cgi?query=position", function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if(response.statusCode == 200){   
        
        var temp1 = body.replace(/(?:\r\n|\r|\n)/g,'=');
        var spl = temp1.split('=');
        //console.log(spl);
        //gibt array gemäss folgendem array aus:  ['pan','121.8465','tilt','-2.1260','zoom','1','autofocus','on','autoiris','on','' ]
        actPos = {
            x: spl[1],
            y: spl[3],
            zoom: spl[5],
            af: spl[7],
            ai: spl[9]
        };
        console.log(actPos);
        callback(actPos);
        
    }
        
    });
    
}

//kann entfernt werden, alte warteschlange
/*function checkPassedTime(){
    timeFlag = false;
    actTime = Date.now();
	if(actTime - prevTime > 5000 ){
		timeFlag = true;
        //zeit nur zurücksetzen wen der Befehl auch ausgeführt werden kann
        prevTime = actTime;
	}else{
        console.log("zu kurz");
    }
	
	
    return timeFlag;
} */


/* NEW TO ADD */

//nach einer Vorgegeben Zeit, wierd die Funktion shiftQueue aufgerufen, die alle CLients in der Warteschlange um eins schiebt
setInterval(shiftQueue, PW.WAITINGTIME); //Zeit in Millisekunden nach der Die Abstimmung fertig ist

var lastShiftTime = Date.now();    
//session.id ist eine einzigaritge id für jede session. So können clients identifiziert werden und auseinander gehalten werden, mit res.status() können http statuscodes als response mitgeschickt werden

//die warteschlange wird um eins verschoben, falls die Warteschlange leer ist, bleibt der director derselbe
function shiftQueue(){
    if(queue.length > 0){
        director = queue[0];
        queue.shift();
    }else{
        //director bleibt bestehen, so hat er die kontrolle so lange bis ein andere client sich für die Warteschlange registriert
        console.log("Time is up but nobody registered, director remains the same");
    }
    lastShiftTime = Date.now();
    //console.log('Last shift time' + lastShiftTime);
}

//funktion, um die verbleibende Zeit bis zum nächsten Warteschalngenwechsel aufzurufen
app.get('/timeRemaining', function(req, res){
    //console.log(Date.now() - lastShiftTime);
    res.send((PW.WAITINGTIME - (Date.now() - lastShiftTime)).toString());
});





/*zum testen, kann wieder entfernt werden*/
app.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   }else{
      req.session.page_views = 1;
      res.send("successfully registered for queue");
   }
});



//Funktion, damit vom Client die Aktuelle Position in der Warteschlange aufgerufen werden kann.
app.get('/queuePos', function(req, res){
    console.log(queue.indexOf(req.session.id));
    if(req.session.id == director){
        res.send("youre director");
    }else if(queue.indexOf(req.session.id)  >= 0){
            res.send(queue.indexOf(req.session.id).toString());  //Findet den index der ausgewählten session, die richtige position zurückgegeben wird
        }else{
          res.send("not in queue");
        }
});



//Client registriert sich in der Warteschlange, mittels SessionID wird der CLient eindeutig identifiziert. Falls der Client bereits in der
//Warteschlange ist, wir dr Vorgang abgebrochen, da jeder CLient nur einmal registriert sein kann.
app.post('/register', function(req, res){
    console.log(req.session.id);
    if(queue.indexOf(req.session.id)  >= 0){
        res.status(500).send('Bereits registriert in der Warteschlange');
        console.log(queue);
      }else if(req.session.id == director){
        res.send('Kann nicht registrieren, sie haben bereits die Kontrolle');
        
      }else{
        var queuePos = queue.push(req.session.id);
        res.status(200).send('Erfolgreich registriert, du bist auf Position ' + queuePos);
        console.log(queue);
        }
});

app.get('/waitingTime', function(req, res){
    res.send(PW.WAITINGTIME.toString());
});



app.post('/getStateWeiche', function(req, res){
        request.post({url:'http://10.0.0.101:3000/getState'}, function(error, httpResponse, body) {
        //console.log(body);
        //console.log(body.body);
        res.send(200, body);
    });
});

app.post('/getStateZug', function(req, res){
        request.post({url:'http://10.0.0.102:3000/getState'}, function(error, httpResponse, body) {
        res.send(200, body);
    });
});
app.post('/getStateSignal', function(req, res){
    //console.log("getstate");
        request.post({url:'http://10.0.0.100:9000/getState'}, function(error, httpResponse, body) {
            //console.log(body);
        res.send(200, body);
    });
});


//gewünschte Aktion des CLients. Es wird überprüft ob der CLient auch Berechtigt ist, die Aktion auszüführen
app.post('/action', upload.array(), function(req, res){
    if(req.session.id==director){
        console.log(req.body.movement);
        switch(req.body.movement){
            //für actions auf diesem server
            case 'up':
            case 'down':
            case 'left':
            case 'right':
            case 'pos1':
            case 'pos2': 
            case 'zoom+':
            case 'zoom-':
                doAction(req.body.movement, function(data){
                    res.send(data);  
                });

            break;
            //für actions auf den anderen Raspis
            case 'start':
            case 'stop':
            case 'aussen':
            case 'innen':
            case 'signalein':
            case 'signalaus':
                doAction(req.body.movement, function(status, body){
                    res.send(status, body);
                })
            break;
        }
        

        
    }
    else{
        res.send("Du bist nicht an der Reihe, registrere dich für die Warteschlange!");
    }
    
});
//falls die prüfung ob der CLient berechtig ist besteht, wird die Funktion aufgerufen, 
//mittels mitgegbenen POST Parametern, wird die gewünschte Aktion ausgeführt
function doAction(movement, callback){
    switch(movement){
        //zug start stop, weichensteuerung etc requests werden an einen anderen Raspi weitergeleitet. über callback funktionen, kan die rsponse wieder an den client geschickt werden
        case "start":
                request.post({url:'http://10.0.0.102:3000/start'}, function(err, httpResponse, body) {
                    if (err) {
                    console.log('operation failed:', err);
                    }
                    /*console.log("http response:");
                    console.log(httpResponse);
                    console.log("http body:");
                    console.log(body);*/
                    callback(200, body);
                });
            break;
        case "stop":
                request.post({url:'http://10.0.0.102:3000/stop'}, function(err, httpResponse, body) {
                    
                    if (err) {
                    console.log('operation failed:', err);
                    }
                    callback(200, body);
                });
            break;
        case "aussen":
            console.log("vor post");
                request.post({url:'http://10.0.0.101:3000/aussen'}, function(err, httpResponse, body) {
                    console.log('aussen sent');
                    if (err) {
                    console.log('operation failed:', err);
                    }
                    callback(200, body);
                });
            break;
        case "innen":
            console.log("vor post");
                request.post({url:'http://10.0.0.101:3000/innen'}, function(err, httpResponse, body) {
                    console.log('innen sent');
                    if (err) {
                    console.log('operation failed:', err);
                    }
                    callback(200, body);
                });
            break;
        case "signalaus":
                request.post({url:'http://10.0.0.100:9000/frei'}, function(err, httpResponse, body) {
                    if (err) {
                    console.log('operation failed:', err);
                    }
                    callback(200, body);
                });
            break;
        case "signalein":
                request.post({url:'http://10.0.0.100:9000/sperrung'}, function(err, httpResponse, body) {
                    if (err) {
                    console.log('operation failed:', err);
                    }
                    callback(200, body);
                });
            break;
        case "up":
            camAction("move=up");
            callback("erfolgreich");
        break;
        
        case "down":
            camAction("move=down");
            callback("erfolgreich");
        break;
            
        case "left":
            camAction("move=left");
            callback("erfolgreich");

        break;
            
        case "right":
            camAction("move=right");
            callback("erfolgreich");

        break;
        case "zoom+":
            if(zoom>=7500){
                zoom = 7500;
                camAction("zoom="+(zoom)+"");
            }else{
                zoom = zoom + 500;
                camAction("zoom="+(zoom)+""); 
            }
            callback("erfolgreich");
        break;
        case "zoom-":
            if(zoom<500){
                zoom = 1;
                camAction("zoom="+(zoom)+"");
            }else{
                zoom = zoom - 500;
                camAction("zoom="+(zoom)+""); 
            }
            
            callback("erfolgreich");
        break;
        case "pos1":
            //mit pan= kann eine absolute pan (x) Position angegeben werden
            camAction("pan="+PW.POS1.x);
            //mit tilt= kann eine absolute tilt (y) Position angegeben werden
            camAction("tilt="+PW.POS1.y);
            //code für focus zoom etc.
            callback("erfolgreich");

        break;
        case "pos2":
            //mit pan= kann eine absolute pan (x) Position angegeben werden
            camAction("pan="+PW.POS2.x);
            //mit tilt= kann eine absolute tilt (y) Position angegeben werden
            camAction("tilt="+PW.POS2.y);
            //code für focus zoom etc.
            callback("erfolgreich");

        break;
              
    }
    
}
