import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const srcFile = path.resolve(__dirname, '../demo/index.html') // 源文件
const targetDir = path.resolve(__dirname, '../docs') // 目标目录

fs.copyFile(srcFile, path.join(targetDir, 'demo.html'), (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log(`Copied custom.html to ${targetDir}`)
})
