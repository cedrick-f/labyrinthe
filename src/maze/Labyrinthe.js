import {generatorFromName} from "./LabyrintheGenerator.js";
import {Graphe} from "./Graphe.js"
import {Coords} from "../util/Coords";

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

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {Coords[]}
	 */
	voisinsCellule(x, y) {
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

	/**
	 * @param {Coords} a
	 * @param {Coords} b
	 */
	ouvrir_passage(a, b) {
		if (this.voisinsCellule(a.x, a.y).some(cellule => cellule.equals(b))) {
			this.graphe.ajouter_arete(a.identifiant(this), b.identifiant(this))
		} else {
			throw new Error('Impossible d\'ouvrir un passage entre des cellules non voisines.')
		}
	}
	
	/**
	 * Retourne true s'il y a pas d'arête au sens graphe entre deux cellules
     *
	 * @param {number} ax
     * @param {number} ay 
	 * @param {number} bx
	 * @param {number} by
	 * @return {boolean}
     */
	murEntre(ax, ay, bx, by) {
		return !this.graphe.voisins(Coords.identifiant(ax, ay, this)).has(Coords.identifiant(bx, by, this))
	}
}
