import './styles/tooltip.scss';
import 'tippy.js/dist/tippy.css';
interface InitOptions {
    errorHandler?: (error: Error) => void;
    warnHandler?: (message: string) => void;
}
export default class IntroTour {
    private tippyInstance;
    private readonly errorHandler;
    private readonly warnHandler;
    private range;
    private root;
    constructor(options?: InitOptions);
    private initTooltip;
    private initEvent;
    private onMouseup;
    private onMousedown;
    private showTooltip;
}
export {};
