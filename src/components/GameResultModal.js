function GameResultModal({
  status,
  targetWord,
  guessesCount,
  onPlayAgain,
  onBackToStart,
  gameMode
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{status === "won" ? "Gewonnen 🎉" : "Verloren 😢"}</h2>

        <p>Wort: <strong>{targetWord}</strong></p>

        {status === "won" && (
          <p>Versuche: {guessesCount}</p>
        )}

        {gameMode === "unlimited" && (
          <button onClick={onPlayAgain}>
            Play again
          </button>
        )}

        {gameMode === "daily" && (
          <button onClick={onBackToStart}>
            Zurück zum Start
          </button>
        )}
      </div>
    </div>
  );
}

export default GameResultModal;
