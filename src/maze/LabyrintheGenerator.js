import {Coords, Mur} from "../util/Coords.js";

/**
 * @param {('fusion'|'prim'|'aldous-broder')} name
 * @return {{ next: function (): Mur, hasNext: function (): boolean }}
 */
export function generatorFromName(name) {
    return {
        next: () => new Mur(new Coords(0, 0), new Coords(0, 1)),
        hasNext: () => false
    }
}
