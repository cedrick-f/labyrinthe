import {generatorFromName} from "./LabyrintheGenerator.js";
import {Graphe} from "./Graphe.js"

export class Labyrinthe {
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {('fusion'|'prim'|'aldous-broder')} generatorName
     */
    constructor(width, height, generatorName) {
        this.width = width
        this.height = height
		this.graphe = new Graphe()
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
		if (ws > 0) {
			l.push([[hs, ws],[hs, ws - 1]])
			
		}
		if (ws < this.width-1) {
			l.push([[hs, ws],[hs, ws + 1]])
			
		}
		if (hs > 0) {
			l.push([[hs, ws],[hs - 1, ws]])
			
		}
		if (hs < this.height-1) {
			l.push([[hs, ws],[hs + 1, ws]])
			
		}
		return l
	}
	
	voisinsCellule(s) {
		let ws = s[1]
		let hs = s[0]
		let l = []
		if (ws > 0) {
			l.push([[hs, ws - 1]])
		}
		if (ws < this.width) {
			l.push([[hs, ws + 1]])
		}
		if (hs > 0) {
			l.push([[hs - 1, ws]])
		}
		if (hs < this.height) {
			l.push([[hs + 1, ws]])
		}
		return l
	}
	
	ouvrir_passage(x, y) {
		let nx = this.identifiantCellule(x[0], x[1])
		let ny = this.identifiantCellule(y[0], y[1])
		if (this.mursCellule(nx).includes(ny)) {
			this.graphe.ajouter_arete(x, y)
		}
	}
	
	/**
	 * //renvoie true s'il y a pas d'arrete au sens graphe entre deux cellules
     * @param {number} ax 
     * @param {number} ay 
	  * @param {number} bx 
	  * @param {number} by 
	  * @return {boolean}
     */
	murEntre(ax, ay, bx, by) {
		Graphe.voisins()
		return true
	}
	
	identifiantCellule(l, c) {
		return l * this.width + c
	}
	
}


