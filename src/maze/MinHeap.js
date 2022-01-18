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
        while (current > 0 && this.heap[(current - 1) >> 1].priority > this.heap[current].priority) {
            // On fait remonter le nœud tant que son parent a une priorité plus importante.
            this._swap(current, (current - 1) >> 1)
            current = (current - 1) >> 1
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
        let current = 0
        while (this._hasLeftChild(current)) {
            // Que l'on fait descendre dans l'arbre tant qu'un des nœuds enfants a une priorité plus faible
            let smallerChildIndex = (current << 1) + 1
            if ((smallerChildIndex + 1) < this.heap.length && this.heap[smallerChildIndex + 1].priority < this.heap[smallerChildIndex].priority) {
                smallerChildIndex += 1
            }

            // Échange avec le fils qui a la priorité la plus faible
            if (this.heap[current].priority > this.heap[smallerChildIndex].priority) {
                this._swap(current, smallerChildIndex)
                current = smallerChildIndex
            } else {
                return root.val
            }
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
     * @param {number} index
     * @return {boolean}
     * @private
     */
    _hasLeftChild(index) {
        return ((index << 1) + 1) < this.heap.length;
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
