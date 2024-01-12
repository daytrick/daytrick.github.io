class Word {

    /**
     * Make a Word.
     * 
     * @param {String} word the word
     * @returns a Word
     */
    constructor(word) {

        this.word = word;

        // Initialise starting point + bounds
        let startPoint = new Point(0, 0);

        // Create and join all the letters in the word
        try {

            // Make all lower case and strip punc
            word = word.toLowerCase().replaceAll(notAlphaNumR, "");
            console.log("Word: " + word);

            // Add number/letter indicators
            let tba = word.split("");
            let temp;
            let numSeqR = /[0-9]+/g;
            let offset = 0;
            while ((temp = numSeqR.exec(word)) !== null) {

                // Insert number indicator
                let seqLen = temp[0].length;
                tba.splice(numSeqR.lastIndex - seqLen + offset, 0, NUMBER); // can't use numSeqR.index bc that will give index of start of first ever match
                offset++;
                // Insert letter indicator
                tba.splice(numSeqR.lastIndex + offset, 0, LETTER);
                offset++;
                
            }

            // Remove trailing indicators
            let last = tba.pop();
            if (last != NUMBER && last != LETTER) {
                tba.push(last);
            }

            console.log(tba);

            // Start building the word
            this.letters = [];
            let firstLetter = new Letter(tba[0], startPoint);
            tba.shift();
            this.#addLetters(firstLetter, tba);

            // Work out the dimensions
            this.#calcDimensions();

        }
        catch (e) {

            console.log(e);
            throw new EmptyWordError();

        }

    }


    /**
     * Add one letter to a word,
     * so that the letter (and any previous letters)
     * are oriented to minimize overlapping lines.
     * 
     * @param {Letter} currLetter   letter being added
     * @param {String[]} tba        letters that still need to be added
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
                console.log("Adding next letter from case 2:");
                console.log(nextLetter);
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
            console.log("Pushing letter from case 3:");
            console.log(currLetter);
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
        else if (!currLetter.reanchored) {

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
        console.log("Prev letter: " + prevLetter);
        console.log(prevLetter != null);
        console.log(prevLetter.reanchored);
        if (prevLetter != null && !prevLetter.reanchored) {
            console.log(`Reanchoring prev: ${prevLetter.letter}`);
            this.letters.pop();
            prevLetter.reanchor();
            tba.unshift(currLetter.letter);
            console.log("TBA: " + tba);
            return this.#addLetters(prevLetter, tba);
        }


        // 6. Fail
        console.log("FAILING");
        return false;

    }


    /**
     * Calculate the dimensions of a word.
     */
    #calcDimensions() {

        let xs = this.letters.flatMap((l) => [l.stroke1.start.x, l.stroke1.end.x, l.stroke2.end.x]);
        let ys = this.letters.flatMap((l) => [l.stroke1.start.y, l.stroke1.end.y, l.stroke2.end.y]);

        this.bounds = {
            top: Math.min(...ys),
            left: Math.min(...xs),
            bottom: Math.max(...ys),
            right: Math.max(...xs)
        };

        this.height = this.bounds.bottom - this.bounds.top;
        this.width = this.bounds.right - this.bounds.left;

    }
    

    /**
     * Draw the word.
     * 
     * @param {Point} startPoint 
     */
    draw(startPoint) {

        let nextPoint = startPoint;
        console.log(nextPoint);

        for (let i = 0; i < this.letters.length; i++) {

            let letter = this.letters[i];

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