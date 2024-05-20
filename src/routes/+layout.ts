// +layout.ts
// Script executed for all pages.

import type { LoadEvent } from "@sveltejs/kit";
import { applyLocale } from "./i18n/extra-locales";
import { readLocaleCookie, saveLocaleCookie } from "./i18n/locale-cookie";

export const ssr: boolean = false;
export const prerender: boolean = true;

// import "../import-fomantic"; // C: full fomantic-ui library
// import "../import-semantic"; // D: full semantic-ui + some fomantic components
// import "../import-modules"; //  E: individual components from semantic-ui and fomantic-ui

export async function load({ params }: LoadEvent): Promise<{ locale: string }> {
    void params;
    let res: string | null = null;

    const cookieLocale: string | null = readLocaleCookie();
    if (cookieLocale) {
        res = await applyLocale(cookieLocale);
        if (res !== null) {
            return { locale: res };
        }
    }

    for (const browserLocale of navigator.languages) {
        res = await applyLocale(browserLocale);
        if (res !== null) {
            saveLocaleCookie(res);
            return { locale: res };
        }
    }

    const usLocale: string = "en-US";
    res = await applyLocale(usLocale);
    if (res !== null) {
        saveLocaleCookie(res);
        return { locale: res };
    }

    throw new Error("Ensupported locale");
}
