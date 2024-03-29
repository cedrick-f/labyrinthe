import {Graphe} from "./Graphe.js"
import {Coords, Mur} from "../util/Coords.js";
import {manhattanDistance} from "../util/Distance.js";

export class Labyrinthe {
	/**
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(width, height) {
		this.width = width
		this.height = height
		this.graphe = new Graphe()
		this.creerCellules()
		/** @type {[Coords, Coords]} */
		this.ouvertures = [new Coords(0, 0), new Coords(width - 1, height - 1)] // tuple des 2 cellules (forcément latérales) où se situent les ouvertures vers l'extérieur
	}

	/**
	 * Création de tous les sommets du graphe (cellules du labyrinthe)
	 */
	creerCellules() {
		this.graphe.razSommets();
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				this.graphe.ajouter_sommet(Coords.identifiant(x, y, this))
			}
		}
	}


	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {Coords[]}
	 */
	voisinsCellule(x, y) {
		let l = []
		if (x > 0) {
			l.push(new Coords(x - 1, y))
		}
		if (x < this.width-1) {
			l.push(new Coords(x + 1, y))
		}
		if (y > 0) {
			l.push(new Coords(x, y - 1))
		}
		if (y < this.height-1) {
			l.push(new Coords(x, y + 1))
		}
		return l
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {Mur[]}
	 */
	mursCellule(x, y) {
		return this.voisinsCellule(x, y).map(voisin => new Mur(new Coords(x, y), voisin));
	}

	/**
	 * Retourne un tableau avec l'ensemble des murs, qu'ils soient ouverts ou fermés.
	 *
	 * @return {Mur[]}
	 */
	tousLesMurs() {
		let l = []
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (x < this.width-1) {
					l.push(new Mur(new Coords(x, y), new Coords(x+1, y)))
				}
				if (y < this.height-1) {
					l.push(new Mur(new Coords(x, y), new Coords(x, y+1)))
				}
			}
		}
		return l
	}

	/**
	 * @param {Coords} a
	 * @param {Coords} b
	 */
	ouvrir_passage(a, b) {
		this._verifierVoisins(a, b)
		this.graphe.ajouter_arete(a.identifiant(this), b.identifiant(this))
	}

	/**
	 * @param {Coords} a
	 * @param {Coords} b
	 */
	fermerPassage(a, b) {
		this._verifierVoisins(a, b)
		this.graphe.retirerArete(a.identifiant(this), b.identifiant(this))
	}

	/**
	 * @param {Coords} a
	 * @param {Coords} b
	 * @private
	 */
	_verifierVoisins(a, b) {
		if (!a.inRange(this) || !b.inRange(this) || manhattanDistance(a, b) !== 1) {
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

	/**
	 * Ferme tous les murs entre les cellules.
	 */
	fermerTousLesMurs() {
		this.graphe.razAretes();
	}

	/**
	 * Retire tous les murs entre les cellules du labyrinthe.
	 */
	 ouvrirTousLesMurs() {
		for (let mur of this.tousLesMurs()) {
			this.ouvrir_passage(mur.a, mur.b)
		}
	}

	/**
	 * @return {Coords[]}
	 */
	toutesCellulesLaterales() {
		let l = []
		for (let y = 0; y < this.height; y++) {
			l.push(new Coords(0, y))
			l.push(new Coords(this.width-1, y))
		}
		for (let x = 1; x < this.width-1; x++) {
			l.push(new Coords(x, 0))
			l.push(new Coords(x, this.height-1))
		}
		return l
	}

	/**
	 * Cherche le plus long chemin entre deux cellules latérales.
	 *
	 * @return {[Coords, Coords]} Entrée et sortie du labyrinthe.
	 */
	trouverPlusLongChemin() {
		let l = this.toutesCellulesLaterales()
		let compteChemin = 0
		for (let i = 0; i < l.length; i++) {
			for (let j = i + 1; j < l.length; j++) {
				let g = this.graphe.chemin(l[i].identifiant(this), l[j].identifiant(this))
				if (g.length > compteChemin) {
					compteChemin = g.length
					this.ouvertures = [l[i], l[j]]
				}
			}
		}
		return this.ouvertures
	}

}

export class LabyrintheImage extends Labyrinthe {

	/**
	 * @param {ImageData} imageData
	 */
	constructor(imageData) {
		super(imageData.width, imageData.height)
		this.imageData = imageData
	}

	murEntre(ax, ay, bx, by) {
		const index = (bx + by * this.width) * 4
		return this.imageData.data[index] < 220 || this.imageData.data[index + 1] < 220 || this.imageData.data[index + 2] < 220
	}
}
