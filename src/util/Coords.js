export class Coords {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {Coords} coords
     * @return {boolean}
     */
    equals(coords) {
        return this.x === coords.x && this.y === coords.y
    }

    /**
     * @param {Labyrinthe} labyrinthe
     * @return {number}
     */
    identifiant(labyrinthe) {
        return Coords.identifiant(this.x, this.y, labyrinthe)
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Labyrinthe} labyrinthe
     * @return {number}
     */
    static identifiant(x, y, labyrinthe) {
        return x + y * labyrinthe.width
    }

    /**
     * @param {number} identifiant
     * @param {Labyrinthe} labyrinthe
     * @return {Coords}
     */
    static fromIdentifiant(identifiant, labyrinthe) {
        return new Coords(identifiant % labyrinthe.width, Math.floor(identifiant / labyrinthe.width))
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