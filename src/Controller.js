import {Labyrinthe} from './maze/Labyrinthe.js';
import {LabyrintheVue} from './vue/LabyrintheVue.js';
import {generatorFromName} from './maze/LabyrintheGenerator.js';
import {Mur} from './util/Coords.js';

export class Controller {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this.container = container;

    this.onDimensionsChange = this.onDimensionsChange.bind(this)
    this.onSpeedChange = this.onSpeedChange.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onGeneratorStep = this.onGeneratorStep.bind(this)

    /** @type {HTMLInputElement} */
    const widthInput = container.querySelector('#width')
    /** @type {HTMLInputElement} */
    const heightInput = container.querySelector('#height')
    /** @type {HTMLInputElement} */
    const buildSpeedInput = container.querySelector('#build-speed')

    this.maze = new Labyrinthe(parseInt(widthInput.value), parseInt(heightInput.value))
    this.vue = new LabyrintheVue(container.querySelector('canvas'))

    for (const element of [widthInput, heightInput]) {
      element.addEventListener('input', this.onDimensionsChange)
    }
    container.querySelector('#build').addEventListener('click', this.onBuildClick.bind(this))
    this.generateTimeout = parseInt(buildSpeedInput.value)
    buildSpeedInput.addEventListener('input', this.onSpeedChange)

    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  /**
   * Lorsqu'une des dimensions du labyrinthe est modifiée.
   *
   * @param {InputEvent} event
   */
  onDimensionsChange(event) {
	this.vue.clear()
    const value = parseInt(event.target.value)
    const width = event.target.id === 'width' ? value : this.maze.width
    const height = event.target.id === 'height' ? value : this.maze.height
	this.maze = new Labyrinthe(width, height)
	this.vue.draw(this.maze)
  }

  /**
   * Lorsque la vitesse de génération est changée.
   *
   * @param {InputEvent} event
   */
  onSpeedChange(event) {
    this.generateTimeout = parseInt(event.target.value)
  }

  /**
   * Lorsqu'on clique pour générer le labyrinthe.
   *
   * @param {MouseEvent} event
   */
  onBuildClick(event) {
    const algorithmRadio = this.container.querySelector('input[name="algorithm"]:checked').id
    this.generator = generatorFromName(algorithmRadio, this.maze)

    if (this.generator.hasNext()) {
      this.onGeneratorStep()
    }
  }

  /**
   * 
   */
  onGeneratorStep() {
    const value = this.generator.next()
    if (value !== false) {
      this.vue.clear()
      this.vue.draw(this.maze, value)
    }
    if (this.generator.hasNext()) {
	  if (this.generateTimeout > 2) {
		window.setTimeout(this.onGeneratorStep, this.generateTimeout)
	  } else {
	    this.onGeneratorStep()
	  }
    }
  }

  /**
   * Met à jour les dimensions du canevas lorsque la page est redimensionnée.
   */
  onResize() {
    const canvas = this.vue.canvas
    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight
    this.vue.draw(this.maze)
  }
}
