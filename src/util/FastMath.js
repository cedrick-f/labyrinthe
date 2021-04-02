/**
 * Retourne le résultat de la division par deux, arrondi à l'entier supérieur.
 *
 * @param {number} n Nombre positif
 * @return {number}
 */
export function ceilDivisionByTwo(n) {
    // Équivalent à Math.ceil(n / 2)
    return (n >> 1) + (n & 0b1)
}
