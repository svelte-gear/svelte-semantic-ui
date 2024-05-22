/**
 * Dynamically import translations and formats based on locale.
 * See routes/i18n/extra-locales.ts for an example how to extend it.
 * @module  i18n/base-locales.ts
 */

/** Returns list of supported locales. */
export function supportedLocales(): string[] {
    return [
        "de-DE",
        "el-GR",
        "en-CA",
        "en-GB",
        "en-US",
        "fr-CA",
        "fr-FR",
        "es-ES",
        "es-MX",
        "es-US",
        "it-IT",
        "pl-PL",
        "ru-RU",
        "uk-UA",
    ];
}

/** Imports locale settings: validation messages, calendar, date and number formats.
    Returns applied local string or null if locale is not found */
export async function applyLocale(locale: string): Promise<string | null> {
    let i18n: Promise<unknown> | null = null;

    /* eslint-disable @typescript-eslint/brace-style */
    /* prettier-ignore */
    if (!locale) {
        console.info("missing locale");
        return null;
    }
    else if (locale === "de-DE") { i18n = import("./de-DE"); }
    else if (locale === "el-GR") { i18n = import("./el-GR"); }
    else if (locale === "en-CA") { i18n = import("./en-CA"); }
    else if (locale === "en-GB") { i18n = import("./en-GB"); }
    else if (locale === "en-US") { i18n = import("./en-US"); }
    else if (locale === "fr-CA") { i18n = import("./fr-CA"); }
    else if (locale === "fr-FR") { i18n = import("./fr-FR"); }
    else if (locale === "es-ES") { i18n = import("./es-ES"); }
    else if (locale === "es-MX") { i18n = import("./es-MX"); }
    else if (locale === "es-US") { i18n = import("./es-US"); }
    else if (locale === "it-IT") { i18n = import("./it-IT"); }
    else if (locale === "pl-PL") { i18n = import("./pl-PL"); }
    else if (locale === "ru-RU") { i18n = import("./ru-RU"); }
    else if (locale === "uk-UA") { i18n = import("./uk-UA"); }
    else {
        console.info(`Unrecognized locale: ${locale}`);
        return null;
    }
    /* eslint-enable @typescript-eslint/brace-style */

    if (i18n === null) {
        return null;
    }
    await i18n;
    return locale;
}
