// svelte.config.js
// https://kit.svelte.dev/docs/integrations#preprocessors
// https://kit.svelte.dev/docs/adapters

/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/typedef */

import staticAdapter from "@sveltejs/adapter-static";
// eslint-disable-next-line import/no-unresolved
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // https://svelte.dev/docs#compile-time-svelte-preprocess
    preprocess: vitePreprocess(),

    kit: {
        adapter: staticAdapter(),
    },
};

export default config;
