interface InitOptions {
    className?: string;
    errorHandler?: (error: Error) => void;
    warnHandler?: (message: string) => void;
    successHandler?: (message: string) => void;
}
interface Status {
    isMark: boolean;
    isColor: boolean;
    isLight: boolean;
    isBold: boolean;
    isComment: boolean;
}

/**
 * @class
 */
declare class IntroTour {
    /**
     * @default ""
     * 自定义className
     */
    private className;
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
    /**
     * @description 当前要操作的对象元素tag（划线等操作后的页面元素tag）
     */
    private checkedElementTag;
    get checkElements(): Element[];
    get status(): Status;
    constructor(options?: InitOptions);
    private generateTooltip;
    private initTooltip;
    private initEvent;
    private setTippyContent;
    private onMouseup;
    private onMousedown;
    private showTooltip;
    private getTextNodesInRange;
    private replaceTextNodes;
    private copy;
    private freeTextNode;
    private mergeTextNode;
    private mark;
    private introTourMarkCancel;
    private comment;
}

export { IntroTour as default };
