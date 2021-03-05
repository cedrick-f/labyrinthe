export class Coords {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Mur {
    /***
     * @param {Coords} a
     * @param {Coords} b
     */
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}