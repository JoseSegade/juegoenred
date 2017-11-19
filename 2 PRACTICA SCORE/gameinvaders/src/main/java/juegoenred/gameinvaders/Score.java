package juegoenred.gameinvaders;

public class Score {

	private int id;
	private String name;
	private int score;

	public Score() {
	}
	
	public Score(int id, String name, int score) {
		this.id = id;
		this.name = name;
		this.score = score;
	}

	public long getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	@Override
	public String toString() {
		return "posicion = " + id + ", Nombre= " + name + ", puntuacion= " + score + "]";
	}

}

