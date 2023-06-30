// rollup.config.mjs
// https://github.com/rollup/awesome

/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import terser from "@rollup/plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import { visualizer } from "rollup-plugin-visualizer";
import sizes from "rollup-plugin-sizes";
import { spawn } from "node:child_process";

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = spawn("npm", ["run", "start", "--", "--dev"], {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true,
            });

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        },
    };
}

export default {
    input: "src/main.ts",
    output: {
        sourcemap: !production, // change sourcemap parameter based on environment
        format: "iife",
        name: "app",
        file: "public/build/bundle.js",
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess({
                sourceMap: !production, // duplicate sourcemap parameter for the preprocess
            }),
            compilerOptions: {
                dev: !production, // enable run-time checks when not in production
            },
        }),
        css({ output: "bundle.css" }), // extract any component CSS out into a separate file - for performance

        // to resolve external dependencies installed from npm
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),

        !production && serve(), // in dev mode, call `npm run start` once the bundle has been generated

        !production && livereload("public"), // watch the `public` directory and refresh the browser on changes

        production && sizes(), // output package sizes
        production &&
            visualizer({
                template: "network",
                filename: "stats-net.html",
                title: "network",
            }),
        production &&
            visualizer({ template: "treemap", filename: "stats-tree.html", title: "treemap" }),
        production &&
            visualizer({ template: "sunburst", filename: "stats-pie.html", title: "piechart" }),

        production && terser(), // when building for production, minify
    ],
    watch: {
        clearScreen: false,
    },
};
