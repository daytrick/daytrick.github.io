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
        let columnWidth = 0;
        for (const word of this.words) {
            
            // Calculate offset
            let offset = new Point(0 - word.bounds.left, 0 - word.bounds.top);
            startPoint = Point.add(startPoint, offset);
            
            // Check if need to start new column
            if (word.bounds.bottom + startPoint.y > canvas.height) {
                startPoint = new Point(startPoint.x + columnWidth + margin, margin);
                columnWidth = 0;
            }

            // Update column width
            columnWidth = (columnWidth < word.width ? word.width : columnWidth);
            
            // Draw the word
            word.draw(startPoint);

            // Reset start point
            startPoint.x += word.bounds.left;
            startPoint.y += word.height + margin;
            
        }

    }

}