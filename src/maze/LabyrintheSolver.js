import {Coords} from '../util/Coords.js'
import {manhattanDistance} from '../util/Distance.js'
import {MinHeap} from "./MinHeap.js";

/**
 * @param {('astar'|'breath-first-search')} name
 * @param {Labyrinthe} labyrinthe
 * @return {MazeSolver}
 */
export function solverByName(name, labyrinthe) {
    switch (name) {
        case 'breath-first-search':
            return new BreathFirstSearchSolver(labyrinthe)
        case 'astar':
            return new AStarSolver(labyrinthe)
        case 'parcours-largeur':
            return new ParcoursLargeurSolver(labyrinthe)
    }
}

/**
 * Base pour un générateur de labyrinthe, à étendre.
 */
class MazeSolver {

    /**
     * Le résolveur reçoit en paramètre le labyrinthe.
     *
     * @param {Labyrinthe} labyrinthe
     */
    constructor(labyrinthe) {
        this.labyrinthe = labyrinthe
        this.start = labyrinthe.ouvertures[0]
        this.goal = labyrinthe.ouvertures[1]
        this.startId = this.start.identifiant(labyrinthe)
        this.goalId = this.goal.identifiant(labyrinthe)
        /** @type {Coords[]} */
        this.path = []
    }

    /**
     * Effectue le tour suivant de résolution.
     *
     * Si un chemin est découvert, il doit être affecté à this.path et hasNext doit renvoyer false.
     *
     * @return {VueParameters}
     */
    next() {
        return {}
    }

    /**
     * Retourne true s'il reste au moins une étape de résolution.
     *
     * @return {boolean}
     */
    hasNext() {
        return false
    }
}

class AStarSolver extends MazeSolver {

    /**
     * @param {Labyrinthe} labyrinthe
     * @param {function (Coords, Coords): number} [costEstimate] Estime de la distance entre deux sommets (heuristique)
     */
    constructor(labyrinthe, costEstimate = manhattanDistance) {
        super(labyrinthe)

        const cost = costEstimate(this.start, this.goal)

        /**
         * Les sommets connus et pas encore traités.
         * Ils sont explorés par priorité croissante.
         *
         * @type {MinHeap<number>}
         */
        this.frontier = new MinHeap()
        this.frontier.queue(this.startId, cost)

        /**
         * Retient le prédécesseur de chaque sommet visité.
         *
         * @type {Object.<number, number>}
         */
        this.cameFrom = {}

        /**
         * Le coût du chemin testé jusqu'ici.
         * On considère que s'il n'est pas référencé, sa valeur devrait être de +infini.
         *
         * @type {Object.<number, number>}
         */
        this.costSoFar = { [this.startId]: Number.MAX_SAFE_INTEGER }

        this.costEstimate = costEstimate
    }

    /**
     * @return {VueParameters}
     */
    next() {
        // Récupère le sommet avec le plus faible coût jusqu'ici
        let current = this.frontier.poll()

        // Chemin trouvé !
        if (current === this.goalId) {
            this.path = reconstructPath(this.cameFrom, this.goalId, this.labyrinthe)
            return {}
        }

        const currentNode = Coords.fromIdentifiant(current, this.labyrinthe)

        for (const neighbor of this.labyrinthe.voisinsCellule(currentNode.x, currentNode.y)) {
            const neighborId = neighbor.identifiant(this.labyrinthe)
            if (this.labyrinthe.murEntre(currentNode.x, currentNode.y, neighbor.x, neighbor.y)) {
                continue
            }

            // On estime que toutes les arêtes du graphe ont le même poids (1)
            const newCost = this.costSoFar[current] + 1
            if (!(neighborId in this.costSoFar) || newCost < this.costSoFar[neighborId]) {
                // Ce chemin est plus court que celui connu jusqu'ici
                this.costSoFar[neighborId] = newCost
                const priority = newCost + this.costEstimate(neighbor, this.goal)
                this.frontier.queue(neighborId, priority)
                this.cameFrom[neighborId] = current
            }
        }

        return { current: currentNode }
    }

    hasNext() {
        return !this.frontier.empty() && this.path.length === 0
    }
}

class BreathFirstSearchSolver extends MazeSolver {

    /**
     * @param {Labyrinthe} labyrinthe
     */
    constructor(labyrinthe) {
        super(labyrinthe)
        /** @type {number[][]} */
        this.queue = [[this.startId]]
        /** @type {Set<number>} */
        this.visited = new Set([this.startId])
    }

    /**
     * @return {VueParameters}
     */
    next() {
        const path = this.queue.shift()
        const node = path[path.length - 1]
        if (node === this.goalId) {
            this.path = path.map(id => Coords.fromIdentifiant(id, this.labyrinthe))
            return {}
        }

        for (const cell of this.labyrinthe.graphe.voisins(node)) {
            if (!this.visited.has(cell)) {
                this.queue.push([...path, cell])
                this.visited.add(cell)
            }
        }
        return { current: Coords.fromIdentifiant(node, this.labyrinthe) }
    }

    hasNext() {
        return this.queue.length > 0
    }
}

class ParcoursLargeurSolver extends MazeSolver {

    /**
     * @param {Labyrinthe} labyrinthe
     * @param {T} from
     */

    constructor(from) {
        let r = {from: null}
		let cour = [from]
		let suiv = []
    }

    next() {
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

    hasNext() {
        return cour.length
    }
}

/**
 * @param {Object.<number, number>} gScore
 * @param {number} id
 * @return {number}
 */
 function getScore(gScore, id) {
    const score = gScore[id]
    return typeof score === 'number' ? score : Number.MAX_VALUE
}

/**
 * 
 * @param {Object.<number, number>} cameFrom 
 * @param {number} current 
 * @param {Labyrinthe} labyrinthe 
 * @return {Coords[]}
 */
function reconstructPath(cameFrom, current, labyrinthe) {
    const totalPath = []
    while (current > -1) {
        totalPath.push(Coords.fromIdentifiant(current, labyrinthe))
        current = cameFrom[current]
    }
    return totalPath
}
