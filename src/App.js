import './App.css';
import Board from './components/Board';
import { useState, useEffect } from 'react';
import { checkGuess } from './logic/gameLogic';

function App() {
  const maxWordLenght = 5; 

  const [targetWord, setTargetWord] = useState('APFEL');
  const [guesses, setGuesses] = useState([]); // leeres Array am Start
  const [currentGuess, setCurrentGuess] = useState(''); // leerer String

  const handleKeyPress = (event) => {
    console.log('Taste gedrückt:', event.key);
    
    if (event.key === 'Enter') {
      console.log(event.repeat); 
      if (event.repeat) return;

      setCurrentGuess(prev => {
      
        if (prev.length !== maxWordLenght) return prev;
        
          setGuesses(g => [
            ...g,
            {
              word: prev,
              statuses: checkGuess(prev, targetWord)
           }]);
        
        return '';
    });


    } else if (event.key === 'Backspace') {

      setCurrentGuess(prev => prev.slice(0, -1));

    } else if ( /^[a-zA-Z]$/.test(event.key)) {

      setCurrentGuess(prev => {
      if (prev.length >= maxWordLenght) return prev;
      return prev + event.key.toUpperCase();
      });

    }

    //if (guesses.length >= 6) return;
    
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
  
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);


  return (

     <div>
      <h1>Wordle</h1>

      <p>Target: {targetWord}</p>
      <p>Guesses: {JSON.stringify(guesses)}</p>
      <p>Current: {currentGuess}</p>

      <Board guesses={guesses}/>
    </div>

  );
}

export default App;
