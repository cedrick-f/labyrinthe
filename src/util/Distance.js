/**
 * Retourne la distance entre deux points en n'utilisant que des déplacements horizontaux et verticaux.
 * 
 * @param {Coords} a
 * @param {Coords} b
 */
export function manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

/**
 * Retourne la distance entre deux coordonnées cartésiennes de points avec le théorème de Pythagore.
 * 
 * @param {Coords} a
 * @param {Coords} b
 */
export function squaredEuclideanDistance(a, b) {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
}
