export default function StartScreen({ onSelect }) {
  return (
    <div className="start-screen">
      <h1>Wordle</h1>

      <button onClick={() => onSelect("daily")}>
        🗓 Daily Wordle
      </button>

      <button onClick={() => onSelect("unlimited")}>
        ♾ Unlimited Mode
      </button>
    </div>
  );
}
