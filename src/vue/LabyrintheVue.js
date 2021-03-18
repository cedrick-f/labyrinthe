export class LabyrintheVue {

    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
    }

    /**
     * @param {Labyrinthe} labyrinthe
     */
    draw(labyrinthe) {
        this.ctx.fillStyle = 'black'
        this.ctx.strokeRect(1, 1, this.canvas.width - 2, this.canvas.height - 2)

        const fx = this.canvas.width / labyrinthe.width
        const fy = this.canvas.height / labyrinthe.height
        for (let x = 0; x < labyrinthe.width; x++) {
            for (let y = 0; y < labyrinthe.height; y++) {
                this.drawCell(x, y, fx, fy, labyrinthe)
            }
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
}
