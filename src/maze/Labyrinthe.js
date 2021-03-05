import {generatorFromName} from "./LabyrintheGenerator.js";

export class Labyrinthe {
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {('fusion'|'prim'|'aldous-broder')} generatorName
     */
    constructor(width, height, generatorName) {
        this.width = width;
        this.height = height;
    }

    /**
     * @param {function (Mur): void} [callback]
     */
    generate(callback) {
        
    }
}