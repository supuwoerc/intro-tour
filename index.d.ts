interface InitOptions {
    errorHandler?: (error: Error) => void;
}
declare class IntroTour {
    readonly errorHandler: (error: Error) => void;
    constructor(options?: InitOptions);
}

export { IntroTour as default };
