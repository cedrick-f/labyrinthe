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
