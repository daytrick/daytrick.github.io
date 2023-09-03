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

        // Create and join all the letters in the word
        try {

            word = word.toLowerCase();
            this.letters = [];

            let tba = word.split("");
            console.log(tba);
            let firstLetter = new Letter(tba[0], new Point(0, 0));
            tba.shift();
            this.#addLetters(firstLetter, tba);

            // Work out the dimensions
            this.#calcDimensions();

        }
        catch (e) {

            throw new EmptyWordError();

        }

    }


    /**
     * 
     * @param {Letter} currLetter
     * @param {String[]} tba 
     */
    #addLetters(currLetter, tba) {

        console.log(`Adding letter: ${currLetter.letter}`);
        console.log(tba);

        // Base case
        // 1. Success! Added all the letters
        if (currLetter == null || currLetter == undefined) {
            console.log("Success base case");
            return true;
        }

        // Recursive cases
        // 2. Success! Can't overlap with nothing
        if (this.letters.length == 0) {

            this.letters.push(currLetter);
            if (tba.length > 0) {
                let nextLetter = new Letter(tba[0], currLetter.endpoint);
                tba.shift();
                return this.#addLetters(nextLetter, tba);
            }
            else {
                return true;
            }


        }

        // *. Prep for more complicated recursive cases
        let prevLetter = this.letters[this.letters.length - 1];

        // 3. Success! Found non-intersecting arrangement
        if (!Letter.checkIntersection(prevLetter, currLetter)) {

            // Success! Update the letters array
            this.letters.push(currLetter);
            if (tba.length > 0) {
                let nextLetter = new Letter(tba[0], currLetter.endpoint);
                tba.shift();
                return this.#addLetters(nextLetter, tba);
            }
            else {
                return true;
            }

        }

        // 4. Reanchor the letter and try again
        if (!currLetter.reanchored) {

            console.log(`Reanchoring: ${currLetter.letter}`);
            currLetter.reanchor();
            console.log(currLetter.letter);
            console.log(prevLetter.letter);

            if (!Letter.checkIntersection(prevLetter, currLetter)) {
                // Success! Update the letters array
                this.letters.push(currLetter);
                if (tba.length > 0) {
                    let nextLetter = new Letter(tba[0], currLetter.endpoint);
                    tba.shift();
                    return this.#addLetters(nextLetter, tba);
                }
                else {
                    return true;
                }
            }

        }

        // 5. Reanchor the prev letter and check the intersection
        console.log(`Reanchoring prev: ${prevLetter.letter}`);
        this.letters.pop();
        prevLetter.reanchor();
        tba.unshift(currLetter.letter);
        return this.#addLetters(prevLetter, tba);

    }


    #calcDimensions() {

        console.log("letters: " + this.letters.map((l) => l.letter));

        console.log(this.letters);

        let xs = this.letters.flatMap((l) => [l.stroke1.start.x, l.stroke1.end.x, l.stroke2.end.x]);
        let ys = this.letters.flatMap((l) => [l.stroke1.start.y, l.stroke1.end.y, l.stroke2.end.y]);

        console.log(`xs: ${xs}`);
        console.log(`ys: ${ys}`);

        this.bounds = {
            top: Math.min(...ys),
            left: Math.min(...xs),
            bottom: Math.max(...ys),
            right: Math.max(...xs)
        };

        this.height = this.bounds.bottom - this.bounds.top;
        this.width = this.bounds.right - this.bounds.left;

        console.log(`bounds: ${this.bounds}`);
        console.log(`height: ${this.height}`);
        console.log(`width: ${this.width}`);

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



class EmptyWordError extends Error {

    constructor() {
        super();
        this.message = "Empty word";
        this.name = "EmptyWordError";
    }

}