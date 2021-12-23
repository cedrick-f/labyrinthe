/**
 * @template T
 */
class Node {
    /**
     * @param {T} val
     * @param {number} priority
     */
    constructor(val, priority) {
        this.val = val;
        this.priority = priority;
    }
}

/**
 * Un tas binaire priorisant les plus faibles priorités.
 *
 * @template T
 */
export class MinHeap {

    constructor() {
        /** @type {Node<T>[]} */
        this.heap = [];
    }

    /**
     * Insère un élément avec une priorité associée.
     *
     * @param {T} val
     * @param {number} priority
     */
    queue(val, priority) {
        this.heap.push(new Node(val, priority))
        let current = this.heap.length - 1
        while (current > 0 && this.heap[current >> 1].priority > this.heap[current].priority) {
            // On fait remonter le nœud tant que son parent a une priorité plus importante.
            this._swap(current, current >> 1)
            current >>= 1
        }
    }

    /**
     * Accède et retire l'élément avec la priorité la plus faible.
     *
     * @return {T}
     */
    poll() {
        if (this.heap.length < 2) {
            return this.heap.pop().val
        }

        // La racine correspond au nœud avec la priorité minimale
        const root = this.heap[0]

        // On utilise comme nouvelle racine le nœud en dernière position du tas
        this.heap[0] = this.heap.pop()
        let index = 1
        while (index < this.heap.length) {
            // Que l'on fait descendre dans l'arbre tant qu'un des nœuds enfants a une priorité plus faible
            const parent = this.heap[index >> 1].priority
            const left = this.heap[index].priority
            const right = (index + 1) < this.heap.length ? this.heap[index + 1].priority : Number.POSITIVE_INFINITY
            if (parent < left && parent < right) {
                return root.val
            }

            // Échange avec le fils qui a la priorité la plus faible
            if (left < right) {
                this._swap(index >> 1, index)
            } else {
                this._swap(index >> 1, index + 1)
            }
            index <<= 1
        }
        return root.val
    }

    /**
     * Teste si le tas est vide.
     *
     * @return {boolean}
     */
    empty() {
        return this.heap.length === 0;
    }

    /**
     * @param {number} i1
     * @param {number} i2
     * @private
     */
    _swap(i1, i2) {
        const temp = this.heap[i1]
        this.heap[i1] = this.heap[i2]
        this.heap[i2] = temp
    }
}
