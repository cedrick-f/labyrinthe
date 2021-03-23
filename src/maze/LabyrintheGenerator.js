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
		this.construire_fusion()
	}
		
	construire_fusion(){
		this.grille = []
		let i = 0
		for (let y = 0; y < this.labyrinthe.height; y++) {
			let l = []
			for (let x = 0; x < this.labyrinthe.width; x++) {
				l.push(Coords.identifiant(x, y, this.labyrinthe))
			}
			this.grille.push(l)
		}
		
		debugger
	}
	
	next() {
		const x = randomInt(this.labyrinthe.width)
		const y = randomInt(this.labyrinthe.height)
		let cellule = new Coords(x, y)
		let voisins = this.labyrinthe.voisinsCellule(x, y)
		let voisinRandom = randomChoice(voisins)
		let celluleIdentifiant = this.grille[y][x]
		let voisinIdentifiant = this.grille[voisinRandom.y][voisinRandom.x]
		if (celluleIdentifiant !== voisinIdentifiant) {
			this.labyrinthe.ouvrir_passage(cellule, voisinRandom)
		}
		
	}
	
	hasNext() {
		for (let ligne of this.grille) {
			for (let cellule of this.grille) {
				if (cellule > 0) {
					return true
				}
				
			}
		}
		return false
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
