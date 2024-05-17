// svelte.config.js
// https://kit.svelte.dev/docs/integrations#preprocessors
// https://kit.svelte.dev/docs/adapters

/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/typedef */

import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // https://svelte.dev/docs#compile-time-svelte-preprocess
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
    },
};

export default config;
