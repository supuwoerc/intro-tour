import tippy, { Instance } from 'tippy.js'
import logUtil from '@/utils/log'
import tooltip from '@/template/tooltip.html'
import { domParse } from './utils'
import { ActionType, InitOptions, ReplaceNodeClass, ReplaceNodeMethod } from './constant'

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
        const method = target.dataset?.method ?? ''
        const isInnerChild = this.tools.contains(target)
        const isMarkCell = method === 'introTourMarkCancel'
        if (isInnerChild || isMarkCell) {
            if (this.customEvents[method]) {
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
        do {
            const { currentNode } = treeWalker
            if (currentNode.nodeType === Node.TEXT_NODE && range.intersectsNode(currentNode)) {
                textNodes.push(currentNode)
            }
        } while (treeWalker.nextNode())
        return textNodes
    }

    private replaceTextNodes(node: Node, start: number, end: number, type: ActionType) {
        const fragment = document.createDocumentFragment()
        const targetClass = ReplaceNodeClass[type]
        const targetMethod = ReplaceNodeMethod[type]
        let startNode: Node | null = null
        let midNode: HTMLSpanElement | null = null
        let endNode: Node | null = null
        if (start !== 0 && node.nodeValue) {
            startNode = document.createTextNode(node.nodeValue.slice(0, start))
        }
        if (node.nodeValue) {
            midNode = document.createElement('span')
            midNode.textContent = node.nodeValue.slice(start, end)
            midNode.className = `${targetClass} ${this.className}`
            midNode.dataset.method = `${targetMethod}`
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
                this.replaceTextNodes(node, startSliceOffset, endSliceOffset, ActionType.mark)
                const selection = window.getSelection()
                if (selection) {
                    selection.removeAllRanges()
                }
            })
        }
    }

    // TODO:完善功能
    private annotate = () => {
        this.successHandler('annotate')
    }

    private introTourMarkCancel = () => {
        this.successHandler('markCancel')
    }
}
