import {Labyrinthe, LabyrintheImage} from './maze/Labyrinthe.js';
import {LabyrintheVue} from './vue/LabyrintheVue.js';
import {generatorFromName} from './maze/LabyrintheGenerator.js';
import {solverByName} from './maze/LabyrintheSolver.js';
import {GameController} from './GameController.js';
import {openModal} from "./vue/modal";

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
    this.onSolverStep = this.onSolverStep.bind(this)

    /** @type {HTMLInputElement} */
    const widthInput = container.querySelector('#width')
    /** @type {HTMLInputElement} */
    const heightInput = container.querySelector('#height')
    /** @type {HTMLInputElement} */
    const buildSpeedInput = container.querySelector('#build-speed')
    /** @type {HTMLInputElement} */
    const solveSpeedInput = container.querySelector('#solve-speed')
    /** @type {HTMLInputElement} */
    const imgInput = container.querySelector('#img-input')
    /** @type {HTMLInputElement} */
    this.solveButton = container.querySelector('#solve')
    /** @type {HTMLInputElement} */
    this.playButton = container.querySelector('#play')
    /** @type {HTMLSelectElement} */
    this.buildAlgorithmSelect = container.querySelector('#algorithm')

    container.querySelector('#info-build').addEventListener('click', this.onBuildInfoClick.bind(this))

    this.maze = new Labyrinthe(parseInt(widthInput.value), parseInt(heightInput.value))
    this.vue = new LabyrintheVue(container.querySelector('canvas'))

    for (const element of [widthInput, heightInput]) {
      element.addEventListener('input', this.onDimensionsChange)
    }
    container.querySelector('#build').addEventListener('click', this.onBuildClick.bind(this))
    this.solveButton.addEventListener('click', this.onSolveClick.bind(this))
    this.solveButton.disabled = true
    this.playButton.addEventListener('click', this.onPlayClick.bind(this))
    this.generateTimeout = parseInt(buildSpeedInput.value)
    buildSpeedInput.addEventListener('input', this.onSpeedChange)
    this.solveTimeout = parseInt(solveSpeedInput.value)
    solveSpeedInput.addEventListener('input', this.onSpeedChange)

    imgInput.addEventListener('change', this.onImageInput.bind(this))

    /** @type {null|MazeGenerator} */
    this.generator = null
    /** @type {null|MazeSolver} */
    this.solver = null
    /** @type {null|GameController} */
    this.game = null

    window.addEventListener('resize', this.onResize)
    this.onResize()

    this.timeoutId = 0
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
    const timeout = parseInt(event.target.value)
    if (event.target.id.includes('solve')) {
      this.solveTimeout = timeout
    } else {
      this.generateTimeout = timeout
    }
  }

  /**
   * Lorsqu'on clique pour générer le labyrinthe.
   *
   * @param {MouseEvent} event
   */
  onBuildClick(event) {
    if (this.game) {
      this.game.stop()
      this.game = null
    }
    window.clearInterval(this.timeoutId)
    this.generator = generatorFromName(this.buildAlgorithmSelect.value, this.maze)

    if (this.generator.hasNext()) {
      this.onGeneratorStep()
      if (this.generateTimeout) {
        this.solveButton.disabled = true
        this.playButton.disabled = true
      }
    }
  }

  /**
   * Lorsqu'on clique pour résoudre le labyrinthe.
   *
   * @param {MouseEvent} event
   */
  onSolveClick(event) {
    if (this.game) {
      this.game.stop()
      this.game = null
    }
    window.clearInterval(this.timeoutId)
    this.solver = solverByName('astar', this.maze)
    if (this.solver.hasNext()) {
      this.onSolverStep()
    }
  }

  /**
   * Lorsqu'on clique pour plus d'informations sur l'algorithme.
   *
   * @param {MouseEvent} event
   */
  onBuildInfoClick(event) {
    openModal(`info_${this.buildAlgorithmSelect.value}.html`, document.querySelector('#modal-container'))
  }

  /**
   * Lorsqu'on clique pour jouer.
   *
   * @param {MouseEvent} event
   */
   onPlayClick(event) {
     if (this.game) {
       this.game.stop()
     }
     this.game = new GameController(this.container, this.maze, this.vue)
   }

  /**
   * 
   */
  onGeneratorStep() {
    const value = this.generator.next()
    if (this.generateTimeout) {
      this.vue.clear()
      if (this.generator.hasNext()) {
        this.vue.draw(this.maze, value)
        this.timeoutId = window.setTimeout(this.onGeneratorStep, this.generateTimeout)
      } else {
        this.onGeneratorEnd()
      }
    } else {
      while (this.generator.hasNext()) {
        this.generator.next()
      }
      this.onGeneratorEnd()
    }
  }

  onGeneratorEnd() {
    this.maze.trouverPlusLongChemin()
    this.vue.clear()
    this.vue.draw(this.maze)
    this.solveButton.disabled = false
    this.playButton.disabled = false
  }

  onSolverStep() {
    const value = this.solver.next()
    if (value !== false && this.solveTimeout) {
      this.vue.drawPathTest(this.maze, value)
    }
    if (this.solveTimeout) {
      if (this.solver.hasNext()) {
        this.timeoutId = window.setTimeout(this.onSolverStep, this.solveTimeout)
      } else {
        this.vue.drawPath(this.maze, this.solver.path)
      }
    } else {
      while (this.solver.hasNext()) {
        this.solver.next()
      }
      this.vue.drawPath(this.maze, this.solver.path)
    }
  }

  /**
   * Lorsqu'une image est importée.
   *
   * @param {Event} event
   */
  onImageInput(event) {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    createImageBitmap(file).then(bitmap => {
      const imageData = this.vue.drawBitmap(bitmap)
      this.maze = new LabyrintheImage(imageData)
      this.solver = solverByName('astar', this.maze)
      if (this.solver.hasNext()) {
        this.onSolverStep()
      }
    });
  }

  /**
   * Met à jour les dimensions du canevas lorsque la page est redimensionnée.
   */
  onResize() {
    const canvas = this.vue.canvas
    canvas.width = 0
    canvas.height = 0
    canvas.width = canvas.parentElement.offsetWidth
    canvas.height = canvas.parentElement.offsetHeight
    this.vue.draw(this.maze)
    if (this.solver) {
      this.vue.drawPath(this.maze, this.solver.path)
    }
  }
}
