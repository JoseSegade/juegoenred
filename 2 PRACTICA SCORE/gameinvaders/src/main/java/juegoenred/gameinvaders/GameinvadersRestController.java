package juegoenred.gameinvaders;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class GameinvadersRestController {
	
	@Autowired
	private TotalScores totalscore;	
	
	@RequestMapping(value = "/Scores", method = RequestMethod.GET)
	public List<Score> getScores(){
		return totalscore.getTotalScore();
	}
	
	@RequestMapping(value = "/Scores", method = RequestMethod.POST)
	public ResponseEntity<Boolean> addTeam(@RequestBody Score newScore){
		totalscore.addScore(newScore);
		return new ResponseEntity<Boolean>(true,HttpStatus.CREATED);
	}
}

