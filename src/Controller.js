import {Labyrinthe} from './maze/Labyrinthe.js';
import {LabyrintheVue} from './vue/LabyrintheVue.js';

export class Controller {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    const widthInput = container.querySelector('#width')
    const heightInput = container.querySelector('#height')
    this.maze = new Labyrinthe(parseInt(widthInput.value), parseInt(heightInput.value))
    this.vue = new LabyrintheVue(container.querySelector('canvas'))
    this.vue.draw(this.maze)
    this.onInputChange = this.onInputChange.bind(this)
    for (const element of [widthInput, heightInput]) {
      element.addEventListener('input', this.onInputChange)
    }
  }

  onInputChange(event) {
	this.vue.clear()
    const value = parseInt(event.target.value)
    const width = event.target.id === 'width' ? value : this.maze.width
    const height = event.target.id === 'height' ? value : this.maze.height
	this.maze = new Labyrinthe(width, height)
	this.vue.draw(this.maze)
  }
  
  onBuildClick(event) {
	//this.maze.generator()
  }
}
