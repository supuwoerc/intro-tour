/* eslint-disable no-console */
import json from '../../package.json'

export const LOG_PREFIX = `[${json.name}-${json.version}]`

export const log = (...data: any[]) => {
    console.log(LOG_PREFIX, ...data)
}

export const error = (...data: any[]) => {
    console.error(LOG_PREFIX, ...data)
}

export const warn = (...data: any[]) => {
    console.warn(LOG_PREFIX, ...data)
}

export default {
    log,
    error,
    warn,
}
