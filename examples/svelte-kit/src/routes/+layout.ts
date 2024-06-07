// +layout.ts
// Script executed for all pages.

import type { LoadEvent } from "@sveltejs/kit";
import { extendRules, applyDefaultSettings } from "../lib/data/rule-book";

import { applyLocale, supportedLocales } from "../util/sui-i18n";
import { browserMatch, cookieMatch, saveLocaleCookie } from "../util/locale";
import { locales, loadTranslations } from "../util/sveltekit-i18n";

export const ssr: boolean = false;
export const prerender: boolean = true;

// import "./import/import-fomantic"; // C: full fomantic-ui library
// import "./import/import-semantic"; // D: full semantic-ui + some fomantic components
// import "./import/import-modules";  // E: individual components from semantic-ui and fomantic-ui

async function translate(locale: string): Promise<void> {
    console.log(`Applying ${locale} locale to semantic-ui`);
    // const res: string | null = await applyLocale(locale);
    // if (!res) {
    //     return;
    // }

    const lang: string = locale.split("-")[0];
    if (locales.get().includes(lang)) {
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

    const cookieLocale: string | null = cookieMatch(supportedLocales());
    if (cookieLocale) {
        res = await applyLocale(cookieLocale);
        await translate(cookieLocale);
        return { locale: res! };
    }

    const browserLocale: string | null = browserMatch(supportedLocales());
    if (browserLocale) {
        res = await applyLocale(browserLocale);
        saveLocaleCookie(res!);
        await translate(browserLocale);
        return { locale: res! };
    }

    res = await applyLocale("en");
    await translate("en");
    return { locale: res! };
}
