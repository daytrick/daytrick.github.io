class Letter {

    /**
     * 
     * @param {String} letter 
     * @param {Boolean} reanchor 
     */
    constructor(letter, startPoint) {

        this.letter = letter;
        this.prev = null;
        this.reanchored = false;
        this.#setPoints(letter, false, startPoint);

    }

    /**
     * 
     * @param {String} letter 
     * @param {Boolean} reanchor 
     * @param {Point} startPoint 
     */
    #setPoints(letter, reanchor, startPoint) {

        if (mappings[letter] == undefined) {
            console.log("Undefined key");
            throw new UnencodableError(letter);
        }

        let stroke1 = lines[mappings[letter][0]];
        let stroke2 = lines[mappings[letter][1]];
        if (reanchor) {
            stroke1 = lines[mappings[letter][1]].map((e, i) => -e);
            stroke2 = lines[mappings[letter][0]].map((e, i) => -e);
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
        this.reanchored = true;
    }


    /**
     * 
     * @param {Letter} letter1 
     * @param {Letter} letter2 
     * @returns if the letters intersect
     */
    static checkIntersection(letter1, letter2) {

        if (letter1 == null || letter2 == null) {
            console.log("Found null letter");
            return false;
        }

        console.log("Checking intersection!");
        console.log(letter1.stroke1.start);
        console.log(letter2.stroke1.start);
    
        let intersect = false;
        for (const stroke1 of letter1.strokes()) {
            for (const stroke2 of letter2.strokes()) {
    
                if (this.#checkStrokeIntersection(stroke1, stroke2, letter1.endpoint)) {
                    console.log("Found intersection: " + letter1.letter + " and " + letter2.letter);
                    return true;
                }
    
            }
        }
    
        return intersect;
    
    }


    /**
     * 
     * @param {Stroke} stroke1 
     * @param {Stroke} stroke2 
     */
    static #checkStrokeIntersection(stroke1, stroke2, join) {

        // y = mx + c
        // If intersect, xs and ys are equal
        // m1x + c1 = m2x + c2
        // x = (c1 - c2) / (m2 - m1)
    
        // Find gradients and constants
        // m = y2 - y1 / x2 - x1
        // c = y - mx
        let m1, m2, c1, c2;
        if (stroke1.end.x >= stroke1.start.x) {
            m1 = Math.round((stroke1.end.y - stroke1.start.y) / (stroke1.end.x - stroke1.start.x));
            c1 = stroke1.start.y - (m1 * stroke1.start.x);
        }
        else {
            m1 = Math.round((stroke1.start.y - stroke1.end.y) / (stroke1.start.x - stroke1.end.x));
            c1 = stroke1.end.y - (m1 * stroke1.end.x);
        }
        if (stroke2.end.x >= stroke2.start.x) {
            m2 = Math.round((stroke2.end.y - stroke2.start.y) / (stroke2.end.x - stroke2.start.x));
            c2 = stroke2.start.y - (m2 * stroke2.start.x);
        }
        else {
            m2 = Math.round((stroke2.start.y - stroke2.end.y) / (stroke2.start.x - stroke2.end.x));
            c2 = stroke2.end.y - (m2 * stroke2.end.x);
        }

        // Find bounds
        let l1 = Math.min(stroke1.start.x, stroke1.end.x);
        let r1 = Math.max(stroke1.start.x, stroke1.end.x);
        let t1 = Math.min(stroke1.start.y, stroke1.end.y);
        let b1 = Math.max(stroke1.start.y, stroke1.end.y);
        let l2 = Math.min(stroke2.start.x, stroke2.end.x);
        let r2 = Math.max(stroke2.start.x, stroke2.end.x);
        let t2 = Math.min(stroke2.start.y, stroke2.end.y);
        let b2 = Math.max(stroke2.start.y, stroke2.end.y);

        // Consider two horizontal strokes
        if (m1 === 0 && m2 === 0) {
            let vAlign = (c1 == c2);
            let hAlign = (((l1 < l2) && (l2 < r1)) || ((l2 < l1) && (l1 < r2)));
            let intersect = vAlign && hAlign;
            console.log("Two horizontal strokes: " + intersect);
            if (intersect) {
                console.log("Gradient 1: " + m1);
                console.log("Gradient 2: " + m2);
                console.log("L1: " + l1);
                console.log("R1: " + r1);
                console.log("L2: " + l2);
                console.log("R2: " + r2);
                console.log("C1: " + c1);
                console.log("C2: " + c2);
                console.log(stroke1);
                console.log(stroke2);
            }
            return intersect;
        }
        // Consider two vertical strokes
        if (m1 == Infinity && m2 == Infinity) {
            // Check if the strokes touch anywhere that isn't the letter's end
            console.log("Two vertical strokes: " + (((t1 < c2) && (c2 < b1)) || ((t2 < c1) && (c1 < b2))));
            if (((t1 < c2) && (c2 < b1)) || ((t2 < c1) && (c1 < b2))) {
                console.log("Gradient 1: " + m1);
                console.log("Gradient 2: " + m2);
                console.log("C1: " + c1);
                console.log("C2: " + c2);
            }
            return (((t1 < c2) && (c2 < b1)) || ((t2 < c1) && (c1 < b2)));
        }
        // Consider one vertical stroke
        else if (m1 == Infinity || m2 == Infinity) {
        
            let x, m, c, t, b, l, r;
            if (m1 == Infinity) {
                x = l1;
                m = m2;
                c = c2;
                t = t1;
                b = b1;
                l = l2;
                r = r2;
            }
            else {
                x = l2;
                m = m1;
                c = c1;
                t = t2;
                b = b2;
                l = l1;
                r = r1;
            }

            let y = (m * x) + c;
            let vAlign = (t < y) && (y < b);
            let hAlign = (l < x) && (x < r);
            let intersect = vAlign && hAlign;
            console.log("One vertical stroke: " + intersect);
            if (intersect) {
                console.log("Gradient 1: " + m1);
                console.log("Gradient 2: " + m2);
                console.log("C: " + c);
                console.log("L: " + l);
                console.log("R: " + r);
                console.log("x: " + x);
                console.log("y: " + y);
            }
            return intersect;
        }
        // Consider overlapping strokes (full AND partial)
        if (m1 == m2) {
            let x = (c1 - c2) / (m2 - m1);
            console.log("Overlapping strokes: " + (((l1 < x) && (x < r1)) || ((l2 < x) && (x < r2))))
            if ((((l1 < x) && (x < r1)) || ((l2 < x) && (x < r2)))) {
                console.log("Gradient 1: " + m1);
                console.log("Gradient 2: " + m2);
                console.log("C1: " + c1);
                console.log("C2: " + c2);
            }
            return (((l1 < x) && (x < r1)) || ((l2 < x) && (x < r2)))
        }
        // Consider intersecting strokes
        if (m1 != m2) {
            let x = (c1 - c2) / (m2 - m1);
            let y = (m1 * x) + c1;

            let intersect = (((l1 < x) && (x < r1)) && ((l2 < x) && (x < r2)));
            console.log("Intersecting strokes: " + intersect);
            //let somewhereOtherThanTheJoin = (x != join.x) || (y != join.y);
            let somewhereOtherThanTheJoin = (round(x) != round(join.x)) || (round(y) != round(join.y));
            console.log("At somewhere other than the join: " + somewhereOtherThanTheJoin);
            
            if (intersect) {
                console.log(stroke1);
                console.log(stroke2);
                console.log("Gradient 1: " + m1);
                console.log("Gradient 2: " + m2);
                console.log("C1: " + c1);
                console.log("C2: " + c2);
                console.log("x: " + x);
                console.log("y: " + y);
                console.log(join);
            }
            return (intersect && somewhereOtherThanTheJoin);
        }
        // If get to here, they do not cross
    
    }

}