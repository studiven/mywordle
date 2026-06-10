const ROWS = [
  ['Q','W','E','R','T','Z','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Y','X','C','V','B','N','M']
];

export default function Keyboard({ guesses }) {
  const letterStatuses = {};

  guesses.forEach(({ word, statuses }) => {
    //jeder buchstabe
    word.split('').forEach((letter, i) => {
      const current = letterStatuses[letter];
      const next = statuses[i];
      //ist schon grün aus word vorher
      if (current === 'correct') return;
      //wird grün ist oke oder war noch nicht gelb dann überschreiben
      if (next === 'correct' || current !== 'present') {
        letterStatuses[letter] = next;
      }
    });
  });

  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map(key => (
            <div
              key={key}
              className={`keyboard-key ${letterStatuses[key] || ''}`}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}