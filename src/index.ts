import logUtil from '@/utils/log'
import tooltip from '@/template/tooltip.html'
import { domParse } from './utils'

interface InitOptions {
    errorHandler?: (error: Error) => void
    warnHandler?: (message: string) => void
}

export default class IntroTour {
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
        window.introTour = this
        logUtil.log('plugin initialization is complete!')
    }

    private initTooltip = () => {
        logUtil.log(tooltip)
        this.root.appendChild(domParse(tooltip))
        this.root.className = 'intro-tour-outer-container'
        document.body.appendChild(this.root)
    }

    private initEvent = () => {
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

    private showTooltip = (range: Range) => {
        const rect = range.getBoundingClientRect()
        logUtil.log(rect)
    }
}
