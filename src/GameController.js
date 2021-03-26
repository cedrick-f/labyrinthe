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

        this.tick = this.tick.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)

        this.container = container
        document.addEventListener('keydown', this.onKeyDown, false)
        document.addEventListener('keyup', this.onKeyUp, false)

        this.tick()
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
        this.vue.ctx.fillText(timer.toString(), fx / 2, fy / 2, fx)
        this.vue.highlightCell(this.player, fx, fy, 'green')
        this.vue.highlightCell(this.maze.ouvertures[1], fx, fy, 'red')
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
        if (next && !this.maze.murEntre(this.player.x, this.player.y, next.x, next.y)) {
            this.moves++
            this.player = next
        }
    }

    /**
     * @param {KeyboardEvent} event
     * @return {null|Coords}
     */
    nextPosition(event) {
        switch (event.key) {
            case 'Right':
            case 'ArrowRight':
                return new Coords(this.player.x + 1, this.player.y)
            case 'Left':
            case 'ArrowLeft':
                return new Coords(this.player.x - 1, this.player.y)
            case 'Up':
            case 'ArrowUp':
                return new Coords(this.player.x, this.player.y - 1)
            case 'Down':
            case 'ArrowDown':
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
