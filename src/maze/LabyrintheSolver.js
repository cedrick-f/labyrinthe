import {Coords} from '../util/Coords.js'
import {manhattanDistance} from '../util/Distance.js'

/**
 * @param {('astar')} name
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
        /*this.start = new Coords(0, 0)
        this.goal = new Coords(labyrinthe.width - 1, labyrinthe.height - 1)*/
        this.start = new Coords(432, 550)
        this.goal = new Coords(411, 550)
        this.startId = this.start.identifiant(labyrinthe)
        this.goalId = this.goal.identifiant(labyrinthe)
        this.path = []
    }

    /**
     * @return {Coords|VueParameters}
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
            return { path: this.path }
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
    while (current) {
        totalPath.push(Coords.fromIdentifiant(current, labyrinthe))
        current = cameFrom[current]
    }
    return totalPath
}
