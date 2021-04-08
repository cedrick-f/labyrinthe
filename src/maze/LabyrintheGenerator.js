import {Coords, Mur} from "../util/Coords.js";
import {randomInt, randomChoice, shuffle} from "../util/Random.js";

/**
 * @param {('random'|'fusion'|'prim'|'aldous-broder'|'recursive-backtracker'|'recursive-division')} name
 * @param {Labyrinthe} labyrinthe
 * @return {MazeGenerator}
 */
export function generatorFromName(name, labyrinthe) {
	switch (name) {
		case "aldous-broder":
			return new AldousGenerator(labyrinthe)
		case "fusion":
			return new FusionGenerator(labyrinthe)
		case "recursive-backtracker":
			return new GrowingTreeGenerator(labyrinthe, false)
		case "prim":
			return new GrowingTreeGenerator(labyrinthe, true)
		case "recursive-division":
			return new RecursiveDivision(labyrinthe)
		default:
			return new MazeGenerator(labyrinthe)
	}
}

/**
 * Base pour un générateur de labyrinthe, à étendre.
 */
class MazeGenerator {

	/**
	 * Le générateur reçoit en paramètre le labyrinthe.
	 *
	 * @param {Labyrinthe} labyrinthe
	 */
	constructor(labyrinthe) {
		this.labyrinthe = labyrinthe
		labyrinthe.fermerTousLesMurs()
	}

	/**
	 * Effectue le prochain tour de génération, pour par exemple ouvrir un mur.
	 *
	 * @returns {VueParameters} Paramètres à passer à l'interface graphique.
	 */
	next() {
		return {}
	}

	/**
	 * Retourne true s'il reste au moins une étape de construction.
	 *
	 * @return {boolean}
	 */
	hasNext() {
		return false
	}
}

class GrowingTreeGenerator extends MazeGenerator {
	/**
	 * @param {Labyrinthe} labyrinthe
	 * @param {boolean} chooseRandom Si vrai, = algorithme Prim, sinon = recursive backtracking
	 */
	constructor(labyrinthe, chooseRandom) {
		super(labyrinthe)
		/** @type {Coords[]} */
		this.cells = [new Coords(randomInt(labyrinthe.width), randomInt(labyrinthe.height))]
		/** @type {Set<number>} */
		this.visited = new Set([this.cells[0].identifiant(labyrinthe)])
		this.chooseRandom = chooseRandom
	}

	/**
	 * @returns {VueParameters}
	 */
	next() {
		const cellIndex = this.chooseRandom ? randomInt(this.cells.length) : this.cells.length - 1
		const cell = this.cells[cellIndex]

		const neighbors = this.labyrinthe.voisinsCellule(cell.x, cell.y)
			.filter(neighbor => !this.visited.has(neighbor.identifiant(this.labyrinthe)))
		if (neighbors.length) {
			const neighbor = randomChoice(neighbors)
			this.labyrinthe.ouvrir_passage(cell, neighbor)
			this.cells.push(neighbor)
			this.visited.add(neighbor.identifiant(this.labyrinthe))
		} else {
			if (this.chooseRandom) {
				this.cells.splice(cellIndex, 1)
			} else {
				this.cells.pop()
			}
		}

		return { current: cell, visited: this.visited }
	}

	hasNext() {
		return this.cells.length > 0
	}
}

/**
 * Algorithme de fusion aléatoire
 */
class FusionGenerator extends MazeGenerator {

	/**
	 * @param {Labyrinthe} labyrinthe
	 */
	constructor(labyrinthe) {
		super(labyrinthe);
		const size = labyrinthe.width * labyrinthe.height

		this.grille = {}
		for (let c = 0; c < size; c++) {
			this.grille[c] = c
		}
		
		this.murs = shuffle(labyrinthe.tousLesMurs());
	}

	/**
	 * @returns {VueParameters}
	 */
	next() {
		const mur = this.murs[0];
		let a = mur.a.identifiant(this.labyrinthe)
		let b = mur.b.identifiant(this.labyrinthe)
		if (this.grille[a] !== this.grille[b]) {
			this.labyrinthe.ouvrir_passage(mur.a, mur.b);
			let ch = this.labyrinthe.graphe.parcours_profondeur(mur.a.identifiant(this.labyrinthe))
			for (let c of ch) {
				this.grille[c] = this.grille[a];
			}
		}
		this.murs.splice(0, 1);
		return { current: mur, grille: this.grille }
	}

	/**
	 * @return {boolean}
	 */
	hasNext() {
		return this.murs.length > 0;
	}
}

/**
 * Un générateur qui choisit des murs de manière totalement aléatoire, ce qui ne crée pas un labyrinthe parfait.
 */
class RandomGenerator extends MazeGenerator {

	/**
	 * @param {Labyrinthe} labyrinthe
	 */
	constructor(labyrinthe) {
		super(labyrinthe)
		this.n = labyrinthe.width * labyrinthe.height
	}

	/**
	 * @returns {VueParameters}
	 */
	next() {
		const x = randomInt(this.labyrinthe.width)
		const y = randomInt(this.labyrinthe.height)
		this.n--
		const mur = new Mur(new Coords(x, y), randomChoice(this.labyrinthe.voisinsCellule(x, y)))
		this.labyrinthe.ouvrir_passage(mur.a, mur.b)
		return { current: mur }
	}

	/**
	 * @return {boolean}
	 */
	hasNext() {
		return this.n > 0
	}
}

/**
 * Algorithme d'Aldous-Broder
 */
class AldousGenerator extends MazeGenerator {

	/**
	 * @param {Labyrinthe} labyrinthe
	 */
	constructor(labyrinthe) {
		super(labyrinthe)
		this.current = new Coords(randomInt(labyrinthe.width), randomInt(labyrinthe.height))
		this.visited = new Set()
		this.n = labyrinthe.width * labyrinthe.height
	}

	/**
	 * @returns {VueParameters}
	 */
	next() {
		this.visited.add(this.current.identifiant(this.labyrinthe))
		const cell = randomChoice(this.labyrinthe.voisinsCellule(this.current.x, this.current.y))
		if (!this.visited.has(cell.identifiant(this.labyrinthe))) {
			this.labyrinthe.ouvrir_passage(this.current, cell)
		}
		this.current = cell
		return { current: this.current, visited: this.visited }
	}

	/**
	 * @return {boolean}
	 */
	hasNext() {
		return this.n > this.visited.size
	}
}

/**
 * 
 */
class PrimGenerator extends MazeGenerator {

	/**
	 * @param {Labyrinthe} labyrinthe
	 */
	constructor(labyrinthe) {
		super(labyrinthe)
        this.cellules = labyrinthe.toutesCellulesLaterales() //toutes les cellules
        const start = randomChoice(this.cellules)
        this.murs = labyrinthe.mursCellule(start.x, start.y) //murs autours d'une cellule aléatoire
	}

	/**
	 * @returns {VueParameters}
	 */
	next() {
		let r = randomChoice(this.murs)
		console.log(r)
		if (this.cellules.some(cell => cell.equals(r[0])) 
			|| this.cellules.some(cell => cell.equals(r[1]))) {
			let m = 'kouwkouw'
			console.log(m)
		}

		this.murs = []

	}

	/**
	 * @return {boolean}
	 */
	hasNext() {
		return this.murs.length !== 0
	}
}

/**
 * 
 */
class RecursiveDivision extends MazeGenerator {

	constructor(labyrinthe) {
		super(labyrinthe)
		for (const mur of labyrinthe.tousLesMurs()) {
			labyrinthe.ouvrir_passage(mur.a, mur.b)
		}
		
	}

	next() {

	}

	hasNext() {
	}
}
