/**
 * Retourne la distance entre deux points en n'utilisant que des déplacements horizontaux et verticaux.
 * 
 * @param {Coords} a
 * @param {Coords} b
 * @return {number}
 */
export function manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

/**
 * Retourne la distance entre deux coordonnées cartésiennes de points avec le théorème de Pythagore.
 * 
 * @param {Coords} a
 * @param {Coords} b
 * @return {number}
 */
export function squaredEuclideanDistance(a, b) {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
}

/**
 * Sur une droite, place n valeurs intermédiaires entre from et to.
 *
 * @param {number} from Point A
 * @param {number} to Point B
 * @param {number} n Nombre de valeurs intermédiaires à retourner
 * @return {number[]} Tableau de taille n
 */
export function linearInterpolation(from, to, n) {
    const res = new Array(n)
    const step = (to - from) / (n - 1)
    for (let i = 0; i < n; i++) {
        res[i] = from + i * step
    }
    return res
}
