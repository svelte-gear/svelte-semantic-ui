// +layout.ts
// Script executed for all pages.

// import type { LoadEvent } from "@sveltejs/kit";

import { initializeFramework, setComponentInitMode } from "../lib";
import { applyLocale } from "../lib/i18n";

// single-page client-side app
export const ssr: boolean = false;
export const prerender: boolean = true;

/** Runs before the application is displayed, saves loaded locale into the context */
export async function load(): Promise<void> {
    await initializeFramework();
    setComponentInitMode(["parent", "child", "sibling"]);
    await applyLocale("en-CA");
}
