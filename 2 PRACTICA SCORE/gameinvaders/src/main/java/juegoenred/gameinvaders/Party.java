package juegoenred.gameinvaders;

public class Party {
	private int index;
	private String player1;
	private String player2;
	
	public Party(int index, String player1, String player2) {
		this.index = index;
		this.player1 = player1;
		this.player2 = player2;
	}
	
	public int getIndex() {
		return index;
	}
	
	public String getPlayer1() {
		return player1;
	}
	
	public Boolean setPlayer1(String player) {
		if(player != player2) {
			player1 = player;
			return true;
		}
		else {
			return false;
		}
	}
	
	public String getPlayer2() {
		return player2;
	}
	
	public Boolean setPlayer2(String player) {
		if(player != player1) {
			player2 = player;
			return true;
		}
		else {
			return false;
		}
	}
	
	public Boolean isPlayerInParty(String player) {
		if (player == player1 || player == player2) {
			return true;
		}
		else {
			return false;
		}
	}
	
	public String GetAnother(String player) {
		if(player == player1) {
			return player2;
		}
		else if(player == player2) {
			return player1;
		}
		else {
			return "";
		}
	}

}
