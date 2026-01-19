import './App.css';
import Board from './components/Board';
import { useState, useEffect, useRef } from 'react';
import { checkGuess } from './logic/gameLogic';

function App() {
  const maxWordLength = 5; 

  const [targetWord, setTargetWord] = useState(null);
  const [guesses, setGuesses] = useState([]); // leeres Array am Start
  const [currentGuess, setCurrentGuess] = useState(''); // leerer String
  const [gameStatus, setGameStatus] = useState('playing');// 'playing' / 'won' / 'lost'
  const [isLoadingTarget, setIsLoadingTarget] = useState(true);
  const didFetchTarget = useRef(false);

useEffect(() => {
  if (didFetchTarget.current) return;
  didFetchTarget.current = true;

  loadValidTargetWord();
}, []);



 async function loadValidTargetWord() {
  setIsLoadingTarget(true);

  let found = false;

  while (!found) {
    try {
      const randomRes = await fetch(
        'https://random-word-api.herokuapp.com/word?length=5'
      );
      const [word] = await randomRes.json();

      const dictRes = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const dictData = await dictRes.json();

      // dictionaryapi.dev → Array bei Erfolg
      if (Array.isArray(dictData) && dictData.length > 0) {
        setTargetWord(word.toUpperCase());
        setIsLoadingTarget(false);
        found = true; 
      }

    } catch (error) {
      console.error('API error:', error);
      // einfach nochmal versuchen
    }
  }
}


async function isValidDictionaryWord(word) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
  );
  const data = await res.json();
  return Array.isArray(data) && data.length > 0;
}


  function resetGame() {
    loadValidTargetWord();
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
  };
  

  const handleKeyDown =  async (event) => {
    console.log('Taste gedrückt:', event.key);
    if (gameStatus !== 'playing') return; // block Input

    if (event.key === 'Enter') {
      if (currentGuess.length !== maxWordLength) return;

      //check via dictionary api
      const valid = await isValidDictionaryWord(currentGuess);
      if (!valid) {
        return;
      }

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

      {isLoadingTarget ? (<p>Loading...</p>) : (<Board guesses={guesses} currentGuess={currentGuess}/>)}
    
    </div>

  );
}

export default App;
