$(document).ready(function(){ 
       $('#button-up').click(function(){
         $.post('/up', function(data){
             if(data.timePassed){
                 addSucces(data.postText);
             }else{
                 addError(data.postText);
             }
         });
});
        $('#button-down').click(function(){
         $.post('/down', function(data){
             if(data.timePassed){
                 addSucces(data.postText);
             }else{
                 addError(data.postText);
             }
         });
});
        $('#button-right').click(function(){
         $.post('/right', function(data){
             if(data.timePassed){
                 addSucces(data.postText);
             }else{
                 addError(data.postText);
             }
         });
});
        $('#button-left').click(function(){
         $.post('/left', function(data){
             if(data.timePassed){
                 addSucces(data.postText);
             }else{
                 addError(data.postText);
             }
         });
});
    
        $('#button-pos1').click(function(){
         $.post('/pos1', function(data){
             if(data.timePassed){
                 addSucces(data.postText);
             }else{
                 addError(data.postText);
             }
         });
});
    
        $('#button-pos2').click(function(){
         $.post('/pos2', function(data){
             if(data.timePassed){
                 addSucces(data.postText);
             }else{
                 addError(data.postText);
             }
         });
});
    
        $('#button-getpos').click(function(){
         $.get('/test',function(data){
             console.log(data);
         });
});

  /*document.getElementById('save').onclick = function () {

       
        window.open(c.toDataURL('image/png'));
	window.location.href = img.src.replace('image/png', 'image/octet-stream');
    };*/

	
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