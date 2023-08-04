interface InitOptions {
    errorHandler?: (error: Error) => void;
    warnHandler?: (message: string) => void;
    successHandler?: (message: string) => void;
}
/**
 * @class
 */
declare class IntroTour {
    /**
     * @default null
     * 气泡实例
     */
    private tippyInstance;
    /**
     * @readonly
     * @description 按钮注册的方法
     */
    private readonly customEvents;
    /**
     * 发生错误时的回调方法
     * @param error 错误
     */
    private readonly errorHandler;
    /**
     * 发生警告时的回调方法
     * @param message 警告消息
     */
    private readonly warnHandler;
    /**
     * 操作成功时的回调方法
     * @param message 成功消息
     */
    private readonly successHandler;
    /**
     * @description 选中的range
     */
    private range;
    /**
     * @description 气泡依赖的元素
     */
    private root;
    /**
     * @description 气泡内容依赖的元素
     */
    private tools;
    constructor(options?: InitOptions);
    private initTooltip;
    private initEvent;
    private onMouseup;
    private onMousedown;
    private showTooltip;
    private copy;
    private mark;
    private annotate;
}

export { InitOptions, IntroTour as default };
