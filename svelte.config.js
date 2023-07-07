/* eslint-disable import/no-extraneous-dependencies */

import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // consult https://kit.svelte.dev/docs/integrations#preprocessors for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // see https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter(),
    },
};

export default config;
