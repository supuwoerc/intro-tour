import logUtil from '@/utils/log'

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

    constructor(options: InitOptions = {}) {
        const { errorHandler, warnHandler } = options
        if (errorHandler) {
            this.errorHandler = errorHandler
        }
        if (warnHandler) {
            this.warnHandler = warnHandler
        }
        this.initEvent().then(() => {
            logUtil.log('plugin initialization is complete!')
        })
    }

    initEvent = (): Promise<void> => {
        return new Promise((resolve) => {
            document.addEventListener('mouseup', this.onMouseup)
            resolve()
        })
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
