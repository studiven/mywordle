import './App.css';
import Board from './components/Board';
import { useState, useEffect, useRef } from 'react';
import { checkGuess } from './logic/gameLogic';
import { supabase } from './utils/supabase';
import TargetToggle from './components/TargetToggle';
import Stats from './components/Stats';
import Toast from "./components/Toast";
import GameResultModal from './components/GameResultModal';
import StartScreen from './components/StartScreen';


function App() {

  const maxWordLength = 5;

  const [stats, setStats] = useState(null);
  const [targetWord, setTargetWord] = useState(null);
  const [guesses, setGuesses] = useState([]); // leeres Array am Start
  const [currentGuess, setCurrentGuess] = useState(''); // leerer String
  const [gameStatus, setGameStatus] = useState('playing');// 'playing' / 'won' / 'lost'
  const [isLoadingTarget, setIsLoadingTarget] = useState(true);
  const inputRef = useRef(null);
  const [feedback, setFeedback] = useState(null);
  const [shake, setShake] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);


  useEffect(() => {
    if (!gameMode) return;

    if (gameMode === "daily") {
      getDailyWord().then(word => {
        setTargetWord(word.toUpperCase());
        setIsLoadingTarget(false);
      });
    }

    if (gameMode === "unlimited") {
      loadValidTargetWord();
    }

    getHistory().then(setStats);
    inputRef.current?.focus();
  }, [gameMode]);

  if (!gameMode) {
    return <StartScreen onSelect={setGameMode} />;
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  async function getDailyWord() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const { data } = await supabase
      .from("daily_words")
      .select("word")
      .eq("date", today)
      .single();

    if (data?.word) {
      return data.word.toUpperCase();
    }

    const word = await loadValidTargetWord();

    await supabase.from("daily_words").insert({
      date: today,
      word: word.toUpperCase()
    });

    return word;
  }


  async function loadValidTargetWord() {
    setIsLoadingTarget(true);

    let found = false;
    let word = null;
    let retries = 5; 
    let currentTries = 0; 

    while (!found && currentTries < retries) {
      try {
        const randomRes = await fetch(
          'https://random-words-api.kushcreates.com/api?language=en&category=wordle&length=5&type=uppercase&words=1'
        );

        if (!randomRes.ok) {
          throw new Error(`API Fehler: ${randomRes.status}`);
        }

        const [result] = await randomRes.json();
        word = result.word;

        const dictRes = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        if (!dictRes.ok) {
          throw new Error(`API Fehler: ${dictRes.status}`);
        }
        const dictData = await dictRes.json();

        // dictionaryapi.dev → Array bei Erfolg
        if (Array.isArray(dictData) && dictData.length > 0) {
          found = true;
        }

      } catch (error) {
        console.error('API error:', error);
        // einfach nochmal versuchen
      } finally {
        console.error("THIS IS A INF0: ", currentTries); 
        currentTries++; 
      }
    }
    if (word === null) {
      //Fallback
        word = "APPLE"; 
    }

      setTargetWord(word.toUpperCase());
      setIsLoadingTarget(false);

    return word;
  }

  async function getHistory() {

    // last 5 games
    const { data: last5Raw = [] } = await supabase
      .from("games")
      .select("guesses")
      .neq("guesses", 7)
      .order("created_at", { ascending: false })
      .limit(5);

    const last5 = last5Raw ?? [];

    const avgLast5 =
      last5.length > 0
        ? last5.reduce((sum, g) => sum + g.guesses, 0) / last5.length
        : 0;

    // overall
    const { data: allWinsRaw = [] } = await supabase
      .from("games")
      .select("guesses")
      .neq("guesses", 7);

    const allWins = allWinsRaw ?? [];
    
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
      .eq("guesses", 7) ?? [];

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

  function backToStart() {
    setGameMode(null);
    setTargetWord(null);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setIsLoadingTarget(true);
  }



  const handleKeyDown = async (event) => {

    if (gameStatus !== 'playing') return;

    if (event.key === 'Enter') {
      if (currentGuess.length !== maxWordLength) {
        setFeedback({ type: 'error', message: 'Zu kurz!' });
        triggerShake();
        return;
      }

      const valid = await isValidDictionaryWord(currentGuess);
      if (!valid) {
        setFeedback({ type: 'error', message: 'Ungültiges Wort' });
        triggerShake();
        return;
      }

      setFeedback({ type: 'success', message: '✓ Wort akzeptiert' });

      setGuesses(g => [
        ...g,
        {
          word: currentGuess,
          statuses: checkGuess(currentGuess, targetWord)
        }
      ]);

      setCurrentGuess('');

      if (currentGuess.toUpperCase() === targetWord.toUpperCase()) {

        setGameStatus('won');

        await supabase.from("games").insert({
          guesses: guesses.length + 1
        });

        const updatedStats = await getHistory();
        setStats(updatedStats);

        return;
      }

      if (guesses.length >= 5) {
        setGameStatus('lost');

        await supabase.from("games").insert({
          guesses: 7
        });

        const updatedStats = await getHistory();
        setStats(updatedStats);

        return;
      }

      return;

    } else if (event.key === 'Backspace') {

      setCurrentGuess(prev => prev.slice(0, -1));
      return;

    } else if (/^[a-zA-Z]$/.test(event.key)) {

      if (currentGuess.length >= maxWordLength) return;
      setCurrentGuess(currentGuess + event.key.toUpperCase());

    }

  };

  return (

    <div className="app-root" onClick={() => inputRef.current?.focus()}>
      
      {statsOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setStatsOpen(false)}
        />
      )}

      <aside className={`sidebar ${statsOpen ? "open" : ""}`}>
        {stats && <Stats stats={stats} />}
      </aside>


      {/* LEFT: Stats Button */}
      {!statsOpen && (
        <button className="stats-button" onClick={() => setStatsOpen(true)}>📊</button>
      )}

      {/* CENTER: Game */}
      <main className="game">
        <Toast feedback={feedback} clear={() => setFeedback(null)} />


        <h1>Wordle</h1>

        <TargetToggle targetWord={targetWord} />

        <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        className="hidden-input"
        onKeyDown={handleKeyDown}
      />

        {isLoadingTarget ? (
          <p>Loading...</p>
        ) : (
          <Board guesses={guesses} currentGuess={currentGuess} shake={shake} />
        )}

        {gameStatus !== 'playing' && (
          <GameResultModal
            status={gameStatus}
            targetWord={targetWord}
            guessesCount={guesses.length}
            gameMode={gameMode}
            onPlayAgain={resetGame}
            onBackToStart={backToStart}
          />
        )}


      </main>

      {/* RIGHT spacer */}
      <div />
    </div>
  );

}

export default App;
