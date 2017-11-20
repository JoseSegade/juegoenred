package juegoenred.gameinvaders;


import java.util.List;
import java.util.ArrayList;
import org.springframework.stereotype.Component;


@Component
public class TotalScores {
	
	List<Score> scoreList = new ArrayList<>();
	
	public TotalScores() {
		createDefaultScore();
	}


	private void createDefaultScore() {
		for(int i=0; i<5 ; ++i) {
			Score s = new Score(i+1,"Default",0);
			scoreList.add(s);
		}
	}

public void addScore(Score newScore) {
	List<Score> copy = new ArrayList<>();
	boolean añadido = false;
	
	for(int i=0; i<scoreList.size(); i++) {
		if(newScore.getScore() >= scoreList.get(i).getScore() && !añadido) {
			copy.add(newScore);
			copy.add(scoreList.get(i));
			añadido = true;
		}
		else {
			copy.add(scoreList.get(i));
			}
	}
	
	for(int i=0; i<copy.size(); i++) {
		int pos = i+1;
		if(pos <= 5) {
			copy.get(i).setId(pos);
		}
		else {
			copy.remove(i);
		}
		
	}
	scoreList.clear();
	scoreList.addAll(copy);
}

public List<Score> getTotalScore(){
		return scoreList;
	}
}