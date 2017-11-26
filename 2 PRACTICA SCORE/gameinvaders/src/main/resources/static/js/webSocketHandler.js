var connection = new WebSocket('ws://localhost:8080/move');

connection.onerror= function(e) {
	console.log("WS error: " + e);
}

connection.onmessage = function(msg) {
	console.log("WS message: " + JSON.parse(msg.data));
	input = msg.data;
}

function enviarDocumento(msg) {
	$(document).ready(function() {	
		connection.send(JSON.stringify(msg));
	})	
}
