// +layout.ts
// Script executed for all pages.

import type { LoadEvent } from "@sveltejs/kit";
import { extendRules } from "../lib/data/rule-book";
import { applyLocale } from "../util/i18n/extra-locales";
import { readLocaleCookie, saveLocaleCookie } from "../util/i18n/locale-cookie";
import { loadTranslations } from "../util/translate";

export const ssr: boolean = false;
export const prerender: boolean = true;

// import "./import/import-fomantic"; // C: full fomantic-ui library
// import "./import/import-semantic"; // D: full semantic-ui + some fomantic components
// import "./import/import-modules"; //  E: individual components from semantic-ui and fomantic-ui

/** Runs before the application is displayed, saves loaded locale into the context */
export async function load({ params }: LoadEvent): Promise<{ locale: string }> {
    void params;
    let res: string | null = null;

    extendRules();

    // sveltekit-i18n - translation framework
    const initialLocale: string = "cs-CZ";
    await loadTranslations(initialLocale);

    // semantic-ui translations - read from cookie
    const cookieLocale: string | null = readLocaleCookie();
    if (cookieLocale) {
        res = await applyLocale(cookieLocale);
        if (res !== null) {
            return { locale: res };
        }
    }

    // semantic-ui translations - try browser languages
    for (const browserLocale of navigator.languages) {
        res = await applyLocale(browserLocale);
        if (res !== null) {
            saveLocaleCookie(res);
            return { locale: res };
        }
    }

    // default = "en" (no locale changes)
    return { locale: "en" };

    // const usLocale: string = "en-US";
    // res = await applyLocale(usLocale);
    // if (res !== null) {
    //     saveLocaleCookie(res);
    //     return { locale: res };
    // }

    // throw new Error("Unsupported locale");
}
