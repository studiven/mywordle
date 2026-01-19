import './App.css';
import Board from './components/Board';
import { useState, useEffect } from 'react';
import { checkGuess } from './logic/gameLogic';

function App() {
  const maxWordLength = 5; 

  const [targetWord, setTargetWord] = useState('APFEL');
  const [guesses, setGuesses] = useState([]); // leeres Array am Start
  const [currentGuess, setCurrentGuess] = useState(''); // leerer String
  const [gameStatus, setGameStatus] = useState('playing');// 'playing' / 'won' / 'lost'

  const resetGame = () => {
    setTargetWord('APFEL'); // später random
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
  };


  const handleKeyDown = (event) => {
    console.log('Taste gedrückt:', event.key);
    if (gameStatus !== 'playing') return; // Input sperren

    if (event.key === 'Enter') {
      if (currentGuess.length !== maxWordLength) return;

      setGuesses(g => [
        ...g,
        {
          word: currentGuess,
          statuses: checkGuess(currentGuess, targetWord)
        }
      ]);

      setCurrentGuess('');

      if (currentGuess === targetWord) {
        setGameStatus('won');
        return;
      }

      if (guesses.length >= 5) {
        setGameStatus('lost');
        return;
      }  

      return;
    
    } else if (event.key === 'Backspace') {

      setCurrentGuess(prev => prev.slice(0, -1));
      return;

    } else if ( /^[a-zA-Z]$/.test(event.key)) {

      if (currentGuess.length >= maxWordLength) return;
      setCurrentGuess(currentGuess + event.key.toUpperCase());
  
    }

    //if (guesses.length >= 6) return;
    
  };

  return (

     <div tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
    > 
      <h1>Wordle</h1>

      <p>Target: {targetWord}</p>
      <p>Guesses: {JSON.stringify(guesses)}</p>
      <p>Current: {currentGuess}</p>

      {gameStatus === 'won' && (
        <div>
          <h2> Gewonnen!</h2>
          <button onClick={resetGame}>Play again</button>
        </div>
      )}

      {gameStatus === 'lost' && (
        <div>
          <h2>Verloren!</h2>
          <p>Das Wort war: {targetWord}</p>
          <button onClick={resetGame}>Play again</button>
        </div>
      )}

      <Board guesses={guesses}/>
    </div>

  );
}

export default App;
