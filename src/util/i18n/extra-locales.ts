// i18n/extra-locales
// Additional translations and formats.

import {
    supportedLocales as baseSupportedLocales,
    applyLocale as baseApplyLocale,
    readAndApply,
} from "../../lib/i18n/base-locales";

/** Returns full list od supported locales: default and added by the application. */
export function supportedLocales(): string[] {
    return [...baseSupportedLocales(), "be-BY", "fi-FI", "en-AU", "ja-JP"];
}

/* eslint-disable @typescript-eslint/brace-style */

/** Imports locale settings added in the app, if not in list - uses default.
    Returns applied locale string or null if locale is not found */
export async function applyLocale(locale: string): Promise<string | null> {
    // check locale and language
    if (!locale) {
        console.info("missing locale");
        return null;
    }
    const lang: string = locale.split("-")[0];

    // add two new locales
    let langProm: Promise<unknown> | null = null;
    /* prettier-ignore */
    if /**/ (lang === "be") { langProm = import("./be"); }
    else if (lang === "fi") { langProm = import("./fi"); }
    else if (lang === "ja") { langProm = import("./ja"); }

    if (langProm !== null) {
        await readAndApply(langProm);

        // let locProm: Promise<unknown> | null = null;
        /* prettier-ignore */
        if /**/ (locale === "be-BY") { return locale; }
        else if (locale === "fi-FI") { return locale; }
        else if (locale === "ja-JP") { return locale; }
        else {
            console.info(`Unrecognized country: ${locale}`);
            return lang;
        }
        // if (locProm !== null) {
        //     const locJson: SettingImport = (await locProm) as SettingImport;
        //     applyAllSettings(locJson.default);
        // }
    }

    // Update existing GB locale
    if (locale === "en-GB") {
        await baseApplyLocale("en-GB");
        await readAndApply(import("./en-GB-ext"));
        return locale;
    }
    // Add new en locale for Australia
    else if (locale === "en-AU") {
        await baseApplyLocale("en");
        await readAndApply(import("./en-AU"));
        return locale;
    }
    // default library locales
    else {
        return baseApplyLocale(locale);
    }
}
/* eslint-enable */
