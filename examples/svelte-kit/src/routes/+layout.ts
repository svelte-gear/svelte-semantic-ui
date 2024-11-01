// +layout.ts
// Script executed for all pages.

import type { LoadEvent } from "@sveltejs/kit";
import {
    applyLocale,
    supportedLocales,
    initializeFramework,
} from "@svelte-gear/svelte-semantic-ui";

import { browserMatch, cookieMatch, saveLocaleCookie } from "../locale-info";
import { locales, loadTranslations } from "../sveltekit-i18n";
import { registerExtraLocales } from "../extra-locales";

export const ssr: boolean = false;
export const prerender: boolean = true;

// import "./import/import-fomantic"; // C: full fomantic-ui library
// import "./import/import-semantic"; // D: full semantic-ui + some fomantic components
// import "./import/import-modules";  // E: individual components from semantic-ui and fomantic-ui

/** Translate sveltekit-i18n messages, if it supports the locale, otherwise use English. */
async function translate(locale: string): Promise<void> {
    console.log(`Applying ${locale} locale to semantic-ui`);

    const lang: string = locale.split("-")[0];
    if (locales.get().includes(lang)) {
        console.log(`Loading ${lang} translations`);
        await loadTranslations(lang);
    } else {
        console.log("Loading default translations");
        await loadTranslations("en");
    }
}

type LocaleObj = {
    locale: string;
};

/** Runs before the application is displayed, saves loaded locale into the context */
export async function load({ params }: LoadEvent): Promise<LocaleObj> {
    void params;
    let res: string | null = null;

    await initializeFramework();
    // You can add more locales without to you project
    registerExtraLocales();

    // console.log("supportedLocales()", supportedLocales());

    // Read cookie, check if the locale is supported by the framework
    const cookieLocale: string | null = cookieMatch(supportedLocales());
    if (cookieLocale) {
        res = await applyLocale(cookieLocale);
        await translate(cookieLocale);
        return { locale: res! };
    }

    // Find the overlap between browser languages and supported locales
    const browserLocale: string | null = browserMatch(supportedLocales());
    if (browserLocale) {
        res = await applyLocale(browserLocale);
        saveLocaleCookie(res!);
        await translate(browserLocale);
        return { locale: res! };
    }

    // default to international English
    res = await applyLocale("en");
    await translate("en");
    return { locale: res! };
}
