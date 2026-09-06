import { checkGuess } from './gamelogic';

describe('checkGuess', () => {
  it('markiert alle Buchstaben als "correct" bei exaktem Treffer', () => {
    expect(checkGuess('CLOUD', 'CLOUD')).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  });

  it('markiert alle Buchstaben als "absent" wenn kein Buchstabe vorkommt', () => {
    expect(checkGuess('BROKY', 'HAUSE')).toEqual(['absent', 'absent', 'absent', 'absent', 'absent']);
  });

  it('Prüft das doppelte Buchstaben im Versuchswort sowie im Targetwort richtig makiert sind', () => {
    expect(checkGuess('ANNAL', 'BANAL')).toEqual(['present', 'absent', 'correct', 'correct', 'correct']);
  });

  it('Prüft das doppelte Buchstaben im Versuchswort sowie im Targetwort richtig makiert sind', () => {
    expect(checkGuess('UNION', 'BANAL')).toEqual(['absent', 'present', 'absent', 'absent', 'absent']);
  });

  it('markiert vorhandene, aber falsch platzierte Buchstaben als "present"', () => {
    expect(checkGuess('SAUHE', 'HASEN')).toEqual(['present', 'correct', 'absent', 'present', 'present']);
  });

});