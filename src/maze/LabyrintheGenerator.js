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
	if (name === 'aldous-broder') {
		return new AldousGenerator(labyrinthe)
	}
	if (name === 'fusion') {
		return new Fusion(labyrinthe)
	}
    return {
        next: () => new Mur(new Coords(0, 0), new Coords(0, 1)),
        hasNext: () => false
    }
}

class Fusion {
	constructor(labyrinthe) {
		this.labyrinthe = labyrinthe
		this.n = labyrinthe.width * labyrinthe.height
		
		this.grille = {}
		for (let c =0 ; c < this.n ; c++) {
			this.grille[c] = c
			}
			
		this.murs = labyrinthe.tousLesMurs();
		// à mélanger
		
	}
		

	next() {
		let mur = this.murs[0];
		if (this.grille[mur[0]] !== this.grille[mur[1]]) {
			this.labyrinthe.ouvrir_passage(mur[0], mur[1]);
			for (let c of this.labyrinthe.parcours_profondeur(mur[0])) {
				grille[c] = grille[mur[0]];
			}
		this.murs.splice(0);
		}
	}
	
	hasNext() {
		this.murs.length > 0;
	}
}
}

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

class AldousGenerator {
	constructor(labyrinthe) {
		this.labyrinthe = labyrinthe
		this.current = new Coords(randomInt(labyrinthe.width), randomInt(labyrinthe.height))
		this.visited = new Set()
		this.rien = null
		this.n = labyrinthe.width * labyrinthe.height
	}
	next() {
		this.visited.add(this.current.identifiant(this.labyrinthe))
		this.rien = randomChoice(this.labyrinthe.voisinsCellule(this.current.x, this.current.y))
		if (!(this.visited.has(this.rien.identifiant(this.labyrinthe)))) {
			this.labyrinthe.ouvrir_passage(this.current, this.rien)
		}
		this.current = this.rien
		this.rien = null
		return {current: this.current, visited: this.visited}
	}
	hasNext() {
		return this.n > this.visited.size
	}
}



/*const n = labyrinthe.width * labyrinthe.height
while (n > 0) {
	const x = randomInt(this.labyrinthe.width)
	const y = randomInt(this.labyrinthe.height)
	this.n--
	labyrinyte.ouvrir_passage(new Coords(x, y), randomChoice(this.labyrinthe.voisinsCellule(x, y))))
}*/
