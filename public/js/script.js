$(document).ready(function(){ 

      $('#Register').click(function(){
       $.post("/register", function(data){addSucces(data);}
	   );
});

       $('#button-up').click(function(){
         $.post("/action", {"movement": "up"}, function(data){addSucces(data);}
		 );
});
        $('#button-down').click(function(){
         $.post("/action", {"movement": "down"}, function(data){addSucces(data);}
		 );
});
        $('#button-right').click(function(){
         $.post("/action", {"movement": "right"}, function(data){addSucces(data);}
		 );
});
        $('#button-left').click(function(){
         $.post("/action", {"movement": "left"}, function(data){addSucces(data);}
		 );
});
    
        $('#button-pos1').click(function(){
         $.post("/action", {"movement": "pos1"}, function(data){addSucces(data);}
		 );
});
    
        $('#button-pos2').click(function(){
         $.post("/action", {"movement": "pos2"}, function(data){addSucces(data);}
		 );
});
    
        $('#button-getpos').click(function(){
         $.get('/test',function(data){
             console.log(data);
         });
		 
		 
		 /*  WEICHENSTEUERUNG   */
		 
		checkStatus_send();
		
		$('#button_aussen').click(function()
			{
				$.post('/aussen',responseReceived);
			}
		);
		$('#button_innen').click(function()
			{
				$.post('/innen',responseReceived);
			}
		);
}); 
	
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

});
// document ready closing

  /*document.getElementById('save').onclick = function () {

       
        window.open(c.toDataURL('image/png'));
	window.location.href = img.src.replace('image/png', 'image/octet-stream');
    };*/
var waitTime;	
$.get("/waitingTime", function(wtime){
		waitTime = parseInt(wtime);
	
	
	}
);
setInterval(checkTime, 1000);

function checkTime() {
	$.get("/timeRemaining", function(timestring){
		/*console.log("timestring" + timestring);*/
		$.get("/queuePos", function(posstring){
			
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
    $('.alert-danger').fadeIn();
}
function addSucces(errorText){
    $('.alert').hide();
    $('p.error-text').html(errorText);
    $('.alert-success').fadeIn();
}


/*  WEICHENSTEUERUNG LADINA   */

// AJAX-function-calls for the buttons 


		


function responseReceived(data, status)
		{
			if("success" == status)		//Check the server-connection
			{
				switch (data)
				{
					case "0":
					{
						alert("Weiche innen.");	//Return the status in a alert-message
						break;
					}
					case "1":
					{
						alert("Weiche aussen.");		//Return the status in a alert-message
						break;
					}
					default:
					{
						alert("Die Daten sind korrupt!!!");	//Error-message when the server sends false data.
					}
				}
			}
			else
			{
				alert("Kommunikation zum Server scheisse!!!");	//Error-message when the server-connection failed.
			}
		}
		
function checkStatus_send()
{
	$.post('/getState',checkStatus);
}
	
function checkStatus(data, status)
{
	if("success" == status)
	{
		switch (data)	//Check the received data
				{
					case "0":
					{
						document.getElementById('bild').setAttribute('src', "imgages/BahnanlageInnen.svg"); 
						break;
					}
					case "1":
					{
						document.getElementById("bild").setAttribute("src", "imgages/BahnanlageAussen.svg");	
						break;
					}
					default:
					{
						alert("Die Daten sind korrupt!!!");	//Error-message when the server sends false data.
					}
				}
	}
	else
	{
		alert("Kommunikation zum Server scheisse!!!");	//Error-message when the server-connection failed.
	}
	setTimeout(checkStatus_send, 1000);	
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
		$(document).ready(function()
			{
				$('#button-start').click(function()
					{
						$.post('/start',responseReceived);
						$('#lok_onoff').attr('src','img/dampflok_on.svg');
					}
				);
				$('#button-stop').click(function()
					{
						$.post('/stop',responseReceived);
						$('#lok_onoff').attr('src','img/dampflok_off.svg');
						//document.getElementById('lok_onoff').setAttribute('src', "img/dampflok_off.svg");
					}
				);
				$('#button-getState').click(function()
					{
						$.post('/getState',responseReceived);
					}
				);
			}
		);
		// AJAX Callback-functions 
		function responseReceived(data, status)
		{
			if("success" == status)		//Check the server-connection
			{
				switch (data)	//Check the received data
				{
					case "0":
					{
						alert("Zug steht.");		//Return the status in a alert-message
						break;
					}
					case "1":
					{
						alert("Zug faehrt.");		//Return the status in a alert-message	
						break;
					}
					default:
					{
						alert("Die Daten sind korrupt!!!");	//Error-message when the server sends false data.
					}
				}
			}
			else
			{
				alert("Kommunikation zum Server scheisse!!!");	//Error-message when the server-connection failed.
			}
		}