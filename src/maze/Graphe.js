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
		let r = []
        let s = []
        s.push(from)
        while (s.length) {
            let p = s.shift()
            if (!(r.includes(p))) {
                r.push(p)
                for (let e of this.voisins(p)) {
                    s.push(e)
				}
			}
		}
        return r
	}
	
	chemins(from) {
		if (!(from in this.A)) {
			return []
		}
		let r = {from : undefined}
		let cour = [from]
		let suiv = []
        while (cour.length) {
			let s = cour.shift()
			for (let v of this.voisins(s)) {
				if (!r.includes(v)){
                    suiv.push(v)
                    r[v] = s
				}
			}
			if (!cour.length) {
				cour = suiv
				suiv = []
			}
		}
		return r
	}
	
	parcours_profondeur(from) {
		if (!(from in this.A)) {
			return []
		}
		let r = []
        let s = []
        s.push(from)
        while (s.length) {
            let p = s.pop()
            if (!(r.includes(p))) {
                r.push(p)
                for (let e of this.voisins(p)) {
                    s.push(e)
				}
			}
		}
        return r
	}
		
}