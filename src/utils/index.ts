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
/**
 * 获取startOffset在targetNode的offset
 * @param range range
 * @returns 获取startOffset在targetNode的offset
 */
export function calculateRelativeStartOffset(range: Range, target: Node) {
    let offset = range.startOffset
    let node = range.startContainer
    if (node === target) {
        return offset
    }
    while (node && node !== target) {
        if (node.previousSibling && node.previousSibling.nodeType === Node.TEXT_NODE) {
            offset += node.previousSibling.textContent?.length ?? 0
        }
        if (!node.previousSibling && node.parentNode) {
            node = node.parentNode
        } else if (node.previousSibling) {
            node = node.previousSibling
        }
        if (node === range.commonAncestorContainer) {
            return offset
        }
    }
    return offset
}

export function getLengthInElement(range: Range, element: HTMLElement) {
    if (!range.intersectsNode(element)) return 0
    let length = 0
    if (element.contains(range.startContainer) && element.contains(range.endContainer)) {
        length = range.toString().length
        return length
    }
    const tempRange = document.createRange()
    if (element.contains(range.startContainer)) {
        tempRange.setStart(range.startContainer, range.startOffset)
        tempRange.setEndAfter(element)
        length = tempRange.toString().length
        return length
    }
    if (element.contains(range.endContainer)) {
        tempRange.setStartBefore(element)
        tempRange.setEnd(range.endContainer, range.endOffset)
        length = tempRange.toString().length
        return length
    }
    return 0
}
