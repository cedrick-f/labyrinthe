import { Controller } from './Controller.js'
import {bindModalEvents} from './vue/modal.js';

new Controller(document.querySelector('.grid'))

bindModalEvents(
    document.querySelectorAll('.modal-action'),
    document.querySelector('#modal-container')
)
