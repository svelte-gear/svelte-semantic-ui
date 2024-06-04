// vite.config.js

/* eslint-disable import/no-extraneous-dependencies */

import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
// import inject from "@rollup/plugin-inject";

export default defineConfig({
    plugins: [
        sveltekit(),
        // inject({
        //     $: "jquery",
        //     jQuery: "jquery",
        // }),
    ],
    // build: {
    //     sourcemap: true,
    // },
    // ssr: { target: "webworker" },
});
