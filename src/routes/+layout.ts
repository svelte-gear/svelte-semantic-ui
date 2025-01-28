// +layout.ts
// Script executed for all pages.

// import type { LoadEvent } from "@sveltejs/kit";

import { initializeFramework, setComponentInitMode, compLog, formLog, initLog } from "../lib";
import { applyLocale } from "../lib/i18n";

// single-page client-side app
export const ssr: boolean = false;
export const prerender: boolean = true;

/** Runs before the application is displayed, saves loaded locale into the context */
export async function load(): Promise<void> {
    initLog.build("debug");
    formLog.build("debug");
    compLog.build("debug");
    await initializeFramework();
    setComponentInitMode(["parent", "child", "sibling"]); // allow all possible locations (for testing)
    await applyLocale("en-CA");
}
