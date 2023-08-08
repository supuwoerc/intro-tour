import { ReplaceNodeClass } from '@/constant'
import logUtil from '@/utils/log'
/**
 * 产生uuid
 * @returns uuid
 */
export function uuid() {
    return crypto.randomUUID()
}

/**
 * 将字符串模板转为dom
 * @param templates 字符串模板
 * @returns DocumentFragment
 */
export function domParse(...templates: string[]) {
    const documentFragment = document.createDocumentFragment()
    try {
        for (let index = 0; index < templates.length; index += 1) {
            const template = templates[index]
            const contextualFraement = document.createRange().createContextualFragment(template)
            documentFragment.appendChild(contextualFraement)
        }
    } catch (error) {
        logUtil.error(error)
    }
    return documentFragment
}

export function getPrevMarkedNode(node: Node) {
    const prevNodes: Node[] = []
    while (
        node.previousSibling &&
        node.previousSibling.nodeType === Node.ELEMENT_NODE &&
        (node as Element).classList.contains(ReplaceNodeClass.mark)
    ) {
        prevNodes.push(node.previousSibling)
        node = node.previousSibling
    }
    return prevNodes
}

export function getNextMarkedNode(node: Node) {
    const nextNodes: Node[] = []
    while (
        node.nextSibling &&
        node.nextSibling.nodeType === Node.ELEMENT_NODE &&
        (node as Element).classList.contains(ReplaceNodeClass.mark)
    ) {
        nextNodes.push(node.nextSibling)
        node = node.nextSibling
    }
    return nextNodes
}
