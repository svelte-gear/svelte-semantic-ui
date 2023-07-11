// vite.config.js

/* eslint-disable import/no-extraneous-dependencies */

import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit()],
    // ssr: { target: "webworker" },
});
