var connection = new WebSocket("ws://" + window.location.host +'/move');

connection.onerror= function(e) {
	console.log("WS error: " + e);
}

connection.onmessage = function(msg) {
	console.log("WS message: " + JSON.parse(msg.data));
	var inputData = JSON.parse(msg.data);
	switch(inputData.type) {
	case "move":
		player2inputs = JSON.parse(inputData.params);
		break;
	case "alien":
		alienInputs = JSON.parse(inputData.params);
		break;
	case "ready":
		
		ready = JSON.parse(inputData.params).ready;
		console.log("Ready: " + ready);
		if(ready){
			restart();
		}
		break;
	case "close":
		console.log("Me ha llegado un mensaje diciendo el jugador se ha desconectado");
		ready = false;
		restart();
		sendReady();
		break;
	case "alienKill":
		updateAliens(JSON.parse(inputData.params));
		break;
	case "vida":
		quitarVidaAPlayer2();
		break;
	case "end":
		break;
	}
	
	
}

function enviarDocumento(msg) {
	$(document).ready(function() {	
		connection.send(JSON.stringify(msg));
	})	
}
