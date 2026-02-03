export default function Stats({ stats }) {
    return (
        <div className="stats">
            <h2>Statistik</h2>

            <div className="averages">
                <div className="avg-card">
                    <span>Ø letzte 5 Spiele</span>
                    <strong>{stats.avgLast5.toFixed(2)}</strong>
                </div>

                <div className="avg-card">
                    <span>Ø gesamt</span>
                    <strong>{stats.overallAvg.toFixed(2)}</strong>
                </div>

                <div className="avg-card">
                    <span>Verlorene Spiele</span>
                    <strong>{stats.lostGames}</strong>
                </div>
            </div>


            <div className="distribution">
                <span>Verteilung </span>

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
        </div>
    );
}
