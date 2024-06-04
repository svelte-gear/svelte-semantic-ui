/**
 * Dynamically import translations and formats based on locale.
 * See routes/i18n/extra-locales.ts for an example how to extend it.
 * @module  i18n/base-locales.ts
 */

import type { AllSettingsJson } from "../data/common";
import { applyAllSettings } from "../data/common";
import { formDefaults } from "../data/use-form-validation";
import { calendarDefaults } from "../components/use-calendar";

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

/** Takes module import promise, reads json, applies settings. */
export async function readAndApply(prom: Promise<unknown>): Promise<void> {
    type SettingImport = {
        default: AllSettingsJson;
    };
    const langJson: SettingImport = (await prom) as SettingImport;
    applyAllSettings(langJson.default);
}

/* eslint-disable @typescript-eslint/brace-style */

/** Imports locale settings: validation messages, calendar, date and number formats.
    Returns applied local string or null if locale is not found */
export async function applyLocale(locale: string): Promise<string | null> {
    // change some defaults
    calendarDefaults.apply({
        type: "date",
        touchReadonly: false,
        minTimeGap: 5,
    });
    formDefaults.apply({
        keyboardShortcuts: false,
    });
    // return "en";

    // check locale and language
    if (!locale) {
        console.info("Missing locale");
        return null;
    }
    const lang: string = locale.split("-")[0];

    // translate semantic ui components
    let langProm: Promise<unknown> | null = null;
    /* prettier-ignore */
    if /**/ (lang === "de") { langProm = import("./de"); }
    else if (lang === "el") { langProm = import("./el"); }
    else if (lang === "en") { langProm = import("./en"); }
    else if (lang === "fr") { langProm = import("./fr"); }
    else if (lang === "es") { langProm = import("./es"); }
    else if (lang === "it") { langProm = import("./it"); }
    else if (lang === "pl") { langProm = import("./pl"); }
    else if (lang === "ru") { langProm = import("./ru"); }
    else if (lang === "uk") { langProm = import("./uk"); }
    else {
        console.info(`Unrecognized language: ${locale}`);
        return null;
    }

    if (langProm !== null) {
        await readAndApply(langProm);
    }
    if (locale === lang) {
        return lang;
    }

    // apply country formats
    let locProm: Promise<unknown> | null = null;
    /* prettier-ignore */
    if /**/ (locale === "de-DE") { locProm = null;  /* == de */ }
    else if (locale === "el-GR") { locProm = null;  /* == el */ }
    else if (locale === "en-CA") { locProm = import("./en-CA"); }
    else if (locale === "en-GB") { locProm = import("./en-GB"); }
    else if (locale === "en-US") { locProm = import("./en-US"); }
    else if (locale === "fr-CA") { locProm = import("./fr-CA"); }
    else if (locale === "fr-FR") { locProm = null;  /* == fr */ }
    else if (locale === "es-ES") { locProm = null;  /* == es */ }
    else if (locale === "es-MX") { locProm = import("./es-MX"); }
    else if (locale === "es-US") { locProm = import("./es-US"); }
    else if (locale === "it-IT") { locProm = null;  /* == it */ }
    else if (locale === "pl-PL") { locProm = null;  /* == pl */ }
    else if (locale === "ru-RU") { locProm = null;  /* == ru */ }
    else if (locale === "uk-UA") { locProm = null;  /* == uk */ }
    else {
        console.info(`Unrecognized country: ${locale}`);
        return lang;
    }

    if (locProm !== null) {
        await readAndApply(locProm);
    }
    return locale;
}
/* eslint-enable */
