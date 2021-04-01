import {Coords} from './util/Coords.js';

export class GameController {

    /**
     * @param {HTMLElement} container
     * @param {Labyrinthe} labyrinthe
     * @param {LabyrintheVue} vue
     */
    constructor(container, labyrinthe, vue) {
        document.body.style.overflow = 'hidden'
        this.maze = labyrinthe
        this.vue = vue
        this.player = labyrinthe.ouvertures[0]
        this.moves = 0
        this.start = Date.now()
        this.continue = true
        this.image = new Image()
        this.image.src = '/public/fish.png'
        this.direction = 0 // Rotation du personnage, en degré

        this.tick = this.tick.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)

        this.container = container
        document.addEventListener('keydown', this.onKeyDown, false)
        document.addEventListener('keyup', this.onKeyUp, false)

        this.image.onload = this.tick
    }

    stop() {
        document.removeEventListener('keydown', this.onKeyDown)
        document.removeEventListener('keyup', this.onKeyUp)
        this.continue = false
    }

    tick() {
        this.vue.clear()
        this.vue.draw(this.maze)
        if (!this.continue) {
            return
        }
        const timer = Date.now() - this.start
        const [fx, fy] = this.vue.cellSizes(this.maze)
        this.vue.ctx.textAlign = 'center'
        const start = this.maze.ouvertures[0]
        this.vue.ctx.fillText((timer / 1000).toFixed(2), start.x * fx + fx / 2, start.y * fy + fy / 2, fx)
        //this.vue.highlightCell(this.player, fx, fy, 'green')
        this.vue.drawImageWithRotation(this.image, fx * this.player.x, fy * this.player.y, this.direction, fx, fy)
        requestAnimationFrame(this.tick)
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            this.stop()
            return
        }
        const next = this.nextPosition(event)
        if (next) {
            if (this.player.equals(this.maze.ouvertures[1]) && (next.x < 0 || next.y < 0 || next.x >= this.maze.width || next.y >= this.maze.height)) {
                alert('Bravo !')
                this.stop()
            } else if (!this.maze.murEntre(this.player.x, this.player.y, next.x, next.y)) {
                this.direction = Math.atan2(this.player.y - next.y, this.player.x - next.x) * 180 / Math.PI + 180
                this.moves++
                this.player = next
            }
        }
    }

    /**
     * @param {KeyboardEvent} event
     * @return {null|Coords}
     */
    nextPosition(event) {
        switch (event.code) {
            case 'ArrowRight':
			case 'KeyD':
                return new Coords(this.player.x + 1, this.player.y)
            case 'ArrowLeft':
			case 'KeyA':
                return new Coords(this.player.x - 1, this.player.y)
            case 'ArrowUp':
			case 'KeyW':
                return new Coords(this.player.x, this.player.y - 1)
            case 'ArrowDown':
			case 'KeyS':
                return new Coords(this.player.x, this.player.y + 1)
            default:
                return null
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyUp(event) {

    }
}
