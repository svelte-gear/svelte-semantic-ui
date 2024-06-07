/**
 * Dynamically import translations and formats based on locale.
 * See routes/i18n/extra-locales.ts for an example how to extend it.
 * @module  i18n/base-locales.ts
 */

import type { AllSettingsJson } from "../data/common";
import { applyAllSettings } from "../data/common";

/** Returns list of supported locales. */
export function supportedLocales1(): string[] {
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

/** Imports locale settings: validation messages, calendar, date and number formats.
    Returns applied local string or null if locale is not found */
export async function applyLocale1(locale: string): Promise<string | null> {
    // check locale and language
    if (!locale) {
        console.info("Missing locale");
        return null;
    }
    const lang: string = locale.split("-")[0];

    // translate semantic ui components
    let langProm: Promise<unknown> | null = null;
    /* eslint-disable @typescript-eslint/brace-style */
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
        console.debug(`svt-sui-lib: base-locales: no translation for language '${lang}' (${locale})`);
        return null;
    }
    /* eslint-enable */
    if (langProm !== null) {
        await readAndApply(langProm);
    }
    if (locale === lang) {
        return lang;
    }

    // apply country formats
    let locProm: Promise<unknown> | null = null;
    /* eslint-disable @typescript-eslint/brace-style */
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
        console.debug(`svt-sui-lib: base-locales: no config for locale '${locale}'`);
        return lang;
    }
    /* eslint-enable */
    if (locProm !== null) {
        await readAndApply(locProm);
    }
    return locale;
}

type LocaleLoadFn = () => Promise<object>;
type Register = {
    [key: string]: LocaleLoadFn;
};

const languages: string[] = [];
const locales: string[] = [];
const languageRegister: Register = {};
const localeRegister: Register = {};
let currLocale: string = "en";

export function registerLanguage(language: string, fn: LocaleLoadFn): void {
    if (!languages.includes(language)) {
        languages.push(language);
    }
    languageRegister[language] = fn;
}

export function registerLocale(locale: string, fn: LocaleLoadFn): void {
    if (!locales.includes(locale)) {
        locales.push(locale);
    }
    localeRegister[locale] = fn;
}

export function supportedLlanguages(): string[] {
    return languages;
}

export function supportedLocales(): string[] {
    return locales;
}

/** Imports locale settings: validation messages, calendar, date and number formats.
    Returns applied local string or null if locale is not found */
export async function applyLocale(locale: string): Promise<string | null> {
    if (!locale) {
        console.debug("Missing locale");
        return null;
    }
    const lang: string = locale.split("-")[0];

    // translate semantic ui components
    const langFn: LocaleLoadFn = languageRegister[lang];
    if (!langFn) {
        console.debug(`No language translation for ${lang}`);
        return null;
    }
    const langProm: Promise<object> = langFn();
    console.debug(`Applying ${lang} language`);
    await readAndApply(langProm);

    if (locale === lang) {
        currLocale = lang;
        return currLocale;
    }

    // apply country formats
    const localeFn: LocaleLoadFn = localeRegister[locale];
    if (!localeFn) {
        console.debug(`No locale settings for ${locale}`);
        currLocale = lang;
        return currLocale;
    }
    const localeProm: Promise<object> = localeFn();
    console.debug(`Applying ${locale} locale`);
    await readAndApply(localeProm);

    currLocale = locale;
    return currLocale;
}

function noop(): Promise<object> {
    return Promise.resolve({});
}

export function registerBaseLocales(): void {
    registerLanguage("de", () => import("./de"));
    registerLanguage("en", () => import("./en"));
    registerLanguage("es", () => import("./es"));
    registerLanguage("fr", () => import("./fr"));
    registerLanguage("it", () => import("./it"));
    registerLanguage("pl", () => import("./pl"));
    registerLanguage("ru", () => import("./ru"));
    registerLanguage("uk", () => import("./uk"));

    registerLocale("de-DE", () => noop());
    registerLocale("el-GR", () => noop());
    registerLocale("en-CA", () => import("./en-CA"));
    registerLocale("en-GB", () => import("./en-GB"));
    registerLocale("en-US", () => import("./en-US"));
    registerLocale("es-ES", () => import("./es-ES"));
    registerLocale("es-MX", () => import("./es-MX"));
    registerLocale("es-US", () => import("./es-US"));
    registerLocale("fr-FR", () => import("./fr-FR"));
    registerLocale("fr-CA", () => import("./fr-CA"));
    registerLocale("it-IT", () => noop());
    registerLocale("pl-PL", () => noop());
    registerLocale("ru-RU", () => noop());
    registerLocale("uk-UA", () => noop());
}
