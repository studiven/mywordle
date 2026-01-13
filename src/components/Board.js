import Row from './Row';
import { checkGuess } from '../logic/gameLogic';

function Board({guesses}) {
    const TOTAL_ROWS = 6; 
  
  
    return (
    <div>
    {guesses.map((guess, index) => (
        <Row
          key={index}
          guess={guess.word}
          statuses={guess.statuses}
        />

      ))}
      
      {Array.from({ length: TOTAL_ROWS - guesses.length }).map((_, index) => (
        <Row 
          key={`empty-${index}`}
          guess="     "
          statuses={['', '', '', '', '']}
        />
      ))}
    </div>
  );

}

export default Board;