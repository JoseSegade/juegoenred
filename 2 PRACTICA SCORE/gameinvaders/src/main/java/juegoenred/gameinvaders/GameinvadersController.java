package juegoenred.gameinvaders;

import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class GameinvadersController {
	
	@Autowired
	private TotalScores totalscore;
	
	List<Score> scoreList = new ArrayList<Score>();
	//Map<Integer, Score> items = new ConcurrentHashMap<>(); 
	//AtomicLong nextId = new AtomicLong(0);
	
	@RequestMapping(value = "/Scores", method = RequestMethod.GET)
	public List<Score> getScores(){
		return totalscore.getTotalScore();
	}
	
	@RequestMapping(value = "/Scores", method = RequestMethod.POST)
	public ResponseEntity<Boolean> addTeam(@RequestBody Score newScore){
		totalscore.addScore(newScore);
		return new ResponseEntity<Boolean>(true,HttpStatus.CREATED);
	}
	
	
	/*
	@GetMapping
	public List<Score> items() {
		return scoreList;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Score nuevoItem(@RequestBody Score item) {
		scoreList.add(item);
		//Metodo sort a medida ordenamos el arraylist por puntuación
		Collections.sort(scoreList, new Comparator<Score>() {
			
	        public int compare(Score o1, Score o2) {
	        	if(o1.getScore() > o2.getScore()) {
	        		return 1;
	        	}
	        	else
	        		return 0;
	            
	        }
	    });
		
		for(int i=0 ; i<scoreList.size();i++) {
			if(i<5)
				scoreList.get(i).setId(i+1);
			else
				scoreList.remove(i);
		}
		//long id = (int)nextId.incrementAndGet();
		//item.setId((int)id);
		//items.put((int) id, item);
		
		return item;
	}


	@PutMapping("/{id}")
	public ResponseEntity<Score> actulizaItem(@PathVariable long id, @RequestBody Score itemActualizado) {

		Score savedItem = items.get(itemActualizado.getId());

		if (savedItem != null) {

			items.put((int)id, itemActualizado);

			return new ResponseEntity<>(itemActualizado, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Score> getItem(@PathVariable long id) {

		Score savedItem = items.get((int)id);

		if (savedItem != null) {
			return new ResponseEntity<>(savedItem, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Score> getItem(@PathVariable long id) {

		Score savedItem = scoreList.get((int)id);

		if (savedItem != null) {
			return new ResponseEntity<>(savedItem, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Score> borraItem(@PathVariable long id) {

		Score savedItem = scoreList.get((int)id);

		if (savedItem != null) {
			scoreList.remove(savedItem.getId());
			return new ResponseEntity<>(savedItem, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
*/
}

