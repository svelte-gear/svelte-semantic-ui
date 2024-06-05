// +layout.ts
// Script executed for all pages.

import type { LoadEvent } from "@sveltejs/kit";

import { extendRules, applyDefaultSettings } from "../lib/data/rule-book";

import { applyLocale, supportedLocales } from "../util/i18n/extra-locales";
import { readLocaleCookie, saveLocaleCookie } from "../util/i18n/locale-cookie";
import { supportedLocales as translationLocales, loadTranslations } from "../util/sveltekit-i18n";

export const ssr: boolean = false;
export const prerender: boolean = true;

// import "./import/import-fomantic"; // C: full fomantic-ui library
// import "./import/import-semantic"; // D: full semantic-ui + some fomantic components
// import "./import/import-modules";  // E: individual components from semantic-ui and fomantic-ui

async function translate(locale: string): Promise<void> {
    console.log(`Applying ${locale} locale to semantic-ui`);
    await applyLocale(locale);
    const lang: string = locale.split("-")[0];
    if (translationLocales.get().includes(lang)) {
        console.log(`Loading ${lang} translations`);
        await loadTranslations(lang);
    } else {
        console.log("Loading default translations");
        await loadTranslations("en");
    }
}

/** Runs before the application is displayed, saves loaded locale into the context */
export async function load({ params }: LoadEvent): Promise<{ locale: string }> {
    void params;
    let res: string | null = null;

    extendRules();
    applyDefaultSettings();

    // semantic-ui translations - read from cookie
    const cookieLocale: string | null = readLocaleCookie();
    if (cookieLocale) {
        res = await applyLocale(cookieLocale);
        if (res !== null) {
            await translate(cookieLocale);
            return { locale: res };
        }
    }

    // semantic-ui translations - try browser languages
    for (const browserLocale of navigator.languages) {
        // first, look for exact match
        if (supportedLocales().includes(browserLocale)) {
            res = await applyLocale(browserLocale);
            if (res !== null) {
                saveLocaleCookie(res);
                await translate(browserLocale);
                return { locale: res };
            }
        }
    }
    // then allow partial matching by language
    for (const browserLocale of navigator.languages) {
        res = await applyLocale(browserLocale);
        if (res !== null) {
            saveLocaleCookie(res);
            await translate(browserLocale);
            return { locale: res };
        }
    }

    // default = "en" (no locale changes)
    await translate("en");
    return { locale: "default" };
}
