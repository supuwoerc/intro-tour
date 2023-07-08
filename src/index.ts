import logUtil from '@/utils/log'

interface InitOptions {
    errorHandler?: (error: Error) => void
}

export default class IntroTour {
    readonly errorHandler = (error: Error) => {
        logUtil.error(error)
    }

    constructor(options: InitOptions = {}) {
        const { errorHandler } = options
        if (errorHandler) {
            this.errorHandler = errorHandler
        }
        logUtil.log('plugin initialization is complete')
    }
}
