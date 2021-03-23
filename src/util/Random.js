/**
 * Retourne un nombre compris dans [0,max[
 *
 * @param {number} max
 * @return {number}
 **/
export function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

/**
 * Retourne un élément aléatoire du tableau.
 *
 * @param {T[]} array
 * @return {T}
 * @template T
 */
export function randomChoice(array) {
	return array[randomInt(array.length)]
}

/**
 * Mélange aléatoirement les éléments du tableau sur place.
 *
 * @param {T[]} array
 * @return {T[]}
 * @template T
 */
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}
