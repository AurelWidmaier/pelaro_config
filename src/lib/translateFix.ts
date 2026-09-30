/**
 * Macht die Seite robust gegen die Übersetzung im Browser (Chrome, Edge,
 * Google Translate). Die Übersetzung ersetzt Textknoten durch eigene
 * <font>-Elemente. React kennt davon nichts und
 *  - ändert weiter den alten, nicht mehr sichtbaren Textknoten
 *    → Preise, Summen und Buttons würden auf dem alten Stand stehen bleiben,
 *  - entfernt den alten Textknoten oder fügt davor ein
 *    → „removeChild/insertBefore: not a child of this node“, die Seite stürzt ab.
 *
 * Deshalb merken wir uns, welcher Textknoten durch welches Element ersetzt
 * wurde, und leiten Reacts Änderungen dorthin um. Ändert sich ein Text, kommt
 * der deutsche Originalknoten zurück ins DOM – die Übersetzung übersetzt ihn
 * dann einfach neu.
 */

const replacedBy = new WeakMap<Node, Node>()

/** Aktueller Stellvertreter eines ersetzten Knotens im DOM (oder der Knoten selbst). */
function inDom(node: Node, parent: Node): Node | undefined {
  if (node.parentNode === parent) return node
  const replacement = replacedBy.get(node)
  return replacement && replacement.parentNode === parent ? replacement : undefined
}

function watchReplacements() {
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.removedNodes.length === 0 || record.addedNodes.length === 0) continue
      const added = [...record.addedNodes].find((n) => n.nodeName === 'FONT')
      if (!added) continue
      record.removedNodes.forEach((removed) => {
        if (removed.nodeType === Node.TEXT_NODE && !removed.isConnected) replacedBy.set(removed, added)
      })
    }
  }).observe(document.documentElement, { childList: true, subtree: true })
}

function patchDom() {
  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    const target = inDom(child, this)
    if (target) originalRemoveChild.call(this, target)
    return child
  }

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) {
      const target = inDom(ref, this)
      return originalInsertBefore.call(this, node, target ?? null) as T
    }
    return originalInsertBefore.call(this, node, ref) as T
  }

  // React setzt geänderten Text über nodeValue bzw. textContent des Textknotens.
  for (const key of ['nodeValue', 'textContent', 'data'] as const) {
    const proto = key === 'data' ? CharacterData.prototype : Node.prototype
    const descriptor = Object.getOwnPropertyDescriptor(proto, key)
    if (!descriptor?.set || !descriptor.get) continue
    Object.defineProperty(proto, key, {
      ...descriptor,
      set(this: Node, value: string | null) {
        descriptor.set!.call(this, value)
        if (this.nodeType !== Node.TEXT_NODE || this.isConnected) return
        const replacement = replacedBy.get(this)
        if (replacement?.parentNode) {
          replacement.parentNode.replaceChild(this, replacement)
          replacedBy.delete(this)
        }
      },
    })
  }
}

if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
  watchReplacements()
  patchDom()
}
