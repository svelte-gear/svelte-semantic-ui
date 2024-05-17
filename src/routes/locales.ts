// locale.ts

export function supportedLocales(): string[] {
    return ["de-DE", "en-CA", "en-GB", "en-US", "fr-CA", "fr-FR", "es-ES", "es-MX", "es-US"];
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
    else if (locale === "de-DE") { i18n = import("../lib/i18n/de-DE"); }
    else if (locale === "en-CA") { i18n = import("../lib/i18n/en-CA"); }
    else if (locale === "en-GB") { i18n = import("../lib/i18n/en-GB"); }
    else if (locale === "en-US") { i18n = import("../lib/i18n/en-US"); }
    else if (locale === "fr-CA") { i18n = import("../lib/i18n/fr-CA"); }
    else if (locale === "fr-FR") { i18n = import("../lib/i18n/fr-FR"); }
    else if (locale === "es-ES") { i18n = import("../lib/i18n/es-ES"); }
    else if (locale === "es-MX") { i18n = import("../lib/i18n/es-MX"); }
    else if (locale === "es-US") { i18n = import("../lib/i18n/es-US"); }
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
