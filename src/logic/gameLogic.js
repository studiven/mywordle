

export function checkGuess(guess, targetWord) {
    const result = [];

    if (guess.length === targetWord.length) {
        for (let i = 0; i < guess.length; i++) {
                let found = false; 
                //correct
                if (guess[i] === targetWord[i]) {
                    result.push('correct'); 
                } else {

                    for (let j = 0; j < targetWord.length; j++) {
                        //present but wrong spot
                        if (guess[i] === targetWord[j]) {
                            found = true; 
                        } 
                    }

                    if (found) {
                    result.push("present");
                    }
                    else {
                        //absent
                        result.push('absent'); 
                    }
                }
            
        }
    }
    
    return result;

}