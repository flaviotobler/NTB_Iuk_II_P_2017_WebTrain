$(document).ready(function(){ 
       $('#button-up').click(function(){
         $.post('/up');
});
        $('#button-down').click(function(){
         $.post('/down');
});
        $('#button-right').click(function(){
         $.post('/right');
});
        $('#button-left').click(function(){
         $.post('/left');
});


});
