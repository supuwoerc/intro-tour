import './styles/tooltip.scss';
interface InitOptions {
    errorHandler?: (error: Error) => void;
    warnHandler?: (message: string) => void;
}
export default class IntroTour {
    private readonly errorHandler;
    private readonly warnHandler;
    private range;
    private root;
    constructor(options?: InitOptions);
    private initTooltip;
    private initEvent;
    private onMenuClick;
    private onMouseup;
    private onMousedown;
    private showTooltip;
}
export {};
