class Letter {

    /**
     * 
     * @param {String} letter 
     * @param {Boolean} reanchor 
     */
    constructor(letter, startPoint) {

        this.letter = letter;
        this.prev = null;
        this.#setPoints(letter, false, startPoint);

    }

    /**
     * 
     * @param {Letter} letter 
     * @param {Boolean} reanchor 
     * @param {Point} startPoint 
     */
    #setPoints(letter, reanchor, startPoint) {

        let stroke1 = lines[mappings[letter][0]];
        let stroke2 = lines[mappings[letter][1]];
        if (reanchor) {
            stroke1 = lines[mappings[letter][1]];
            stroke2 = lines[mappings[letter][0]];
        }
        this.reanchored = reanchor;

        let point1 = startPoint.copy();
        let point2 = new Point(point1.x + stroke1[0], point1.y + stroke1[1]);
        let point3 = new Point(point2.x + stroke2[0], point2.y + stroke2[1]);

        this.stroke1 = new Stroke(point1, point2);
        this.stroke2 = new Stroke(point2, point3);
        this.endpoint = this.stroke2.end;

    }

    strokes() {
        return [this.stroke1, this.stroke2];
    }

    /**
     * Get the bounds of the letter.
     */
    bounds() {

        let xs = [this.stroke1.start.x, this.stroke1.end.x, this.stroke2.end.x];
        let ys = [this.stroke1.start.y, this.stroke1.end.y, this.stroke2.end.y];

        return {
            top: Math.min(...ys),
            left: Math.min(...xs),
            bottom: Math.max(...ys),
            right: Math.max(...xs)
        };

    }


    reanchor() {
        this.#setPoints(this.letter, true, this.stroke1.start);
    }


    /**
     * 
     * @param {Letter} letter1 
     * @param {Letter} letter2 
     * @returns if the letters intersect
     */
    static checkIntersection(letter1, letter2) {

        if (letter1 == null || letter2 == null) {
            return false;
        }
    
        for (const stroke1 of letter1.strokes()) {
            for (const stroke2 of letter2.strokes()) {
    
                if (this.#checkStrokeIntersection(stroke1, stroke2)) {
                    return true;
                }
    
            }
        }
    
        return false;
    
    }


    /**
     * 
     * @param {Stroke} stroke1 
     * @param {Stroke} stroke2 
     */
    static #checkStrokeIntersection(stroke1, stroke2) {

        // y = mx + c
        // If intersect, ys are equal
        // m1x + c1 = m2x + c2
        // x = (c1 - c2) / (m2 - m1)
    
        // Find gradients
        let m1 = (stroke1.end.y - stroke1.start.y) / (stroke1.end.x - stroke1.start.x);
        let m2 = (stroke2.end.y - stroke2.start.y) / (stroke2.end.x - stroke2.start.x);
    
        // Force gradients to be positive + reverse the constant shifts if necessary
        let c1, c2;
        if (m1 >= 0) {
            c1 = stroke1.start.y;
        }
        else {
            m1 = -m1;
            c1 = stroke1.end.y;
        }
        if (m2 >= 0) {
            c1 = stroke1.start.y;
        }
        else {
            m2 = -m2;
            c2 = stroke2.end.y;
        }
    
        // Find x
        if (m1 != m2) {
            let x = (c1 - c2) / (m2 - m1);
            // Check that the intersection is within bounds for the stroke
            return (stroke2.start.x <= x) && (x <= stroke2.end.x);
        }
        else {
            // Check if the strokes touch
            return (c1 == c2);
        }
    
    }

}