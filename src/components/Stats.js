export default function Stats({ stats }) {
  return (
    <>
      <h2>Statistiken</h2>
      <p>Ø letzte 5: {stats.avgLast5.toFixed(2)}</p>
      <p>Ø gesamt: {stats.overallAvg.toFixed(2)}</p>
      <p>Verloren: {stats.lostGames}</p>

      <h3>Verteilung</h3>
      <ul>
        {[1,2,3,4,5,6].map(n => (
          <li key={n}>
            {n}: {stats.distribution[n] || 0}
          </li>
        ))}
      </ul>
    </>
  );
}
