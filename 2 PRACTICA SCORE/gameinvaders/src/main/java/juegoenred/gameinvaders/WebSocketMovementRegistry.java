package juegoenred.gameinvaders;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebSocketMovementRegistry extends TextWebSocketHandler {
	private ConcurrentHashMap <String, WebSocketSession> openSessions = new ConcurrentHashMap<String, WebSocketSession>();
	private ConcurrentHashMap <String, Boolean> readyPlayers = new ConcurrentHashMap<String, Boolean>();
	private ConcurrentHashMap <String, String> party = new ConcurrentHashMap<String, String>();
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println("Message received: " + message.getPayload());
		openSessions.put(session.getId(), session);
		if(!readyPlayers.containsKey(session.getId())) {
			readyPlayers.put(session.getId(), false);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node = mapper.readTree(message.getPayload());
		
		String functionName = node.get("type").asText();
		String responseMessage = "";
		
		switch(functionName){
		case "move":
			responseMessage = Move(node.get("params"));
			break;
		case "alien":
			responseMessage = Alien(node.get("params"));
			break;
		case "ready":
			responseMessage = Ready(session.getId());
			break;
		}		
		
		
		System.out.println("Message sent: " + responseMessage);
		List<WebSocketSession> sessions = new ArrayList<WebSocketSession>(openSessions.values());
		for(WebSocketSession s : sessions) {
			if(!s.isOpen()) {
				openSessions.remove(s.getId());
			}
			else {
				if(s.getId() != session.getId()) {
					s.sendMessage(new TextMessage(responseMessage));
				}
			}			
		}		
	}
	
	private String Move(JsonNode params) {
		ObjectMapper mapper = new ObjectMapper();
		Boolean izq = params.get("izq").asBoolean();
		Boolean der = params.get("der").asBoolean();
		Boolean dis = params.get("dis").asBoolean();
		
		ObjectNode responseNode = mapper.createObjectNode();
		ObjectNode paramsNode = mapper.createObjectNode();
		paramsNode.put("izq", izq);
		paramsNode.put("der", der);
		paramsNode.put("dis", dis);
		responseNode.put("type", "move");
		responseNode.put("params", paramsNode.toString());
		
		return responseNode.toString();
	}
	
	private String Alien(JsonNode params) {
		ObjectMapper mapper = new ObjectMapper();
		Double coordX = params.get("coordX").asDouble();
		Double coordY = params.get("coordY").asDouble();
		
		ObjectNode responseNode = mapper.createObjectNode();
		ObjectNode paramsNode = mapper.createObjectNode();
		paramsNode.put("coordX", coordX);
		paramsNode.put("coordY", coordY);
		responseNode.put("type", "alien");
		responseNode.put("params", paramsNode.toString());
		
		return responseNode.toString();
	}
	
	private String Ready(String id) {
		readyPlayers.replace(id, true);
		List<Boolean> sessionsReady = new ArrayList<Boolean>(readyPlayers.values());
		Boolean response = false;
		for(Boolean r : sessionsReady) {
			if(r) {
				response = r;
			}
		}
		return response.toString();
	}
	
	
}
