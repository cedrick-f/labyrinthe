/**
 * @template T
 */
export class Graphe {

    constructor() {
		this.A = {}        
	}

    /**
     * @param {T} sommet
     * @return {T[]}
     */
    voisins(sommet) {
        return this.A[sommet] || []
    }

    /**
     * @param {T} a
     * @param {T} b
     */
	
	ajouter_sommet(x) {
        if (!Object.keys(this.A).includes(x)) {
            this.A[x] = new Set()
		}
	}
	
    ajouter_arete(a, b) {
        this.ajouter_sommet(a)
        this.ajouter_sommet(b)
		debugger
        this.A[a].add(b)
		this.A[b].add(a)
    }

    /**
     * @param {T} from
     * @return {T[]}
     */
    parcours_largeur(from) {
		let dist = [from]
		let cour = [from]
		let suiv = []
		while (cour.length > 0) {
			let s = cour.pop()
			for (let v of this.voisins(s)) {
				if (!dist.includes(v)){
					suiv.push(v)
					dist.push(v)
				}
			}
			if (cour.length == 0) {
				cour = suiv
				suiv = []
			}
		}
		return dist
    }
}