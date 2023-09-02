class Point {

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Point(this.x, this.y);
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }

    /**
     * Add two points together.
     * 
     * @param {Point} point1 
     * @param {Point} point2 
     * @returns 
     */
    static add(point1, point2) {

        return new Point(point1.x + point2.x, point1.y + point2.y);

    }

}

