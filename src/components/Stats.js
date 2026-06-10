export default function Stats({ stats }) {
  const isEmpty =
    !stats ||
    (stats.avgLast5 === 0 &&
      stats.overallAvg === 0 &&
      stats.lostGames === 0 &&
      Object.keys(stats.distribution).length === 0);

  if (isEmpty) {
    return (
      <div className="stats">
        <h2>Statistik</h2>
        <div className="stats-empty">
          <span className="stats-empty-icon">🌱</span>
          <p>Dein Garten wächst noch.</p>
          <p className="stats-empty-sub">Spiel dein erstes Wort um die Statistiken zu pflanzen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stats">
      <h2>Statistik</h2>

      <div className="averages">
        {stats.avgLast5 > 0 && (
          <div className="avg-card">
            <span>Ø letzte 5 Spiele</span>
            <strong>{stats.avgLast5.toFixed(2)}</strong>
          </div>
        )}

        {stats.overallAvg > 0 && (
          <div className="avg-card">
            <span>Ø gesamt</span>
            <strong>{stats.overallAvg.toFixed(2)}</strong>
          </div>
        )}

        {stats.lostGames > 0 && (
          <div className="avg-card">
            <span>Verlorene Spiele</span>
            <strong>{stats.lostGames}</strong>
          </div>
        )}
      </div>

      {Object.keys(stats.distribution).length > 0 && (
        <div className="distribution">
          <span>Verteilung</span>

          {Object.entries(stats.distribution).map(([guess, count]) => (
            <div key={guess} className="bar-row">
              <span>{guess}</span>
              <div className="bar">
                <div
                  className="bar-fill"
                  style={{ width: `${count * 24}px` }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}