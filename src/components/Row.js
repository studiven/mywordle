import Tile from './Tile.js';

function Row({ guess, statuses}) {

  return (
    <div style={{ display: 'flex' }}>
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