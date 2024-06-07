// +layout.ts
// Script executed for all pages.

// import type { LoadEvent } from "@sveltejs/kit";
import { extendRules, applyDefaultSettings } from "../lib/data/rule-book";

import { applyLocale, registerBaseLocales, registerLocale, supportedLocales } from "../lib/i18n";
import { browserMatch, cookieMatch, saveLocaleCookie } from "../locale-info";

export const ssr: boolean = false;
export const prerender: boolean = true;

/** Runs before the application is displayed, saves loaded locale into the context */
export async function load(): Promise<void> {
    extendRules();
    applyDefaultSettings();
    registerBaseLocales();

    // expose "international" locales
    registerLocale("en", () => Promise.resolve({}));
    registerLocale("es", () => Promise.resolve({}));
    registerLocale("fr", () => Promise.resolve({}));

    const cookieLocale: string | null = cookieMatch(supportedLocales());
    if (cookieLocale) {
        await applyLocale(cookieLocale);
        return;
    }

    const browserLocale: string | null = browserMatch(supportedLocales());
    if (browserLocale) {
        const res: string | null = await applyLocale(browserLocale);
        saveLocaleCookie(res!);
        return;
    }

    await applyLocale("en");
}
