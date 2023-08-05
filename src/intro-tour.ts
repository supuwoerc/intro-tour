import tippy, { Instance } from 'tippy.js'
import logUtil from '@/utils/log'
import tooltip from '@/template/tooltip.html'
import { domParse } from './utils'

export interface InitOptions {
    errorHandler?: (error: Error) => void
    warnHandler?: (message: string) => void
    successHandler?: (message: string) => void
}
/**
 * @class
 */
export default class IntroTour {
    /**
     * @default null
     * 气泡实例
     */
    private tippyInstance: Instance | null = null

    /**
     * @readonly
     * @description 按钮注册的方法
     */
    private readonly customEvents = ['annotate', 'mark', 'copy']

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

    constructor(options: InitOptions = {}) {
        if (window.introTour) {
            throw new Error('plugin has been initialized. Do not call it again')
        }
        const { errorHandler, warnHandler, successHandler } = options
        if (errorHandler) {
            this.errorHandler = errorHandler
        }
        if (warnHandler) {
            this.warnHandler = warnHandler
        }
        if (successHandler) {
            this.successHandler = successHandler
        }
        this.initEvent()
        this.initTooltip()
        logUtil.log('plugin initialization is complete!')
        window.introTour = this
    }

    private initTooltip = () => {
        this.root.classList.add('intro-tour-outer-container')
        this.tools.appendChild(domParse(tooltip))
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

    private onMouseup = () => {
        const selection = window.getSelection()
        if (selection) {
            const range = selection.getRangeAt(0)
            if (range.collapsed) {
                this.warnHandler('range is collapsed')
            } else {
                this.range = range.cloneRange()
                this.showTooltip(this.range)
            }
        }
    }

    private onMousedown = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const isInnerChild = this.tools.contains(target)
        if (isInnerChild) {
            const method = target.dataset?.method ?? ''
            if (this.customEvents.includes(method)) {
                this[method]()
            }
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
        this.range = range
    }

    private getTextNodesInRange(range: Range) {
        const textNodes: Node[] = []
        const treeWalker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
            },
        })
        const { currentNode } = treeWalker
        if (currentNode.nodeType === Node.TEXT_NODE && range.intersectsNode(currentNode)) {
            textNodes.push(currentNode)
        }
        while (treeWalker.nextNode()) {
            textNodes.push(treeWalker.currentNode)
        }
        return textNodes
    }

    private replaceTextNodes(node: Node, start: number, end: number) {
        const fragment = document.createDocumentFragment()
        let startNode: Node | null = null
        let midNodes: HTMLSpanElement[] | null = null
        let endNode: Node | null = null
        if (start !== 0 && node.nodeValue) {
            startNode = document.createTextNode(node.nodeValue.slice(0, start))
        }
        if (node.nodeValue) {
            midNodes = node.nodeValue
                .slice(start, end)
                .split('')
                .map((text) => {
                    const textNode = document.createElement('span')
                    textNode.className = 'intro-tour-mark-text'
                    textNode.textContent = text
                    return textNode
                })
        }
        if (end !== 0 && node.nodeValue) {
            endNode = document.createTextNode(node.nodeValue.slice(end))
        }
        if (startNode) {
            fragment.appendChild(startNode)
        }
        if (midNodes) {
            midNodes.forEach((item) => {
                fragment.appendChild(item)
            })
        }
        if (endNode) {
            fragment.appendChild(endNode)
        }
        node.parentNode?.replaceChild(fragment, node)
    }

    private copy = () => {
        document.execCommand('copy')
        this.successHandler('copy')
    }

    // TODO:完善功能
    private mark = () => {
        this.successHandler('mark')
        if (this.range) {
            const textNodes = this.getTextNodesInRange(this.range)
            const { startContainer, endContainer, startOffset, endOffset } = this.range
            textNodes.forEach((node) => {
                let startSliceOffset = 0
                let endSliceOffset = node.nodeValue?.length ?? 0
                if (node === startContainer && startOffset !== 0) {
                    startSliceOffset = startOffset
                }
                if (node === endContainer && endOffset !== 0) {
                    endSliceOffset = endOffset
                }
                this.replaceTextNodes(node, startSliceOffset, endSliceOffset)
            })
        }
    }

    // TODO:完善功能
    private annotate = () => {
        this.successHandler('annotate')
    }
}
