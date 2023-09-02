class Text {

    /**
     * 
     * @param {String} plaintext 
     */
    constructor(plaintext) {

        // Split plaintext into words
        plaintext = plaintext.toLowerCase();
        let plainwords = plaintext.split(/[\s\t\r?!/\,\\\-]/);
        console.log(`plainwords: ${plainwords}`);

        // Generate the words
        this.words = [];
        for (const pw of plainwords) {

            try {
                let word = new Word(pw);
                this.words.push(word);
                console.log(`Text: ${plaintext}`);
            }
            catch (e) {
                throw e;
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
            let offset = new Point(0 - word.topLeft.x, 0 - word.topLeft.y);
            startPoint = Point.add(startPoint, offset);
            
            // Check if need to start new column
            if (word.bottomRight.y + startPoint.y > canvasHeight) {
                startPoint = new Point(startPoint.x + margin, margin);
                console.log("Starting new column!");
            }
            
            // Draw the word
            word.draw(startPoint);

            // Move start point down a bit
            startPoint.y += word.bottomRight.y + margin;
            
        }

        console.log("Finished drawing!");

    }

}