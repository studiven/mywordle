function Tile({ letter, status}) {
    
    let backgroundColor = '#3a3a3c'; // Standard grau
    
    if (status === 'correct') {
      backgroundColor = '#538d4e'; // grün
    } else if (status === 'present') {
      backgroundColor = '#b59f3b'; // gelb
    } else if (status === 'absent') {
      backgroundColor = '#3a3a3c'; // dunkelgrau
    }
  
    return (
        <div style={{
           width: '60px',
           height: '60px',
           border: '2px solid #3a3a3c',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           fontSize: '32px',
           fontWeight: 'bold',
           color: 'white',
           backgroundColor: backgroundColor,
           margin: '2px'
         }}>
           {letter}
         </div>
  );
}

export default Tile;