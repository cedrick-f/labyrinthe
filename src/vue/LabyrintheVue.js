import {Coords, Mur} from "../util/Coords.js";

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
	 * @param {{ current: Coords, visited: number[]|Set<number>|Coords[]|Set<Coords> }} properties
     */
    draw(labyrinthe, properties = { current: null, visited: [] }) {
        this.ctx.strokeStyle = 'black'
		this.ctx.lineWidth = 2
        this.ctx.strokeRect(1, 1, this.canvas.width - 2, this.canvas.height - 2)

        const [fx, fy] = this.cellSizes(labyrinthe)
        for (let x = 0; x < labyrinthe.width; x++) {
            for (let y = 0; y < labyrinthe.height; y++) {
                this.drawCell(x, y, fx, fy, labyrinthe)
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
		}

		for (const cell of this.unvisitedCellFromVisited(labyrinthe, properties.visited)) {
			this.hightlightCell(cell, fx, fy, '#e4e4e4')
		}
    }

    /**
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
	
	hightlightCell(cell, fx, fy, style) {
		this.ctx.fillStyle = style
		const ox = fx * cell.x
		const oy = fy * cell.y
		this.ctx.fillRect(ox + 2, oy + 2, fx - 4, fy - 4)
	}
	
	unvisitedCellFromVisited(labyrinthe, visited = []) {
		const visitedArray = Array.from(visited)
		const unvisited = []
		for (let x = 0; x < labyrinthe.width; x++) {
			for (let y = 0; y < labyrinthe.height; y++) {
				if (!visitedArray.some(cellId => {
					const cell = cellId instanceof Coords ? cellId : Coords.fromIdentifiant(cellId, labyrinthe)
					return cell.x === x && cell.y === y
				})) {
					unvisited.push(new Coords(x, y))
				}
			}
		}
		return unvisited
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

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    /**
     * @param  {Labyrinthe} labyrinthe
     * @return {[number, number]}
     */
    cellSizes(labyrinthe) {
        return [this.canvas.width / labyrinthe.width, this.canvas.height / labyrinthe.height]
    }
}
