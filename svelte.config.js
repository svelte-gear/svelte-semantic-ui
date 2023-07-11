// svelte.config.js
// https://kit.svelte.dev/docs/integrations#preprocessors
// https://kit.svelte.dev/docs/adapters

/* eslint-disable import/no-extraneous-dependencies */

import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
    },
};

export default config;
