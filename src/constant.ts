export interface InitOptions {
    className?: string
    errorHandler?: (error: Error) => void
    warnHandler?: (message: string) => void
    successHandler?: (message: string) => void
}

export enum ActionType {
    annotate = 'annotate',
    mark = 'mark',
    light = 'light',
    color = 'color',
    bold = 'bold',
    copy = 'copy',
    introTourMarkCancel = 'introTourMarkCancel',
}

export enum ReplaceNodeClass {
    mark = 'intro-tour-mark-text',
    light = 'intro-tour-light-text',
    color = 'intro-tour-color-text',
    bold = 'intro-tour-bold-text',
}

export enum ReplaceNodeMethod {
    mark = 'introTourMarkCancel',
    light = 'introTourLightCancel',
    color = 'introTourColorCancel',
    bold = 'introTourBoldCancel',
}

export enum ReplaceNodeTag {
    mark = 'mid',
    light = 'lid',
    color = 'cid',
    bold = 'bid',
    comment = 'cmid',
}

export enum ReplaceNodeTagPrefix {
    mark = '_intro_tour_mark_',
    light = '_intro_tour_light_',
    color = '_intro_tour_color_',
    bold = '_intro_tour_bold_',
}

export interface Status {
    isMark: boolean
    isColor: boolean
    isLight: boolean
    isBold: boolean
    isComment: boolean
}
