import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import esbuild from 'rollup-plugin-esbuild'
import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import eslint from '@rollup/plugin-eslint'
import { terser } from 'rollup-plugin-terser'
import cleaner from 'rollup-plugin-cleaner'
import path from 'path'
import { fileURLToPath } from 'url'
import html from 'rollup-plugin-html'
import postcss from 'rollup-plugin-postcss'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import atImport from 'postcss-import'
import url from 'postcss-url'
import dts from 'rollup-plugin-dts'
import replace from '@rollup/plugin-replace'

const entries = ['src/index.ts']

const plugins = [
    html({
        include: '**/*.html',
        htmlMinifierOptions: {
            collapseWhitespace: false,
            collapseBooleanAttributes: false,
            conservativeCollapse: false,
            minifyJS: false,
        },
    }),
    postcss({
        plugins: [atImport(), url({ url: 'inline' })],
    }),
    eslint(),
    typescript(),
    babel({
        babelrc: false,
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
    }),
    nodeResolve({
        preferBuiltins: true,
    }),
    alias({
        entries: [
            {
                find: '@',
                replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
            },
        ],
    }),
    json(),
    commonjs(),
    esbuild(),
    replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
    }),
]

export default [
    ...entries.map((input) => ({
        input,
        output: [
            {
                file: input.replace('src/', 'dist/').replace('.ts', '.umd.js'),
                format: 'umd',
                name: 'IntroTour',
            },
            {
                file: input.replace('src/', 'dist/').replace('.ts', '.esm.js'),
                format: 'esm',
            },
            {
                file: input.replace('src/', 'dist/').replace('.ts', '.common.js'),
                format: 'cjs',
            },
        ],
        external: [],
        plugins: [...plugins, terser(), cleaner({ targets: ['./dist/'], silent: false })],
    })),
    {
        input: 'src/intro-tour.ts',
        output: [
            {
                file: 'dist/index.d.ts',
                format: 'es',
            },
        ],
        plugins: [dts()],
    },
]
