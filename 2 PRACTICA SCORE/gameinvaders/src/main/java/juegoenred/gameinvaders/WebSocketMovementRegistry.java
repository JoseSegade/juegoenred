package juegoenred.gameinvaders;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebSocketMovementRegistry extends TextWebSocketHandler {
	private ConcurrentHashMap <String, WebSocketSession> openSessions = new ConcurrentHashMap<String, WebSocketSession>();
	private ConcurrentHashMap <String, Boolean> readyPlayers = new ConcurrentHashMap<String, Boolean>();
	private ConcurrentHashMap <Integer, Party> partyManager = new ConcurrentHashMap<Integer, Party>();
	private Integer index = 0;
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("New user: " + session.getId());
		openSessions.put(session.getId(), session);
		if(!readyPlayers.containsKey(session.getId())) {
			readyPlayers.put(session.getId(), false);
		}
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("Session closed: " + session.getId());
		if(readyPlayers.containsKey(session.getId())) {
			readyPlayers.remove(session.getId());
		}
		for(Party p : partyManager.values()) {
			if(p.isPlayerInParty(session.getId())) {
				if(readyPlayers.containsKey(p.GetAnother(session.getId()))) {
					readyPlayers.remove(p.GetAnother(session.getId()));
				}
				ObjectMapper mapper = new ObjectMapper();
				ObjectNode responseNode = mapper.createObjectNode();
				responseNode.put("type", "close");
				responseNode.put("params", "");
				openSessions.get(p.GetAnother(session.getId())).sendMessage(new TextMessage(responseNode.toString()));				
				partyManager.remove(p.getIndex());
			}
		}
		openSessions.remove(session.getId());
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		Boolean isReady = false;
		System.out.println("Message received: " + message.getPayload());		
		
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
			isReady = true;
			break;
		case "alienKill":
			responseMessage = AlienKill(node.get("params"));
			break;
		case "vida":
			responseMessage = Vida(node.get("params"));
			break;
		case "end":
			responseMessage = End(node.get("params"), session);
			break;
		}		
		
		synchronized (openSessions) {
			System.out.println("Message sent: " + responseMessage);
			for(Party p : partyManager.values()) {
				if(p.isPlayerInParty(session.getId())) {
					if(isReady) {
						Thread.sleep(100);
						session.sendMessage(new TextMessage(responseMessage));
						openSessions.get(p.GetAnother(session.getId())).sendMessage(new TextMessage(responseMessage));
						isReady = false;
					}
					else {
						openSessions.get(p.GetAnother(session.getId())).sendMessage(new TextMessage(responseMessage));
					}					
				}
			}
		}
		
		/*
		List<WebSocketSession> sessions = new ArrayList<WebSocketSession>(openSessions.values());
		for(WebSocketSession s : sessions) {			
			if(s.getId() != session.getId()) {
				s.sendMessage(new TextMessage(responseMessage));
			}	
		}		
		*/
	}
	
	private String Move(JsonNode params) {
		ObjectMapper mapper = new ObjectMapper();
		Integer posX = params.get("posX").asInt();
		Boolean dis = params.get("dis").asBoolean();
		
		ObjectNode responseNode = mapper.createObjectNode();
		ObjectNode paramsNode = mapper.createObjectNode();
		paramsNode.put("posX", posX);
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
		
		Boolean response = false;
		for(String key: readyPlayers.keySet()) {
			if(readyPlayers.containsKey(key) && id != key) {
				response = true;
				partyManager.put(index, new Party(index, id, key));
				index ++;
				if(readyPlayers.containsKey(id)) {
					readyPlayers.remove(id);
				}
				readyPlayers.remove(key);
			}
		}
		if(!response) {
			if(!readyPlayers.containsKey(id))
			{
				readyPlayers.put(id, true);
			} 
			else {
				readyPlayers.replace(id, true);
			}
			
		}		
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode responseNode = mapper.createObjectNode();
		ObjectNode paramsNode = mapper.createObjectNode();
		paramsNode.put("ready", response);
		responseNode.put("type", "ready");
		responseNode.put("params", paramsNode.toString());
		return responseNode.toString();
	}
	
	private String AlienKill(JsonNode params) {
		ObjectMapper mapper = new ObjectMapper();
		Integer alienPos = params.get("alienPos").asInt();
		Integer score = params.get("score").asInt();
		Integer list = params.get("list").asInt();
		
		ObjectNode responseNode = mapper.createObjectNode();
		ObjectNode paramsNode = mapper.createObjectNode();
		paramsNode.put("alienPos", alienPos);
		paramsNode.put("score", score);
		paramsNode.put("list", list);
		responseNode.put("type", "alienKill");
		responseNode.put("params", paramsNode.toString());
		
		return responseNode.toString();
	}	
	
	private String Vida(JsonNode params) {
		ObjectMapper mapper = new ObjectMapper();
		Boolean quitar = params.get("quitar").asBoolean();
		
		ObjectNode responseNode = mapper.createObjectNode();
		ObjectNode paramsNode = mapper.createObjectNode();
		paramsNode.put("quitar", quitar);
		responseNode.put("type", "vida");
		responseNode.put("params", paramsNode.toString());
		
		return responseNode.toString();
	}
	
	private String End(JsonNode params, WebSocketSession session) {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode responseNode = mapper.createObjectNode();
		responseNode.put("type", "end");
		responseNode.put("params", "");	
		
		for(Party p : partyManager.values()) {
			if(p.isPlayerInParty(session.getId())) {					
				partyManager.remove(p.getIndex());
			}
		}
		return responseNode.toString();
	}
	
}
