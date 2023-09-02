class Word {

    /**
     * 
     * @param {String} word 
     * @returns a Word
     */
    constructor(word) {

        // Initialise starting point + bounds
        let nextPoint = new Point(0, 0);
        this.topLeft = new Point(500, 300);
        this.bottomRight = new Point(0, 0);

        // Create and join all the letters in the word
        word = word.toLowerCase();
        this.letters = [];
        for (const c of word) {

            if (/[a-z]/.test(c)) {

                let letter = new Letter(c, false, nextPoint);

                if (this.addLetter(letter)) {

                    // Update next point + bounds
                    nextPoint = letter.endpoint;

                    let bounds = letter.bounds();
                    this.topLeft.y = (bounds.top < this.topLeft.y ? bounds.top : this.topLeft.y);
                    this.topLeft.x = (bounds.left < this.topLeft.x ? bounds.left : this.topLeft.x);
                    this.bottomRight.y = (bounds.bottom > this.topLeft.y ? bounds.bottom : this.topLeft.y);
                    this.bottomRight.x = (bounds.right > this.topLeft.x ? bounds.right : this.topLeft.x);

                }
                else {
                    return false;
                }

            }

        };

    }

    /**
     * Add a letter to the word.
     * 
     * @param {Letter} letter 
     * @returns success/failure
     */
    addLetter(letter) {

        // Base case
        if (letter === null) {
            // Failure! If need to reorient letter 0, there is no non-intersecting layout
            return false;
        }

        // Find non-intersecting arrangement
        if (!checkLetterIntersection(letter.prev, letter)) {

            // Success! Update the letters array
            this.letters.push(letter);
            return true;

        }
        else if (!letter.reanchored) {

            // Failure (so far)! Reanchor the letter and try agains
            letter.reanchor();
            if (!checkLetterIntersection(letter.prev, letter)) {
                // Success! Update the letters array
                this.letters.push(letter);
                return true;
            }

        }

        // Failure (so far)! Reanchor the prev letter and check the intersection
        letter.prev.reanchor();
        this.letters.pop();
        this.addLetter(letter.prev);

    }
    
}