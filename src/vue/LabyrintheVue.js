import {Coords, Mur} from "../util/Coords.js";
import {LabyrintheImage} from "../maze/Labyrinthe.js";
import {linearInterpolation} from "../util/Distance.js";
import {ceilDivisionByTwo} from "../util/FastMath.js";

/**
 * @typedef VueParameters
 * @type {object}
 * @property {Coords|Mur|number} [current] Les coordonnées d'une cellule ou d'un mur à mettre en valeur.
 * @property {Iterable.<Coords|number>} [visited] Un itérable avec les coordonnées/identifiants des cellules déjà visitées.
 * @property {number[]} [grille] Pour chaque identifiant, associe une valeur à afficher à la case.
 */

const DRAW_COLORED_GRAPH = false

export class LabyrintheVue {

    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        /** @type {Mur[]} */
        this.lastWalls = []
    }

    /**
     * @param {Labyrinthe} labyrinthe
     * @param {VueParameters} properties
     */
    draw(labyrinthe, properties = { current: null, visited: [] }) {
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(1, 1, this.canvas.width - 2, this.canvas.height - 2)

        const [fx, fy] = this.cellSizes(labyrinthe)
        if (labyrinthe instanceof LabyrintheImage) {
            this.ctx.putImageData(labyrinthe.imageData, 0, 0)
        } else {
            for (let x = 0; x < labyrinthe.width; x++) {
                for (let y = 0; y < labyrinthe.height; y++) {
                    this.drawCell(x, y, fx, fy, labyrinthe)
                }
            }
            this.drawOutsideWall(labyrinthe, labyrinthe.ouvertures[0], fx, fy)
            this.drawOutsideWall(labyrinthe, labyrinthe.ouvertures[1], fx, fy)
        }

        const visited = properties.visited
        if (visited && (visited.length || visited.size)) {
            for (const cell of this.unvisitedCellsFromVisited(labyrinthe, properties.visited)) {
                this.highlightCell(cell, fx, fy, '#e4e4e4')
            }
        }

        const current = properties.current
        if (current) {
            if (current instanceof Coords) {
                this.ctx.fillStyle = '#ff5555'
                const ox = fx * current.x
                const oy = fy * current.y
                this.ctx.fillRect(ox + 1, oy + 1, fx - 1, fy - 1)
            } else if (current instanceof Mur) {
                this.ctx.strokeStyle = '#ff0000'
                this.ctx.lineWidth = 3
                this.drawWall(labyrinthe, current)
                for (const index in this.lastWalls) {
                    this.ctx.strokeStyle = `yellow`
                    this.drawWall(labyrinthe, this.lastWalls[index])
                }
                this.lastWalls.push(current)
                if (this.lastWalls.length > 3) {
                    this.lastWalls.shift()
                }
            }
        } else {
            this.lastWalls = []
        }

        if (properties.grille) {
            this.ctx.textAlign = 'center'
            this.ctx.font = '12px sans-serif'
            const midFx = fx / 2
            const midFy = fy / 2
            for (let x = 0; x < labyrinthe.width; x++) {
                for (let y = 0; y < labyrinthe.height; y++) {
                    const value = properties.grille[Coords.identifiant(x, y, labyrinthe)]
                    if (typeof value === 'number') {
                        this.ctx.fillText(value.toString(), x * fx + midFx, y * fy + midFy, fx)
                    }
                }
            }
        }

        if (DRAW_COLORED_GRAPH) {
            const colors = labyrinthe.graphe.colorer()
            const n = new Set(Object.values(colors)).size
            const mid = ceilDivisionByTwo(n)
            const gradiant = linearInterpolation(100, 255, mid)
                .map(color => parseInt(color).toString(16).padStart(2, '0'))

            for (const cellId in colors) {
                const colorId = colors[cellId]
                const red = colorId < mid ? gradiant[colorId] : '00'
                const green = colorId > mid ? gradiant[mid - colorId] : '00'
                this.highlightCell(Coords.fromIdentifiant(cellId, labyrinthe), fx, fy, `#${red}20${green}`)
            }
        }
    }

    /**
     * Dessine les bords d'une cellule.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} sizeX
     * @param {number} sizeY
     * @param {Labyrinthe} labyrinthe
     */
    drawCell(x, y, sizeX, sizeY, labyrinthe) {
        const left = labyrinthe.murEntre(x, y, x - 1, y)
        const right = labyrinthe.murEntre(x, y, x + 1, y)
        const top = labyrinthe.murEntre(x, y, x, y - 1)
        const bottom = labyrinthe.murEntre(x, y, x, y + 1)

        this.ctx.beginPath()
        x *= sizeX
        y *= sizeY

        if (left) {
            this.drawLine(x, y, x, y + sizeY)
        }
        if (right) {
            this.drawLine(x + sizeX, y, x + sizeX, y + sizeY)
        }
        if (bottom) {
            this.drawLine(x, y + sizeY, x + sizeX, y + sizeY)
        }
        if (top) {
            this.drawLine(x, y, x + sizeX, y)
        }
        this.ctx.stroke()
    }

    /**
     * Met en valeur une cellule.
     *
     * @param {Coords} cell
     * @param {number} fx Largeur d'une seule cellule.
     * @param {number} fy Hauteur d'une seule cellule.
     * @param {string} style
     */
    highlightCell(cell, fx, fy, style) {
        this.ctx.fillStyle = style
        const ox = fx * cell.x
        const oy = fy * cell.y
        this.ctx.fillRect(ox + 2, oy + 2, fx - 4, fy - 4)
    }
	
	/**
	 * Met en valeur l'entrée et la sortie
	 * 
	 * @param {Labyrinthe} labyrinthe
	 * @param {number} fx Largeur d'une seule cellule.
     * @param {number} fy Hauteur d'une seule cellule.
	 */
	highlightOpennings(labyrinthe, fx, fy) {
		this.highlightCell(labyrinthe.ouvertures[0], fx, fy, 'green')
        this.highlightCell(labyrinthe.ouvertures[1], fx, fy, 'red')
	}
	
    /**
     * Retourne la liste des cellules non visitées à partir de celles visitées.
     *
     * @param {Labyrinthe} labyrinthe
     * @param {Iterable.<number|Coords>} visited
     * @return {Iterable.<Coords>}
     */
    *unvisitedCellsFromVisited(labyrinthe, visited = []) {
        const visitedSet = new Set(Array.from(visited).map(cellId =>
            cellId instanceof Coords ? cellId.identifiant(labyrinthe) : cellId
        ))
        let id = 0
        for (let y = 0; y < labyrinthe.height; y++) {
            for (let x = 0; x < labyrinthe.width; x++) {
                if (!visitedSet.has(id++)) {
                    yield new Coords(x, y)
                }
            }
        }
    }

    /**
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     */
    drawLine(startX, startY, endX, endY) {
        this.ctx.moveTo(startX, startY)
        this.ctx.lineTo(endX, endY)
    }

    /**
     * @param {Labyrinthe} labyrinthe
     * @param {Mur} wall
     */
    drawWall(labyrinthe, wall) {
        this.ctx.beginPath()
        const [fx, fy] = this.cellSizes(labyrinthe)
        this.drawLine(fx * wall.a.x, fy * wall.a.y, fx * wall.b.x, fy * wall.b.y)
        this.ctx.stroke()
    }

    /**
     * @param {Labyrinthe} labyrinthe
     * @param {Coords} cell
     * @param {number} fx
     * @param {number} fy
     * @param {string} [style]
     */
    drawOutsideWall(labyrinthe, cell, fx, fy, style) {
        if (style) {
            this.ctx.strokeStyle = style
        }
        const draw = (style ? this.ctx.strokeRect : this.ctx.clearRect).bind(this.ctx)
        if (cell.y === 0) {
            draw(cell.x * fx, 0, fx, 2)
        } else if (cell.y === labyrinthe.height - 1) {
            draw(cell.x * fx, this.canvas.height - 2, fx, 2)
        } else if (cell.x === 0) {
            draw(0, cell.y * fy, 2, fy)
        } else if (cell.x === labyrinthe.width - 1) {
            draw(this.canvas.width - 2, cell.y * fy, 2, fy)
        }
    }

    /**
     * Affiche l'image dans le canevas et retourne les données de celle-ci.
     *
     * @param {ImageBitmap} bitmap
     * @return {ImageData}
     */
    drawBitmap(bitmap) {
        this.canvas.width = bitmap.width
        this.canvas.height = bitmap.height
        this.ctx.drawImage(bitmap, 0, 0)
        return this.ctx.getImageData(0, 0, bitmap.width, bitmap.height)
    }

    /**
     * Affiche le chemin comme ayant été testé.
     *
     * @param {Labyrinthe} labyrinthe
     * @param {VueParameters} parameters
     */
    drawPathTest(labyrinthe, parameters) {
        if (parameters.current) {
            this.highlightCell(parameters.current, ...this.cellSizes(labyrinthe), '#b5e2fc')
        }
    }

    /**
     * Affiche le chemin final. La première et la dernière position sont marquées d'un rectangle,
     * les autres permettent de tracer des traits d'une cellule à la précédente/suivante.
     *
     * @param {Labyrinthe} labyrinthe
     * @param {Coords[]} path
     */
    drawPath(labyrinthe, path) {
        if (!path.length) {
            return;
        }

        this.ctx.strokeStyle = '#ff3030'
        this.ctx.beginPath()

        // Calcul des dimensions
        const [fx, fy] = this.cellSizes(labyrinthe)
        const midFx = fx / 2
        const midFy = fy / 2

        this.highlightCell(path[0], fx, fy, this.ctx.strokeStyle) // Marquage de la première cellule

        for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i - 1]
            const node = path[i]
            const next = path[i + 1]

            if ((prev.x + 1) === node.x || (next.x + 1) === node.x) { // Left
                const y = node.y * fy + midFy
                this.drawLine(node.x * fx, y, node.x * fx + midFx, y)
            }
            if ((prev.x - 1) === node.x || (next.x - 1) === node.x) { // Right
                const y = node.y * fy + midFy
                this.drawLine(node.x * fx + midFx, y, node.x * fx + fx, y)
            }
            if ((prev.y + 1) === node.y || (next.y + 1) === node.y) { // Top
                const x = node.x * fx + midFx
                this.drawLine(x, node.y * fy, x, node.y * fy + midFy)
            }
            if ((prev.y - 1) === node.y || (next.y - 1) === node.y) { // Bottom
                const x = node.x * fx + midFx
                this.drawLine(x, node.y * fy + midFy, x, node.y * fy + fy)
            }
        }

        this.highlightCell(path[path.length - 1], fx, fy, this.ctx.strokeStyle) // Marquage de la dernière cellule
        this.ctx.stroke()
    }

    /**
     * @param {CanvasImageSource} image
     * @param {number} x
     * @param {number} y
     * @param {number} angle
     * @param {number} [width]
     * @param {number} [height]
     */
    drawImageWithRotation(image, x, y, angle, width, height) {
        this.ctx.save()
        this.ctx.translate(x + width / 2, y + height / 2)
        this.ctx.rotate(angle)
        this.ctx.translate(- x - width / 2, - y - height / 2)
        this.ctx.drawImage(image, x, y, width, height)
        this.ctx.restore()
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    /**
     * @param  {Labyrinthe} labyrinthe
     * @return {[number, number]}
     */
    cellSizes(labyrinthe) {
        if (labyrinthe instanceof LabyrintheImage) {
            return [1, 1]
        }
        return [this.canvas.width / labyrinthe.width, this.canvas.height / labyrinthe.height]
    }
}
