/**
 * @template T
 */
export class Graphe {

    constructor() {
		this.A = {}        
	}

    /**
     * @param {T} sommet
     * @return {Set<T>}
     */
    voisins(sommet) {
        return this.A[sommet] || new Set()
    }

    /**
     * @param {T} x
     */
	ajouter_sommet(x) {
        if (!(x in this.A)) {
            this.A[x] = new Set()
		}
	}
	
    ajouter_arete(a, b) {
        this.ajouter_sommet(a)
        this.ajouter_sommet(b)
        this.A[a].add(b)
		this.A[b].add(a)
    }

    /**
     * @param {T} from
     * @return {T[]}
     */
    parcours_largeur(from) {
		if (!(from in this.A)) {
			return []
		}
		let dist = [from]
		let cour = [from]
		let suiv = []
		while (cour.length) {
			let s = cour.shift()
			for (let v of this.voisins(s)) {
				if (!dist.includes(v)){
					suiv.push(v)
					dist.push(v)
				}
			}
			if (!cour.length) {
				cour = suiv
				suiv = []
			}
		}
		return dist
    }
}