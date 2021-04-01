import {Coords} from '../util/Coords.js'
import {manhattanDistance} from '../util/Distance.js'

/**
 * @param {('astar'|'breath-first-search')} name
 * @param {Labyrinthe} labyrinthe
 * @return {MazeSolver}
 */
export function solverByName(name, labyrinthe) {
    return new AStarSolver(labyrinthe)
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
     * @param {function (Coords, Coords): number} [distance]
     * @param {function (Coords, Coords): number} [costEstimate]
     */
    constructor(labyrinthe, distance = manhattanDistance, costEstimate = manhattanDistance) {
        super(labyrinthe)

        /** @type {Set<number>} */
        this.openSet = new Set([this.startId])

        /** @type {Set<number>} */
        this.closedSet = new Set()

        /** @type {Object.<number, number>} */
        this.cameFrom = {}

        /** @type {Object.<number, number>} */
        this.gScore = { [this.startId]: 0 }

        /** @type {Object.<number, number>} */
        this.fScore = { [this.startId]: costEstimate(this.start, this.goal) }

        this.distance = distance
        this.costEstimate = costEstimate
    }

    /**
     * @return {VueParameters}
     */
    next() {
        // Recherche du noeud avec le plus faible fScore
        let current = -1
        let lowestScore = Number.MAX_VALUE
        for (const nodeId of this.openSet) {
            const score = this.fScore[nodeId]
            if (score < lowestScore) {
                current = nodeId
                lowestScore = score
            }
        }

        // Chemin trouvé !
        if (current === this.goalId) {
            this.path = reconstructPath(this.cameFrom, this.goalId, this.labyrinthe)
            return {}
        }

        this.openSet.delete(current)
        this.closedSet.add(current)
        const currentNode = Coords.fromIdentifiant(current, this.labyrinthe)

        for (const neighbor of this.labyrinthe.voisinsCellule(currentNode.x, currentNode.y)) {
            const neighborId = neighbor.identifiant(this.labyrinthe)
            if (this.closedSet.has(neighborId)) {
                continue
            }
            if (this.labyrinthe.murEntre(currentNode.x, currentNode.y, neighbor.x, neighbor.y)) {
                continue
            }
            this.openSet.add(neighborId)

            const tentativeGScore = this.gScore[current] + this.distance(currentNode, neighbor)
            if (tentativeGScore >= getScore(this.gScore, neighborId)) {
                continue // Ce chemin est plus long.
            }

            // Ce chemin est le plus court parmi les précédents.
            this.cameFrom[neighborId] = current
            this.gScore[neighborId] = tentativeGScore
            this.fScore[neighborId] = tentativeGScore + this.costEstimate(neighbor, this.goal)
        }

        return { current: currentNode }
    }

    hasNext() {
        return this.openSet.size > 0 && this.path.length === 0
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
