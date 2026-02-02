import Tile from './Tile.js';

function Row({ guess, statuses, shake }) {
  return (
    <div className={`row ${shake ? "shake" : ""}`}>
      {guess.split('').map((letter, index) => (
        <Tile
          key={index}
          letter={letter}
          status={statuses[index]}
        />
      ))}
    </div>
  );
}


export default Row;