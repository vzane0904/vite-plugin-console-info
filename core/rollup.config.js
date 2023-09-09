import nodeResolve from 'rollup-plugin-node-resolve' // 帮助寻找node_modules里的包
import babel from 'rollup-plugin-babel' // rollup 的 babel 插件，ES6转ES5
import replace from 'rollup-plugin-replace' // 替换待打包文件里的一些变量，如process在浏览器端是不存在的，需要被替换
import commonjs from 'rollup-plugin-commonjs' // 将非ES6语法的包转为ES6可用
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'
import json from 'rollup-plugin-json'
import clear from 'rollup-plugin-clear';// 打包前，先清空 dist 文件夹
import polyfillNode from 'rollup-plugin-polyfill-node';
import dts from 'rollup-plugin-dts';
const env = process.env.NODE_ENV
const config = {
    input: 'src/main.ts',
    output: [
        {
            file: 'dist/umd/main.js',
            format: 'umd',// amd / es6 / iife / umd / cjs (umd同时支持 amd、cjs 和 iife)
            name: 'rollupTemplate', //当format为 iife 或 umd 时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
            sourcemap: false,  //生成bundle.map.js文件，方便调试
            // entryFileNames: '[name].umd.js',
            globals: {},// 这跟external 是配套使用的，指明global.React即是外部依赖react
            plugins: [],
            exports: 'named',
        },
        {
            file: 'dist/esm/main.js', // 打包成esmodule
            format: 'esm',
            // sourcemap: false,  //生成bundle.map.js文件，方便调试
        }
    ],
    external: ['@babel/types', '@babel/preset-typescript', '@babel/parser', '@babel/core', '@babel/generator'], // 配置rollup，不打包react,redux;将其视为外部依赖
    onwarn: (warning, warn) => {
        // 在这里不处理任何警告，实现关闭警告的效果
        // 或者直接 return，即可忽略所有警告
        return
    },
    plugins: [

        polyfillNode(),
        typescript({
            declaration: true, // 开启生成声明文件选项
            declarationDir: 'dist', // 声明文件输出目录为 dist
        }),
        nodeResolve({}),
        json(),
        babel({
            exclude: '**/node_modules/**'
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        commonjs(),
        clear({
            targets: ['dist'],
            watch: false,
        }),
    ],
    treeshake: {
        propertyReadSideEffects: false,
        moduleSideEffects: false
    },
}
export default config