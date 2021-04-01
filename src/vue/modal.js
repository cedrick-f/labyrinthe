/** @type {null|HTMLElement} */
let currentModal = null
/** @type {Object.<string, string>} */
const cache = {}

/**
 * Affiche la boîte modale.
 *
 * @param {Event|string} event
 * @param {HTMLElement} modal Conteneur global
 */
export async function openModal(event, modal) {
    let target
    if (typeof event === 'string') {
        target = event
    } else {
        event.preventDefault()
        target = event.target.getAttribute('href')
    }
    modal.lastElementChild.lastElementChild.innerHTML = await loadModal(target)
    modal.setAttribute('aria-modal', 'true')
    modal.removeAttribute('hidden')
    modal.querySelector('.close').focus()
    currentModal = modal
}

/**
 * Ferme la boîte modale actuellement ouverte.
 *
 * @param {Event} event
 */
function closeModal(event) {
    if (currentModal === null) {
        return
    }
    event.preventDefault()
    currentModal.setAttribute('hidden', 'hidden')
    currentModal.removeAttribute('aria-modal')
    currentModal = null
}

/**
 * @param {string} url
 * @return {Promise<string>}
 */
async function loadModal(url) {
    if (cache[url]) {
        return cache[url]
    }
    const html = await fetch(url).then(response => response.text())
    cache[url] = html
    return html
}

/**
 * @param {NodeList} nodeList
 * @param {HTMLElement} modalContainer
 */
export function bindModalEvents(nodeList, modalContainer) {
    nodeList.forEach(function (link) {
        link.addEventListener('click', event => openModal(event, modalContainer))
    })

    const close = modalContainer.querySelector('.close')
    close.addEventListener('click', closeModal)
    close.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            closeModal(event)
        }
    })
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            closeModal(event)
        }
    })
}
