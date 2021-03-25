import {Labyrinthe, LabyrintheImage} from './maze/Labyrinthe.js';
import {LabyrintheVue} from './vue/LabyrintheVue.js';
import {generatorFromName} from './maze/LabyrintheGenerator.js';
import {solverByName} from './maze/LabyrintheSolver.js';

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

    this.maze = new Labyrinthe(parseInt(widthInput.value), parseInt(heightInput.value))
    this.vue = new LabyrintheVue(container.querySelector('canvas'))

    for (const element of [widthInput, heightInput]) {
      element.addEventListener('input', this.onDimensionsChange)
    }
    container.querySelector('#build').addEventListener('click', this.onBuildClick.bind(this))
    this.generateTimeout = parseInt(buildSpeedInput.value)
    buildSpeedInput.addEventListener('input', this.onSpeedChange)
    this.solveTimeout = parseInt(solveSpeedInput.value)
    solveSpeedInput.addEventListener('input', this.onSpeedChange)

    imgInput.addEventListener('change', this.onImageInput.bind(this))

    for (const element of container.querySelectorAll("input[name='info']")) {
      element.addEventListener('click', this.onInfoClick.bind(this))
    }

    /** @type {null|MazeGenerator} */
    this.generator = null
    /** @type {null|MazeSolver} */
    this.solver = null

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
    window.clearInterval(this.timeoutId)
    const algorithmRadio = this.container.querySelector('input[name="algorithm"]:checked').id
    this.generator = generatorFromName(algorithmRadio, this.maze)

    if (this.generator.hasNext()) {
      this.onGeneratorStep()
    }
  }

  /**
   * Lorsqu'on clique sur un bouton d'information.
   *
   * @param {MouseEvent} event
   */
   onInfoClick(event) {
    let html = ""
    switch (event.target.id) {
      case 'info_random':
        html = "info_random.html"
        break;
      case 'info_fusion':
        html = "info_fusion.html"
        break;
      case 'info_prim':
        html = "info_prim.html"
        break;
      case 'info_aldous-broder':
        html = "info_aldous.html"
        break;
      default:
        return
    }


    // chargement du message d'information (dans le div concerné)
    $(function(){
      $("#popup-message").load(html); 
    });
    var modal = document.getElementById("modal-container");
    if (modal) {
      modal.style.display = "block";
    }
  }

  /**
   * 
   */
  onGeneratorStep() {
    const value = this.generator.next()
    if (value !== false && this.generateTimeout) {
      this.vue.clear()
      this.vue.draw(this.maze, value)
    }
    if (this.generateTimeout) {
      if (this.generator.hasNext()) {
        this.timeoutId = window.setTimeout(this.onGeneratorStep, this.generateTimeout)
      }
    } else {
      while (this.generator.hasNext()) {
        this.generator.next()
      }
      this.vue.clear()
      this.vue.draw(this.maze)
    }
  }

  onSolverStep() {
    const value = this.solver.next()
    if (value !== false && this.solveTimeout) {
      this.vue.drawPathTest(this.maze, value)
    }
    if (this.solveTimeout) {
      if (this.solver.hasNext()) {
        this.timeoutId = window.setTimeout(this.onSolverStep, this.solveTimeout)
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
  }
}
