import tippy, { Instance } from 'tippy.js'
import { template, uniqueId } from 'lodash-es'
import logUtil from '@/utils/log'
import tooltip from '@/template/tooltip.html'
import { calculateRelativeStartOffset, domParse, getLengthInElement, isWhitespaceNode } from './utils'
import { ActionType, InitOptions, ReplaceNodeClass, ReplaceNodeMethod, ReplaceNodeTag, ReplaceNodeTagPrefix, Status } from './constant'

/**
 * @class
 */
export default class IntroTour {
    /**
     * @default ""
     * 自定义className
     */
    private className = ''

    /**
     * @default null
     * 气泡实例
     */
    private tippyInstance: Instance | null = null

    /**
     * @readonly
     * @description 按钮注册的方法
     */
    // TODO:light 背景高亮
    private readonly customEvents = ActionType

    /**
     * 发生错误时的回调方法
     * @param error 错误
     */
    private readonly errorHandler = (error: Error) => {
        logUtil.error(error)
    }

    /**
     * 发生警告时的回调方法
     * @param message 警告消息
     */
    private readonly warnHandler = (message: string) => {
        logUtil.warn(message)
    }

    /**
     * 操作成功时的回调方法
     * @param message 成功消息
     */
    private readonly successHandler = (message: string) => {
        logUtil.log(message)
    }

    /**
     * @description 选中的range
     */
    private range: Range | null = null

    /**
     * @description 气泡依赖的元素
     */
    private root: HTMLElement = document.createElement('div')

    /**
     * @description 气泡内容依赖的元素
     */
    private tools: HTMLElement = document.createElement('div')

    /**
     * @description 当前要操作的对象元素tag（划线等操作后的页面元素tag）
     */
    private checkedElementTag: Partial<Record<ReplaceNodeTag, string>> = {}

    get checkElements() {
        const keys = Object.keys(this.checkedElementTag)
        const eles = keys.reduce((prev, cur) => {
            prev.push(...Array.from(document.querySelectorAll(`[data-${cur}='${this.checkedElementTag[cur]}']`)))
            return prev
        }, [] as Array<Element>)
        return eles
    }

    get status(): Status {
        const keys = Object.keys(this.checkedElementTag)
        return {
            isMark: keys.includes(ReplaceNodeTag.mark),
            isColor: keys.includes(ReplaceNodeTag.color),
            isLight: keys.includes(ReplaceNodeTag.light),
            isBold: keys.includes(ReplaceNodeTag.bold),
            isComment: keys.includes(ReplaceNodeTag.comment),
        }
    }

    constructor(options: InitOptions = {}) {
        if (window.introTour) {
            throw new Error('plugin has been initialized. Do not call it again')
        }
        const { errorHandler, warnHandler, successHandler, className } = options
        if (errorHandler) {
            this.errorHandler = errorHandler
        }
        if (warnHandler) {
            this.warnHandler = warnHandler
        }
        if (successHandler) {
            this.successHandler = successHandler
        }
        if (className) {
            this.className = className
        }
        this.initEvent()
        this.initTooltip()
        logUtil.log('plugin initialization is complete!')
        window.introTour = this
    }

    private generateTooltip() {
        const htmlTemplate = template(tooltip)
        const renderTemplate = htmlTemplate(this.status)
        this.tools.innerHTML = ''
        this.tools.appendChild(domParse(renderTemplate))
    }

    private initTooltip = () => {
        this.root.classList.add('intro-tour-outer-container')
        this.generateTooltip()
        document.body.appendChild(this.root)
        this.tippyInstance = tippy(this.root, {
            content: this.tools,
            arrow: true,
            placement: 'top',
            interactive: true,
            animation: 'scale',
            trigger: 'manual',
            hideOnClick: false,
        })
    }

    private initEvent = () => {
        document.addEventListener('mousedown', this.onMousedown)
        document.addEventListener('mouseup', this.onMouseup)
    }

    private setTippyContent() {
        this.generateTooltip()
        this.tippyInstance?.setContent(this.tools)
    }

    private onMouseup = () => {
        const selection = window.getSelection()
        if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0)
            const selectTextLength = range.toString().length
            if (range.collapsed || selectTextLength === 0) {
                this.warnHandler('range is collapsed')
            } else {
                this.range = range.cloneRange()
                this.setTippyContent()
                this.showTooltip(this.range)
            }
        } else if (Object.values(this.status).some(Boolean)) {
            this.setTippyContent()
            if (this.range) {
                const startContainer = this.checkElements[0]?.firstChild
                const endContainer = this.checkElements[this.checkElements.length - 1]?.lastChild
                if (startContainer && endContainer) {
                    this.range.setStart(startContainer, 0)
                    this.range.setEnd(endContainer, endContainer?.nodeValue?.length ?? 0)
                    window.getSelection()?.removeAllRanges()
                    window.getSelection()?.addRange(this.range)
                    this.showTooltip(this.range)
                }
            }
        } else {
            this.tippyInstance?.hide()
        }
    }

    private onMousedown = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const method = target.dataset?.method ?? ''
        const customDataTag = Object.keys(target.dataset).filter((item) => item !== 'method') as ReplaceNodeTag[]
        const isInnerChild = this.tools.contains(target)
        const tagRange = Object.values(ReplaceNodeTag)
        const isEditedCell = customDataTag.some((i) => tagRange.includes(i))
        if (!isInnerChild) {
            this.checkedElementTag = {}
        }
        if (isInnerChild) {
            if (this.customEvents[method]) {
                this[method]()
            }
        } else if (isEditedCell) {
            this.range = document.createRange()
            customDataTag.forEach((item) => {
                this.checkedElementTag[item] = target.dataset[item]
            })
        }
        this.tippyInstance?.hide()
        this.root.style.setProperty('--intro-tour-z', `-1`)
    }

    private showTooltip = (range: Range) => {
        const rect = range.getBoundingClientRect()
        const { left, top, width, height } = rect
        this.root.style.setProperty('--intro-tour-l', `${left}px`)
        this.root.style.setProperty('--intro-tour-t', `${top}px`)
        this.root.style.setProperty('--intro-tour-w', `${width}px`)
        this.root.style.setProperty('--intro-tour-h', `${height}px`)
        this.root.style.setProperty('--intro-tour-z', `1`)
        this.tippyInstance?.show()
    }

    private getTextNodesInRangeByContainer(range: Range, container: Node, ...filters: ReplaceNodeClass[]) {
        const textNodes: Node[] = []
        const callback = (node: Node) => {
            if (isWhitespaceNode(node)) {
                return NodeFilter.FILTER_REJECT
            }
            let isTarget = filters.length === 0
            if (filters.length && node.parentNode && node.parentNode.nodeType === Node.ELEMENT_NODE) {
                const parentNodeClassList = (node.parentNode as Element).classList
                isTarget = filters.some((item) => parentNodeClassList.contains(item))
            }
            const result = range.intersectsNode(node) && isTarget
            return result ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }
        const treeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
            acceptNode: callback,
        })
        do {
            const { currentNode } = treeWalker
            if (
                currentNode.nodeType === Node.TEXT_NODE &&
                currentNode.nodeValue?.length &&
                callback(currentNode) === NodeFilter.FILTER_ACCEPT
            ) {
                textNodes.push(currentNode)
            }
        } while (treeWalker.nextNode())
        return textNodes
    }

    private getTextNodesInRange(range: Range, ...filters: ReplaceNodeClass[]) {
        return this.getTextNodesInRangeByContainer(range, range.commonAncestorContainer, ...filters)
    }

    private copy = () => {
        document.execCommand('copy')
        window.getSelection()?.removeAllRanges()
        this.successHandler('copy')
    }

    private freeTextNode(node: Node, normalize = false) {
        if (node.parentNode && node.parentNode.nodeType === Node.ELEMENT_NODE) {
            node.parentNode.parentNode?.replaceChild(node, node.parentNode)
            if (normalize) {
                node.parentNode.parentNode?.normalize()
            }
        }
    }

    private getMarkNodesParentMap(nodes: Node[]) {
        const result: Map<Node | null, Array<{ node: Node; isMarked: boolean }>> = new Map()
        for (let index = 0; index < nodes.length; index += 1) {
            const node = nodes[index]
            const isMarked = node.parentElement?.classList.contains(ReplaceNodeClass.mark) ?? false
            const desc = {
                node,
                isMarked,
            }
            if (isMarked) {
                const temp = node.parentNode?.parentNode
                if (temp) {
                    result.set(temp, result.get(temp)?.concat(desc) ?? [desc])
                }
            } else {
                result.set(node.parentNode, result.get(node.parentNode)?.concat(desc) ?? [desc])
            }
        }
        return result
    }

    private replaceTextNodes(node: Node, start: number, end: number, type: ActionType, id: string) {
        const fragment = document.createDocumentFragment()
        const targetClass = ReplaceNodeClass[type]
        const targetMethod = ReplaceNodeMethod[type]
        const targetTag = ReplaceNodeTag[type]
        let startNode: Node | null = null
        let midNode: HTMLSpanElement | Node | null = null
        let endNode: Node | null = null
        if (start !== 0 && node.nodeValue) {
            startNode = document.createTextNode(node.nodeValue.slice(0, start))
        }
        if (node.nodeValue) {
            if ([ActionType.mark].includes(type)) {
                midNode = document.createElement('span')
                midNode.textContent = node.nodeValue.slice(start, end)
                ;(midNode as HTMLSpanElement).className = `${targetClass} ${this.className}`
                ;(midNode as HTMLSpanElement).dataset.method = `${targetMethod}`
                ;(midNode as HTMLSpanElement).dataset[targetTag] = `${id}`
            }
        }
        if (end !== 0 && node.nodeValue) {
            endNode = document.createTextNode(node.nodeValue.slice(end))
        }
        if (startNode) {
            fragment.appendChild(startNode)
        }
        if (midNode) {
            fragment.appendChild(midNode)
        }
        if (endNode) {
            fragment.appendChild(endNode)
        }
        node.parentNode?.replaceChild(fragment, node)
    }

    private mark = () => {
        if (this.range) {
            const selection = window.getSelection()
            const { startContainer, endContainer, startOffset, endOffset } = this.range
            const markedtTextNodes = this.getTextNodesInRange(this.range, ReplaceNodeClass.mark)
            const textNodes = this.getTextNodesInRange(this.range)
            const uuid = uniqueId(ReplaceNodeTagPrefix.mark)
            if (markedtTextNodes.length) {
                const map = this.getMarkNodesParentMap(textNodes)
                map.forEach((value, key) => {
                    const firstMarked = value.find((item) => item.isMarked)
                    const index = Array.prototype.findIndex.call(key?.childNodes, (n) => {
                        if ((n as Element).classList?.contains(ReplaceNodeClass.mark)) {
                            return (n as Node).firstChild === firstMarked?.node
                        }
                        return false
                    })
                    const realIndex = index - 1 < 0 ? 0 : index - 1
                    if (this.range && key?.childNodes[realIndex]) {
                        value.forEach((item) => {
                            if (item.isMarked) {
                                this.freeTextNode(item.node)
                            }
                        })
                        key?.normalize()
                        const relativeStartOffset = calculateRelativeStartOffset(this.range, key?.childNodes[realIndex])
                        const relativeEndOffset = getLengthInElement(this.range, key as HTMLElement) + relativeStartOffset
                        this.replaceTextNodes(key?.childNodes[realIndex], relativeStartOffset, relativeEndOffset, ActionType.mark, uuid)
                    }
                })
            } else {
                textNodes.forEach((node) => {
                    let startSliceOffset = 0
                    let endSliceOffset = node.nodeValue?.length ?? 0
                    if (node === startContainer && startOffset !== 0) {
                        startSliceOffset = startOffset
                    }
                    if (node === endContainer && endOffset !== 0) {
                        endSliceOffset = endOffset
                    }
                    this.replaceTextNodes(node, startSliceOffset, endSliceOffset, ActionType.mark, uuid)
                })
            }
            if (selection) {
                selection.removeAllRanges()
            }
            this.successHandler('mark')
        }
    }

    private introTourMarkCancel = () => {
        this.checkElements.forEach((ele) => {
            if (ele.classList.length === 1 && ele.firstChild) {
                this.freeTextNode(ele.firstChild, true)
            } else {
                ele.classList.remove(ReplaceNodeClass.mark)
            }
        })
        this.successHandler('markcancel')
    }

    // TODO:完善功能
    private comment = () => {
        this.successHandler('comment')
    }

    // 序列化存储
    private serialize() {
        logUtil.log('serialize')
    }

    // 反序列化存储
    private deSerialize() {
        logUtil.log('deSerialize')
    }
}
