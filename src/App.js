import './App.css';
import Board from './components/Board';
import { useState, useEffect, useRef } from 'react';
import { checkGuess } from './logic/gameLogic';
import { supabase } from './utils/supabase';

function App() {
  const maxWordLength = 5; 

  const [stats, setStats] = useState(null);
  const [targetWord, setTargetWord] = useState(null);
  const [guesses, setGuesses] = useState([]); // leeres Array am Start
  const [currentGuess, setCurrentGuess] = useState(''); // leerer String
  const [gameStatus, setGameStatus] = useState('playing');// 'playing' / 'won' / 'lost'
  const [isLoadingTarget, setIsLoadingTarget] = useState(true);
  const didFetchTarget = useRef(false);
  const inputRef = useRef(null);

useEffect(() => {
  inputRef.current?.focus();
  if (didFetchTarget.current) return;
  didFetchTarget.current = true;

  loadValidTargetWord();
  getHistory().then(setStats);
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

async function getHistory() {

  // last 5 games
  const { data: last5 = [] } = await supabase
    .from("games")
    .select("guesses")
    .neq("guesses", 7)
    .order("created_at", { ascending: false })
    .limit(5);

  const avgLast5 =
    last5.length > 0
      ? last5.reduce((sum, g) => sum + g.guesses, 0) / last5.length
      : 0;

  // overall
  const { data: allWins = [] } = await supabase
    .from("games")
    .select("guesses")
    .neq("guesses", 7);

  const overallAvg =
    allWins.length > 0
      ? allWins.reduce((sum, g) => sum + g.guesses, 0) / allWins.length
      : 0;

  // Häufigkeitsverteilung (nur gewonnene)
  const distribution = allWins.reduce((acc, g) => {
    acc[g.guesses] = (acc[g.guesses] || 0) + 1;
    return acc;
  }, {});

  // Anzahl verlorene Spiele
  const { count: lostGames = 0 } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true })
    .eq("guesses", 7);

  return {
    avgLast5,
    overallAvg,
    distribution,
    lostGames
  };
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
    
    if (gameStatus !== 'playing') return; 

    if (event.key === 'Enter') {
      if (currentGuess.length !== maxWordLength) return;

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

        await supabase.from("games").insert({
          guesses: guesses.length + 1
        });
        return;
      }

      if (guesses.length >= 5) {
        setGameStatus('lost');
        
        await supabase.from("games").insert({
          guesses: 7
        });
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

     <div 
      onClick={() => inputRef.current?.focus()}
      //tabIndex={0}
      //onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
    >
      <input
    ref={inputRef}
    type="text"
    inputMode="text"
    autoComplete="off"
    autoCorrect="off"
    autoCapitalize="characters"
    spellCheck={false}
    style={{
      position: 'absolute',
      opacity: 0,
      height: 0,
      width: 0
    }}
    onKeyDown={handleKeyDown}
  /> 
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
    
      {stats != null && (
    <div>
      <h2>Statistiken</h2>

      <p>Ø letzte 5 Spiele: {stats.avgLast5.toFixed(2)}</p>
      <p>Ø insgesamt: {stats.overallAvg.toFixed(2)}</p>
      <p>Verlorene Spiele: {stats.lostGames}</p>

      <h3>Verteilung</h3>
      <ul>
        {[1,2,3,4,5,6].map(n => (
          <li key={n}>
            {n} Guesses: {stats.distribution[n] || 0}
          </li>
        ))}
      </ul>
    </div>
      )}
    
    </div>

  );
}

export default App;
