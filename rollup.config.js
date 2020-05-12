import copy from 'rollup-plugin-copy';
import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import svelte from 'rollup-plugin-svelte';
import json from '@rollup/plugin-json';
import dsv from '@rollup/plugin-dsv';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        name: 'datavis',
        file: 'docs/bundle.js',
        format: 'iife',
        sourcemap: !production && true
    },
    plugins: [
        copy({
            targets: [{ src: ['src/index.html', 'src/global.css'], dest: 'docs/' }]
        }),
        svelte({
            dev: !production,
            css: css => {
                css.write('docs/bundle.css');
            }
        }),
        resolve(),
        json(),
        dsv(),
        !production &&
            serve({
                contentBase: 'docs/',
                port: 4000
            }),
        !production && livereload(),
        production && buble(),
        production && terser()
    ]
};
