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
	}
	
}

function enviarDocumento(msg) {
	$(document).ready(function() {	
		connection.send(JSON.stringify(msg));
	})	
}
