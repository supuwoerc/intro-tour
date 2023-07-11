interface InitOptions {
    errorHandler?: (error: Error) => void;
    warnHandler?: (message: string) => void;
}
declare class IntroTour {
    private readonly errorHandler;
    private readonly warnHandler;
    private range;
    private root;
    constructor(options?: InitOptions);
    private initTooltip;
    private initEvent;
    private onMouseup;
    private showTooltip;
}

export { IntroTour as default };
