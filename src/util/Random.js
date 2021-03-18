/**
 * Retourne un nombre compris dans [0,max[
 *
 * @param {number} max
 * @returns {number}
 **/
export function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

export function randomChoice(array) {
	return array[randomInt(array.length)]
}
