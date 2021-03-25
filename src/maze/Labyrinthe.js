import {Graphe} from "./Graphe.js"
import {Coords, Mur} from "../util/Coords.js";

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
		this.ouvertures = [] // liste des 2 cellules (forcément latérales) où se situent les ouvertures vers l'extérieur
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

	toutesCellulesLaterales() {
		let l = []
		for (let y = 0; y < this.height; y++) {
			l.push(new Coords(x = 0, y))
			l.push(new Coords(x = this.width-1, y))
		}
		for (let x = 1; x < this.width-1; x++) {
			l.push(new Coords(x, y = 0))
			l.push(new Coords(x, y = this.height-1))
		}
		return l
	}

	trouverPlusLongChemin() {
		let l = toutesCellulesLaterales()
		let c = 0 //chemin
		for (i of l.lengh) {
			for (jesaispasquoimettre ;_;) {
				let g = Graphe.chemin(x, y)
				if (g.lengh > c) {
					c = g.lengh
				}
			}
		}
		return //tableau de cellules
	}

	/**aller d'un point a à un point b avec le plus court chemin (methode d'axel dans Graphe)
	 * quel point a, quel point b ? (les plus éloignés possibles)
	 * utiliser chemin(x, y)
     */
}
