import { useRef, useEffect, useState } from 'react';
import PlantTile from './PlantTile';

const STATUS_RANK = { correct: 3, present: 2, absent: 1, empty: 0 };

function getBestStatuses(guesses) {
  const best = ['empty', 'empty', 'empty', 'empty', 'empty'];
  guesses.forEach(({ word, statuses }) => {
    statuses.forEach((status, i) => {
      if ((STATUS_RANK[status] || 0) > (STATUS_RANK[best[i]] || 0)) {
        best[i] = status;
      }
    });
  });
  return best;
}

function getBestLetters(guesses) {
  const bestStatus = getBestStatuses(guesses);
  const bestLetters = [' ', ' ', ' ', ' ', ' '];
  guesses.forEach(({ word, statuses }) => {
    statuses.forEach((status, i) => {
      if (status === bestStatus[i]) {
        bestLetters[i] = word[i] || ' ';
      }
    });
  });
  return bestLetters;
}

export default function GardenScene({ guesses }) {
  const prevBestRef = useRef(['empty', 'empty', 'empty', 'empty', 'empty']);
  const [renderKey, setRenderKey] = useState(0);

  const bestStatuses = getBestStatuses(guesses);
  const bestLetters = getBestLetters(guesses);

  useEffect(() => {
    setRenderKey(k => k + 1);
    prevBestRef.current = bestStatuses;
  }, [guesses.length]);

  const prevBest = prevBestRef.current;

  return (
    <div className="garden-banner">

      {/* Sky — full width */}
      <div className="garden-sky">
        <svg width="100%" height="100%" viewBox="0 0 800 60" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="120" cy="28" rx="52" ry="16" fill="white" opacity="0.75" />
          <ellipse cx="155" cy="24" rx="32" ry="13" fill="white" opacity="0.6" />
          <ellipse cx="420" cy="32" rx="44" ry="15" fill="white" opacity="0.65" />
          <ellipse cx="455" cy="28" rx="28" ry="12" fill="white" opacity="0.55" />
          <ellipse cx="650" cy="22" rx="38" ry="13" fill="white" opacity="0.6" />
          <ellipse cx="678" cy="20" rx="22" ry="10" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Garden area — full width, plants centered */}
      <div className="garden-ground">

        {/* Decorative background grass tufts */}
        <div className="garden-grass-bg" />

        {/* Plants — centered, same width as the grid below */}
        <div className="garden-plants" key={renderKey}>
          {bestStatuses.map((status, i) => (
            <PlantTile
              key={i}
              status={status}
              letter={bestLetters[i]}
              prevStatus={prevBest[i]}
            />
          ))}
        </div>

        {/* Soil strip — full width */}
        <div className="garden-soil">
          <div className="garden-soil-dark" />
        </div>
      </div>

    </div>
  );
}
