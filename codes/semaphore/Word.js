class Word {

    /**
     * 
     * @param {String} word 
     * @returns a Word
     */
    constructor(word) {

        this.word = word;

        // Initialise starting point + bounds
        let nextPoint = new Point(0, 0);
        this.topLeft = new Point(500, 300);
        this.bottomRight = new Point(0, 0);

        // Create and join all the letters in the word
        word = word.toLowerCase();
        this.letters = [];
        let prevLetter = null;
        for (const c of word) {

            if (/[a-z]/.test(c)) {

                let letter = new Letter(c, nextPoint);
                letter.prev = prevLetter;

                if (this.#addLetter(letter)) {

                    // Update next point + bounds
                    nextPoint = letter.endpoint;

                    let bounds = letter.bounds();
                    this.topLeft.y = (bounds.top < this.topLeft.y ? bounds.top : this.topLeft.y);
                    this.topLeft.x = (bounds.left < this.topLeft.x ? bounds.left : this.topLeft.x);
                    this.bottomRight.y = (bounds.bottom > this.topLeft.y ? bounds.bottom : this.topLeft.y);
                    this.bottomRight.x = (bounds.right > this.topLeft.x ? bounds.right : this.topLeft.x);
                    prevLetter = letter;

                }
                else {
                    throw new Error(`Cannot find a non-intersecting layout for "${word}". Please find a synonym.`);
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
    #addLetter(letter) {

        console.log(letter.letter);
        console.log(letter.prev);

        // Base cases
        if (letter === null) {
            // Failure! If need to reorient letter 0, there is no non-intersecting layout
            console.log("Failure base case");
            return false;
        }
        if (letter.prev === null) {
            // Success! Can't overlap with nothing
            this.letters.push(letter);
            console.log("Success base case");
            return true;
        }

        // Find non-intersecting arrangement
        if (!Letter.checkIntersection(letter.prev, letter)) {

            // Success! Update the letters array
            this.letters.push(letter);
            return true;

        }
        else if (!letter.reanchored) {

            // Failure (so far)! Reanchor the letter and try again
            console.log(`Reanchoring: ${letter.letter}`);
            letter.reanchor();
            console.log(letter.letter);
            console.log(letter.prev);
            if (!Letter.checkIntersection(letter.prev, letter)) {
                // Success! Update the letters array
                this.letters.push(letter);
                return true;
            }

        }

        // Failure (so far)! Reanchor the prev letter and check the intersection
        console.log(`Reanchoring prev: ${letter.prev.letter}`);
        letter.prev.reanchor();
        this.letters.pop();
        console.log(`letters: ${this.letters.map((l) => {l.letter})}`);
        this.#addLetter(letter.prev);

    }
    

    /**
     * Draw the word.
     * 
     * @param {Point} startPoint 
     */
    draw(startPoint) {

        console.log(`Drawing word: ${this.word}`);
        console.log(`Start point: ${startPoint}`);

        let nextPoint = startPoint;

        for (let i = 0; i < this.letters.length; i++) {

            let letter = this.letters[i];
            console.log(`letter: ${this.word[i]}`);

            // Draw a join if necessary
            if (i > 0) {
                this.#drawJoin(nextPoint);
            }

            // Actually draw the letter
            ctx.beginPath();
            ctx.moveTo(nextPoint.x, nextPoint.y);

            nextPoint = Point.add(nextPoint, Point.subtract(letter.stroke1.end, letter.stroke1.start));
            ctx.lineTo(nextPoint.x, nextPoint.y);

            nextPoint = Point.add(nextPoint, Point.subtract(letter.stroke2.end, letter.stroke2.start));
            ctx.lineTo(nextPoint.x, nextPoint.y);

            ctx.stroke();

        }

    }

    /**
     * Draw a join.
     * 
     * @param {Point} point 
     */
    #drawJoin(point) {

        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();

    }

}