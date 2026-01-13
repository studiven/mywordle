

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

                        if (((guess.match(new RegExp(guess[i],"g")) || []).length) >= 2) {
                            let matched = false; 
                            for(let k = 0; k < guess.length; k++) {

                            if ((guess[i] === guess[k] && i !== k && i > k) || (i <= k && guess[k] === guess[i] && guess[k] === targetWord[k])) {
                                result.push('absent');  
                                matched = true; 
                            }
                            }
                            if (!matched) {
                                result.push('present')
                            }
                        } else {
                            result.push('present'); 
                        }

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