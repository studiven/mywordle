function Tile({ letter, status }) {
  let backgroundColor = '#3a3a3c'; // leer
  let borderColor = '#3a3a3c';

  if (status === 'correct') {
    backgroundColor = '#538d4e';
    borderColor = '#538d4e';
  } else if (status === 'present') {
    backgroundColor = '#b59f3b';
    borderColor = '#b59f3b';
  } else if (status === 'absent') {
    backgroundColor = '#1f1f1f'; // dunkler als leer
    borderColor = '#1f1f1f';
  }

  return (
    <div
      style={{
        width: '60px',
        height: '60px',
        border: `2px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: backgroundColor,
        margin: '2px',
        textTransform: 'uppercase',
        transition: 'background 0.2s, border 0.2s',
      }}
    >
      {letter}
    </div>
  );
}

export default Tile;
