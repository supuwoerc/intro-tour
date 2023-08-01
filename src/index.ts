import logUtil from '@/utils/log'
import tooltip from '@/template/tooltip.html'
import { domParse } from './utils'
import './styles/tooltip.scss'

interface InitOptions {
    errorHandler?: (error: Error) => void
    warnHandler?: (message: string) => void
}

export default class IntroTour {
    private tooltipOffset = [0, 16]

    private overflowOffset = [0, 0]

    private tooltipStyle = {
        width: 200,
        height: 32,
    }

    private readonly errorHandler = (error: Error) => {
        logUtil.error(error)
    }

    private readonly warnHandler = (message: string) => {
        logUtil.warn(message)
    }

    private range: Range | null = null

    private root: HTMLElement = document.createElement('div')

    constructor(options: InitOptions = {}) {
        if (window.introTour) {
            throw new Error('plugin has been initialized. Do not call it again')
        }
        const { errorHandler, warnHandler } = options
        if (errorHandler) {
            this.errorHandler = errorHandler
        }
        if (warnHandler) {
            this.warnHandler = warnHandler
        }
        this.initEvent()
        this.initTooltip()
        logUtil.log('plugin initialization is complete!')
        window.introTour = this
    }

    private initTooltip = () => {
        this.root.appendChild(domParse(tooltip))
        this.root.classList.add('intro-tour-outer-container')
        const { width, height } = this.tooltipStyle
        const [ox, oy] = this.overflowOffset
        this.root.style.setProperty('--intro-tour-width', `${width}px`)
        this.root.style.setProperty('--intro-tour-height', `${height}px`)
        this.root.style.setProperty('--intro-tour-ox', `${ox}px`)
        this.root.style.setProperty('--intro-tour-oy', `${oy}px`)
        document.body.appendChild(this.root)
    }

    private initEvent = () => {
        document.addEventListener('mousedown', this.onMousedown)
        document.addEventListener('mouseup', this.onMouseup)
        this.root.addEventListener('click', this.onMenuClick)
    }

    private onMenuClick = (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        logUtil.error(e)
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

    private onMousedown = () => {
        this.root.classList.remove('show')
    }

    private showTooltip = (range: Range) => {
        const rect = range.getBoundingClientRect()
        const { left, top, width } = rect
        const [leftOffset, topOffset] = this.tooltipOffset
        const { width: _width, height: _height } = this.tooltipStyle
        const positionLeft = left + width / 2 - _width / 2 - leftOffset
        const positionTop = top - _height - topOffset
        this.root.style.left = `${positionLeft}px`
        this.root.style.top = `${positionTop}px`
        this.root.classList.add('show')
    }
}
