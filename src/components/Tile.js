function Tile({ letter, status }) {
  let backgroundColor = '#ffffff';
  let borderColor = '#d3d6da';
  let color = '#1a1a1a';

  if (status === 'correct') {
    backgroundColor = '#6aaa64';
    borderColor = '#6aaa64';
    color = '#ffffff';
  } else if (status === 'present') {
    backgroundColor = '#c9b458';
    borderColor = '#c9b458';
    color = '#ffffff';
  } else if (status === 'absent') {
    backgroundColor = '#787c7e';
    borderColor = '#787c7e';
    color = '#ffffff';
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
        color: color,
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
