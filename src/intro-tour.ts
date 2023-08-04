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
    }

    private copy = () => {
        document.execCommand('copy')
        this.successHandler('copy')
    }

    // TODO:完善功能
    private mark = () => {
        this.successHandler('mark')
    }

    // TODO:完善功能
    private annotate = () => {
        this.successHandler('annotate')
    }
}
