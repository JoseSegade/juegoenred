//<input class = "buttontype" type = "button" onclick = "start();" value="Start Game" />

//variables globales
var hiddenMenu = false;

$(document).ready(function () {
    $( "#buttonstart" ).click(function() {
        $( "#menu" ).hide();
        hiddenMenu = true;
        start();
    });
});
