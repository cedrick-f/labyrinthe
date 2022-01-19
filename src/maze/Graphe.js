/**
 * @template T
 */
export class Graphe {

    /**
     * @param {Object.<T, Set<T>>} [a]
     */
    constructor(a = {}) {
		this.A = a
	}

    /**
     * Suppression de toutes les arêtes
     */
     razAretes() {
        Object.values(this.A).forEach(set => set.clear())
    }

    /**
     * Suppression de toutes les sommets
     */
     razSommets() {
        this.A = {}
    }

    /**
     * Retourne la liste des sommets, ordonnés selon leur degré dans l'ordre croissant.
     *
     * @returns {T[]}
     */
    sommets() {
        const byDegree = {}
        for (const [sommet, voisins] of Object.entries(this.A)) {
            if (!(voisins.size in byDegree)) {
                byDegree[voisins.size] = new Set()
            }
            byDegree[voisins.size].add(sommet)
        }

        const list = []
        for (const d of Object.keys(byDegree).sort()) {
            for (const el of byDegree[d]) {
                list.push(isNaN(el) ? el : parseInt(el))
            }
        }
        return list
    }

    /**
     * Attribue un identifiant de couleur à chaque sommet, avec des couleurs différentes lorsque les deux sommets sont reliés.
     *
     * @return {Object.<T, number>}
     */
    colorer() {
        const keys = Object.keys(this.A)
        if (keys.length < 1) {
            return {}
        }

        const colors = { [keys[0]]: 0 }

        // Définit les couleurs disponibles
        let available = new Array(keys.length)
        available = available.fill(true);

        for (let i = 1; i < keys.length; i++) {
            // Pour chaque voisin, la couleur est définie comme indisponible
            for (const neighbor of this.A[keys[i]]) {
                const color = colors[neighbor]
                if (typeof color === 'number') {
                    available[color] = false;
                }
            }

            // Assigne la première couleur disponible
            colors[i] = available.findIndex(color => color)

            // Réinitialise le tableau
            available = available.fill(true);
        }

        return colors
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

    retirerArete(a, b) {
        this.A[a].delete(b)
        this.A[b].delete(a)
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
    /**
     * @param {T} from
     * @returns {Object.<T, T>}
     * Renvoie tous les chemins du parcours en largeur
     */
	parcours_largeur_chemins(from) {
		if (!(from in this.A)) {
			return {}
		}
		let r = {from: null}
		let cour = [from]
		let suiv = []
        while (cour.length) {
			let s = cour.shift()
			for (let v of this.voisins(s)) {
				if (!(v in r)){
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
    /**
     * @param {T} x
     * @param {T} x
     * @returns {T[]}
     * Renvoie le chemin le plus court de x a y sous forme de liste
     */
	chemin(x, y) {
        let parcours_largeur_chemins = this.parcours_largeur_chemins(x)
        if (!(y in parcours_largeur_chemins)) {
            return []
		}
        let r = []
        for (let _ in parcours_largeur_chemins) {
            r.push(y)
            y = parcours_largeur_chemins[y]
            if (y === x) {
                r.push(y)
                r.reverse()
                return r
			}
		}
	}

	/**
     * 
     * @param {*} from 
     * @returns 
     */
	parcours_profondeur(from) {
		if (!(from in this.A)) {
			return []
		}
		let r = []  // sommets visités
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