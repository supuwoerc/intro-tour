/**
 * 产生uuid
 * @returns uuid
 */
export declare function uuid(): `${string}-${string}-${string}-${string}-${string}`;
/**
 * 将字符串模板转为dom
 * @param templates 字符串模板
 * @returns DocumentFragment
 */
export declare function domParse(...templates: string[]): DocumentFragment;
