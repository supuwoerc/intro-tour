import tippy, { Instance } from 'tippy.js'
import logUtil from '@/utils/log'
import tooltip from '@/template/tooltip.html'
import { domParse } from './utils'
import './styles/tooltip.scss'
import 'tippy.js/dist/tippy.css'

interface InitOptions {
    errorHandler?: (error: Error) => void
    warnHandler?: (message: string) => void
}

export default class IntroTour {
    private tippyInstance: Instance | null = null

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
        this.root.classList.add('intro-tour-outer-container')
        document.body.appendChild(this.root)
        this.tippyInstance = tippy(this.root, {
            content: domParse(tooltip),
            arrow: true,
            placement: 'top',
            interactive: true,
        })
        this.tippyInstance.hide()
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

    private onMousedown = () => {
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
}
