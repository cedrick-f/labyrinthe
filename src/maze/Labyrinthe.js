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
	
	/** tester les résultats et changer les + et -
	*/
	mursCellule(s){
		let ws = s[1]
		let hs = s[0]
		let l = []
		if (ws !== 0) {
			l.push([[hs, ws],[hs, ws + 1]])
		}
		if (ws !== this.width-1) {
			l.push([[hs, ws],[hs, ws + 1]])
		}
		if (hs !== 0) {
			l.push([[hs, ws],[hs + 1, ws]])
		}
		if (hs !== this.height-1) {
			l.push([[hs, ws],[hs + 1, ws]])
		}
		return l
	}
	
	voisinsCellule(s) {
		let ws = s[0]
		let hs = s[1]
		let l = []
		if (ws !== 0) {
			l.push([[hs, ws + 1]])
		}
		if (ws !== this.width) {
			l.push([[hs, ws + 1]])
		}
		if (hs !== 0) {
			l.push([[hs + 1, ws]])
		}
		if (hs !== this.height) {
			l.push([[hs - 1, ws]])
		}
		return l
	}
	
	/**
     * @param {number} ax 
     * @param {number} ay 
	  * @param {number} bx 
	  * @param {number} by 
	  * @return {boolean}
     */
	murEntre(ax, ay, bx, by) {
		return true
	}
}


