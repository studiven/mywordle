import Row from './Row';
import { checkGuess } from '../logic/gameLogic';

function Board({guesses , currentGuess}) {
    const TOTAL_ROWS = 6; 
    const maxWordLength = 5; 
  
    return (
    <div>
    {guesses.map((guess, index) => (
        <Row
          key={index}
          guess={guess.word}
          statuses={guess.statuses}
        />

      ))}
      
      {guesses.length < 6 &&(
        <Row
          key={`current`}
          guess={currentGuess.padEnd(maxWordLength, ' ')}
          statuses={['', '', '', '', '']}
        />
      )}

      {Array.from({ length: TOTAL_ROWS - (guesses.length + 1)}).map((_, index) => (
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