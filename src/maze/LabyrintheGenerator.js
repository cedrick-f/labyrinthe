import {Coords, Mur} from "../util/Coords.js";
import {randomInt, randomChoice} from "../util/Random.js";

/**
 * @param {('random'|'fusion'|'prim'|'aldous-broder')} name
 * @param {Labyrinthe} labyrinthe
 * @return {{ next: function (): Mur|boolean|void, hasNext: function (): boolean }}
 */
export function generatorFromName(name, labyrinthe) {
	if (name === 'random') {
		return new RandomGenerator(labyrinthe)
	}
    return {
        next: () => new Mur(new Coords(0, 0), new Coords(0, 1)),
        hasNext: () => false
    }
}

/*class Fusion {
	constructor(x, y) {
		let l = []
		this x = x
		this y = y
	}
		
	construire_fusion(x, y){
		for (let x = 0; x < labirynthe.width; x++) {
			
		}
	}
}*/

class RandomGenerator {

	/**
	 * Le générateur reçoit en paramètre le labyrinthe.
	 *
	 * @param {Labyrinthe} labyrinthe
	 */
	constructor(labyrinthe) {
		this.labyrinthe = labyrinthe
		this.n = labyrinthe.width * labyrinthe.height
	}

	/**
	 * Retourne le prochain mur à ouvrir.
	 *
	 * @returns {Mur}
	 */
	next() {
		const x = randomInt(this.labyrinthe.width)
		const y = randomInt(this.labyrinthe.height)
		this.n--
		return new Mur(new Coords(x, y), randomChoice(this.labyrinthe.voisinsCellule(x, y)))
	}

	/**
	 * Retourne true s'il reste au moins une étape de construction.
	 */
	hasNext() {
		return this.n > 0
	}
}

/*const n = labyrinthe.width * labyrinthe.height
while (n > 0) {
	const x = randomInt(this.labyrinthe.width)
	const y = randomInt(this.labyrinthe.height)
	this.n--
	labyrinyte.ouvrir_passage(new Coords(x, y), randomChoice(this.labyrinthe.voisinsCellule(x, y))))
}*/
