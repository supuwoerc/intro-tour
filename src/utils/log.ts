/* eslint-disable no-console */

const prefix = `[intro-tour]`

export const log = (...data: any[]) => {
    console.log(prefix, ...data)
}

export const error = (...data: any[]) => {
    console.error(prefix, ...data)
}

export const warn = (...data: any[]) => {
    console.warn(prefix, ...data)
}

export default {
    log,
    error,
    warn,
}
