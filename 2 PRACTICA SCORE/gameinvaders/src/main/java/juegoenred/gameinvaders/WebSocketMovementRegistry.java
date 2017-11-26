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
	private ConcurrentHashMap <String, String> party = new ConcurrentHashMap<String, String>();
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println("Message received: " + message.getPayload());
		openSessions.put(session.getId(), session);
		
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node = mapper.readTree(message.getPayload());
		
		String functionName = node.get("type").asText();
		
		Boolean izq = node.get("params").get("izq").asBoolean();
		Boolean der = node.get("params").get("der").asBoolean();
		Boolean dis = node.get("params").get("dis").asBoolean();
		
		ObjectNode responseNode = mapper.createObjectNode();
		responseNode.put("izq", izq);
		responseNode.put("der", der);
		responseNode.put("dis", dis);
		
		System.out.println("Message sent: " + responseNode.toString());
		List<WebSocketSession> sessions = new ArrayList<WebSocketSession>(openSessions.values());
		for(WebSocketSession s : sessions) {
			if(!s.isOpen()) {
				openSessions.remove(s.getId());
			}
			else {
				if(s.getId() != session.getId()) {
					s.sendMessage(new TextMessage(responseNode.toString()));
				}
			}			
		}	
		
	}
	
	
}
