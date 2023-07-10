interface InitOptions {
    errorHandler?: (error: Error) => void;
    warnHandler?: (message: string) => void;
}
declare class IntroTour {
    private readonly errorHandler;
    private readonly warnHandler;
    private range;
    constructor(options?: InitOptions);
    initEvent: () => Promise<void>;
    private onMouseup;
    private showTooltip;
}

export { IntroTour as default };
