interface InitOptions {
    errorHandler?: (error: Error) => void;
    warnHandler?: (message: string) => void;
    successHandler?: (message: string) => void;
}
declare class IntroTour {
    private tippyInstance;
    private customEvents;
    private readonly errorHandler;
    private readonly warnHandler;
    private readonly successHandler;
    private range;
    private root;
    private tools;
    constructor(options?: InitOptions);
    private initTooltip;
    private initEvent;
    private onMouseup;
    private onMousedown;
    private showTooltip;
    private copy;
}

export { IntroTour as default };
