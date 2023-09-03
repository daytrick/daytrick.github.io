class Text {

    /**
     * 
     * @param {String} plaintext 
     */
    constructor(plaintext) {

        // Split plaintext into words
        plaintext = plaintext.toLowerCase();
        let plainwords = plaintext.split(/[\s\t\r?!/\,\\\-]/);

        // Generate the words
        this.words = [];
        for (const pw of plainwords) {

            try {
                let word = new Word(pw);
                this.words.push(word);
            }
            catch (e) {

                if (!(e instanceof EmptyWordError)) {
                    throw e;
                }
                
            }

        }

    }



    /**
     * Draw the text.
     */
    draw() {

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Start drawing
        let margin = 10;
        let startPoint = new Point(margin, margin);
        for (const word of this.words) {
            
            // Calculate offset
            let offset = new Point(0 - word.bounds.left, 0 - word.bounds.top);
            startPoint = Point.add(startPoint, offset);
            //startPoint = new Point(0, 0); /**@me remove later */
            
            // Check if need to start new column
            if (word.bounds.bottom + startPoint.y > canvasHeight) {
                startPoint = new Point(startPoint.x + margin, margin);
            }
            
            // Draw the word
            word.draw(startPoint);

            // Reset start point
            startPoint.y += word.height + margin;
            console.log(`New start point: ${startPoint}`);
            
        }

    }

}