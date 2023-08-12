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
 * 获取startOffset在commonAncestorContainer中的offset
 * @param range range
 * @returns startOffset在commonAncestorContainer中的offset
 */
export function calculateRelativeOffset(range: Range, target: Node) {
    let offset = range.startOffset
    let node = range.startContainer
    if (node === target) {
        return offset
    }
    while (node && node !== target) {
        if (node.previousSibling && node.previousSibling.nodeType === Node.TEXT_NODE) {
            offset += node.previousSibling.textContent?.length ?? 0
        } else if (node.previousSibling) {
            offset += 1
        }
        if (!node.previousSibling && node.parentNode) {
            node = node.parentNode
        } else if (node.previousSibling) {
            node = node.previousSibling
        }
    }
    return offset
}
