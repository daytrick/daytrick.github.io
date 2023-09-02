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
        for (const c of word) {

            if (/[a-z]/.test(c)) {

                let letter = new Letter(c, nextPoint);

                if (this.#addLetter(letter)) {

                    // Update next point + bounds
                    nextPoint = letter.endpoint;

                    let bounds = letter.bounds();
                    console.log(`bounds: ${JSON.stringify(bounds)}`);
                    //this.topLeft.y = Math.min([this.topLeft.y, bounds.top]);
                    this.topLeft.y = (bounds.top < this.topLeft.y ? bounds.top : this.topLeft.y);
                    this.topLeft.x = (bounds.left < this.topLeft.x ? bounds.left : this.topLeft.x);
                    this.bottomRight.y = (bounds.bottom > this.topLeft.y ? bounds.bottom : this.topLeft.y);
                    this.bottomRight.x = (bounds.right > this.topLeft.x ? bounds.right : this.topLeft.x);

                }
                else {
                    throw new Error(`Cannot find a non-intersecting layout for "${word}". Please find a synonym.`);
                }

            }

        };

        console.log(`Top left: ${this.topLeft}`);
        console.log(`Bottom right: ${this.bottomRight}`);

    }

    /**
     * Add a letter to the word.
     * 
     * @param {Letter} letter 
     * @returns success/failure
     */
    #addLetter(letter) {

        // Base case
        if (letter === null) {
            // Failure! If need to reorient letter 0, there is no non-intersecting layout
            return false;
        }

        // Find non-intersecting arrangement
        if (!Letter.checkIntersection(letter.prev, letter)) {

            // Success! Update the letters array
            this.letters.push(letter);
            return true;

        }
        else if (!letter.reanchored) {

            // Failure (so far)! Reanchor the letter and try agains
            letter.reanchor();
            if (!Letter.checkIntersection(letter.prev, letter)) {
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
    

    /**
     * Draw the word.
     * 
     * @param {Point} startPoint 
     */
    draw(startPoint) {

        console.log(`Drawing word: ${this.word}`);
        console.log(`Start point: ${startPoint}`);

        for (let i = 0; i < this.letters.length; i++) {

            let letter = this.letters[i];
            console.log(`letter: ${this.word[i]}`);

            // Draw a join if necessary
            if (i > 0) {
                this.#drawJoin(startPoint);
            }

            // Actually draw the letter
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            console.log(startPoint);

            let nextPoint = Point.add(startPoint, letter.stroke1.end);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            console.log(nextPoint);

            nextPoint = Point.add(startPoint, letter.stroke2.end);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            console.log(nextPoint);

            ctx.stroke();

            startPoint = nextPoint;

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