import {Coords, Mur} from "../util/Coords.js";
import {randomInt, randomChoice, shuffle} from "../util/Random.js";

/**
 * @param {('random'|'fusion'|'prim'|'aldous-broder')} name
 * @param {Labyrinthe} labyrinthe
 * @return {{ next: function (): VueParameters|void, hasNext: function (): boolean }}
 */
export function generatorFromName(name, labyrinthe) {
	switch (name) {
		case "aldous-broder":
			return new AldousGenerator(labyrinthe)
		case "fusion":
			return new FusionGenerator(labyrinthe)
		case "random":
			return new RandomGenerator(labyrinthe)
		default:
			return new Generator(labyrinthe)
	}
}

/**
 * Base pour un générateur de labyrinthe, à étendre.
 */
class Generator {

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



class FusionGenerator extends Generator {

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

		/*let i = 0
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				this.grille[new Coords(x, y)] = i;
				i= i + 1 ;
				}
			}*/
		
		this.murs = shuffle(labyrinthe.tousLesMurs());
		labyrinthe.fermerTousLesMurs()
	}

	/**
	 * @returns {VueParameters}
	 */
	next() {
		var mur = this.murs[0];
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
class RandomGenerator extends Generator {

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

class AldousGenerator extends Generator {

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
