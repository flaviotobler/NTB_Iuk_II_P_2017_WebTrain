var waitTime;
var zugState;
var signalState;

$(document).ready(function(){ 
    
    //click events an die button binden, die einen get/post an den nodejs server auslösen

      $('#Register').click(function(){
       $.post("/register", function(data){addInfo(data);}
	   );
});

       $('#button-up').click(function(){
         $.post("/action", {"movement": "up"}, function(data){addInfo(data);}
		 );
});
        $('#button-down').click(function(){
         $.post("/action", {"movement": "down"}, function(data){addInfo(data);}
		 );
});
        $('#button-right').click(function(){
         $.post("/action", {"movement": "right"}, function(data){addInfo(data);}
		 );
});
        $('#button-left').click(function(){
         $.post("/action", {"movement": "left"}, function(data){addInfo(data);}
		 );
});
    
        $('#button-pos1').click(function(){
         $.post("/action", {"movement": "pos1"}, function(data){addInfo(data);}
		 );
});
    
        $('#button-pos2').click(function(){
         $.post("/action", {"movement": "pos2"}, function(data){addInfo(data);}
		 );
});
        $('#button-zoom1').click(function(){
         $.post("/action", {"movement": "zoom+"}, function(data){addInfo(data);}
		 );
});
        $('#button-zoom2').click(function(){
         $.post("/action", {"movement": "zoom-"}, function(data){addInfo(data);}
		 );
});
        $('#button-start-stop').click(function(){
        if(zugState==0){
            $.post("/action", {"movement": "start"}, function(data){addInfo(data)});  
        }else{
            $.post("/action", {"movement": "stop"}, function(data){addInfo(data)});  
        }
         
});

        $('#button-signalanaus').click(function(){
        if(signalState==1){
            $.post("/action", {"movement": "signalaus"}, function(data){addInfo(data);});
        }else{
            $.post("/action", {"movement": "signalein"}, function(data){addInfo(data);});
        }
});
    
    
/*        $('#button-stop').click(function(){
         $.post("/action", {"movement": "stop"}, responseReceivedZug
		 );
});*/
        $('#aussen').click(function(){
         $.post("/action", {"movement": "aussen"}, function(data){addInfo(data);}
		 );
});
        $('#innen').click(function(){
         $.post("/action", {"movement": "innen"}, function(data){addInfo(data);}
		 );
});
    
        $('#button-getpos').click(function(){
         $.get('/test',function(data){
             console.log(data);
         });
		 
		 
}); 
	//click event für momentaufnahme des kamerastreams
	$('#dLink').click('click', function(){
		var c = document.createElement('canvas');
        	var img = document.getElementById('stream');
        	c.width = img.width;
        	c.height = img.height;
        	var ctx = c.getContext('2d');
	

        	ctx.drawImage(img, 0, 0);
    		var dt = c.toDataURL('image/jpeg');
   		$('#dLink').attr('href',dt);
	

	});

}); // document ready closing

  /*document.getElementById('save').onclick = function () {

       
        window.open(c.toDataURL('image/png'));
	window.location.href = img.src.replace('image/png', 'image/octet-stream');
    };*/
	
//die waitingtime (zeit zwischen den wechseln der Warteschlange) wird vom server abgefragt
$.get("/waitingTime", function(wtime){
		waitTime = parseInt(wtime);
	}
);

//jede sekunde wird die verbleibende Zeit geprüft um zu schauen, wie lange es noch dauert, bis der CLient die Kontrolle hat
setInterval(checkTime, 1000);

function checkTime() {
	$.get("/timeRemaining", function(timestring){
		/*console.log("timestring" + timestring);*/
		$.get("/queuePos", function(posstring){
			//falls der CLient bereits in der Warteschlange ist, erscheint eine meldung, falls er bereits die Kontrolle besitzt ebenfalls
            
			/*console.log("pos " + posstring);*/
			if(posstring == "not in queue"){
				/*console.log("Nicht in Warteschleife!");*/
				
				var el = document.getElementById("textQueue");
				el.innerHTML = "Bitte für die Warteschleife registrieren!";
				
			}else if (posstring == "youre director"){
				
				var el = document.getElementById("textQueue");
				el.innerHTML = "Sie haben die Kontrolle!";
				
			}
			else{
				pos = parseInt(posstring);
				time = parseInt(timestring);
				x = time + waitTime * (pos) ;
				xn = Math.round(x/1000);
				var el = document.getElementById("textQueue");
				el.innerHTML = "Zeit bis sie an der Reihe sind: " + xn.toString() + " Sekunden";
			}
	});
		
	});

	
}
function download() {

};


function addError(errorText){
    $('.alert').hide();
    $('p.error-text').html(errorText);
    $('.alert-info').fadeIn();
}

//über ein popup können infos und fehler eingeblendet werden
function addInfo(errorText){
    $('.alert').hide();
    $('p.error-text').html(errorText);
    $('.alert-info').fadeIn();
}


/*  WEICHENSTEUERUNG   */

// AJAX-function-calls for the buttons 

setInterval(checkStatus_send, 1000);
		
function checkStatus_send()
{
    //console.log(signalState);
	$.post('/getStateZug', checkStatusZug);
    $.post('/getStateSignal', checkStatusSignal);
    $.post('/getStateWeiche', checkStatusWeiche);
}
	
function checkStatusZug(data, status)
{
	if("success" == status)
	{
		switch (data)	//Check the received data
				{
					case "0":
					{
                        zugState = 0;
                         console.log('Zug Status 0');
						$('#button-start-stop').css("background-color", "#ed1410");	
						break;
					}
					case "1":
					{
                        zugState = 1;
                        console.log('Zug Status 1');
						$('#button-start-stop').css("background-color", "#56f442");	
						break;
					}
					default:
					{
						console.log("Die Daten sind korrupt!!!");	//Error-message when the server sends false data.
					}
				}
	}
	else
	{
		console.log("Kommunikation zum Server scheisse!!!");	//Error-message when the server-connection failed.
	}
	
}
function checkStatusWeiche(data, status){

    
	if("success" == status)
	{
		switch (data)	//Check the received data
				{
					case "0":
					{
						document.getElementById('bild').setAttribute('src', "images/BahnanlageInnen.svg"); 
						break;
					}
					case "1":
					{
						document.getElementById('bild').setAttribute("src", "images/BahnanlageAussen.svg");	
						break;
					}
					default:
					{
						console.log(data);
                        console.log(status);//Error-message when the server sends false data.
					}
				}
	}
	else
	{
		console.log("Kommunikation zum Server scheisse!!!");	//Error-message when the server-connection failed.
	}
	//setTimeout(checkStatus_send, 1000);	
}
function checkStatusSignal(data, status)
{
	if("success" == status)
	{
		switch (data)	//Check the received data
				{
					case "0":
					{
                        signalState = 0;
                        console.log('Signal Status 0');
                        $('#button-signalanaus').css("background-color", "#56f442");
						//document.getElementById('bild').setAttribute('src', "imgages/BahnanlageInnen.svg"); 
						break;
					}
					case "1":
					{
                        signalState = 1;
                        console.log('Signal Status 1');
                        $('#button-signalanaus').css("background-color", "#ed1410");
						//document.getElementById('bild').setAttribute("src", "imgages/BahnanlageAussen.svg");	
						break;
					}
					default:
					{
						console.log("Die Daten sind korrupt!!!");	//Error-message when the server sends false data.
					}
				}
	}
	else
	{
		console.log("Kommunikation zum Server scheisse!!!");	//Error-message when the server-connection failed.
	}
	//setTimeout(checkStatus_send, 1000);	
}
/*
function aussen() {
    //document.getElementById("innen").visibility = "visible";
	//document.getElementById("bild").setAttribute("src:img/BahnanlageAussen.svg");
	document.getElementById('bild').setAttribute('src', "img/BahnanlageAussen.svg"); 
	//document.getElementById("bild").setAttribute("style","visibility:hidden");
}
	function innen() {
    //document.getElementById("innen").visibility = "visible";
	document.getElementById("bild").setAttribute("src", "img/BahnanlageInnen.svg");
	//document.getElementById("bild").setAttribute("style","visibility:hidden");
}*/


/*   ZUGSTEUERUNG     */

// AJAX-function-calls for the buttons 

		// AJAX Callback-functions 
function responseReceivedZug(data, status)
{
    if("success" == status)		//Check the server-connection
    {
        switch (data)	//Check the received data
        {
            case "0":
            {
                $('#button-start-stop').css("background-color", "#ed1410");	
                console.log("Zug steht.");		//Return the status in a alert-message
               
                break;
            }
            case "1":
            {
                console.log("Zug faehrt.");		//Return the status in a alert-message	
                $('#button-start-stop').css("background-color", "#56f442");	
                break;
            }
            default:
            {
                console.log("Die Daten sind korrupt!!!");	//Error-message when the server sends false data.
            }
        }
    }
    else
    {
        console.log("Kommunikation zum Server scheisse!!!");	//Error-message when the server-connection failed.
    }
}
function responseReceivedWeiche(data, status)
		{
			if("success" == status)		//Check the server-connection
			{
				switch (data)
				{
					case "0":
					{
						console.log("Weiche innen.");	//Return the status in a alert-message
						break;
					}
					case "1":
					{
						console.log("Weiche aussen.");		//Return the status in a alert-message
						break;
					}
					default:
					{
						console.log(data);	//Error-message when the server sends false data.
					}
				}
			}
			else
			{
				console.log("Kommunikation zum Server scheisse!!!");	//Error-message when the server-connection failed.
			}
		}
function responseReceivedWeiche(data, status)
		{
			if("success" == status)		//Check the server-connection
			{
				switch (data)
				{
					case "0":
					{
						console.log("Weiche innen.");	//Return the status in a alert-message
						break;
					}
					case "1":
					{
						console.log("Weiche aussen.");		//Return the status in a alert-message
						break;
					}
					default:
					{
						console.log(data);	//Error-message when the server sends false data.
					}
				}
			}
			else
			{
				console.log("Kommunikation zum Server scheisse!!!");	//Error-message when the server-connection failed.
			}
		}
