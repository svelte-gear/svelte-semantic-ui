/**
 * Internationalization module.
 * Dynamically import translations and formats based on locale.
 * See routes/i18n/extra-locales.ts for an example how to extend it.
 *
```text
locale      money           date time   week
--------------------------------------------
de-DE   €1.000,00     01.03.2024 14:50     1
en-CA   $1 000.00     2024-03-01 14:50     0
en-GB   £1,000.00     01/03/2024 14:50     1
en-US   $1,000.00       3/1/2024 2:50 PM   0
es-ES    1.234,56 €    1-03-2024 14.50     1
es-MX   $1,000.00      1/03/2024 14:50     0
es-US   $1,000.00       3/1/2024 2:50 PM   0
fr-CA    1 000,00 $   2024-03-01 14:50     1
fr-FR    1 000,00 €   01/03/2024 14:50     1
```
 *
 * Sources:
 * - https://docs.oracle.com/cd/E19455-01/806-0169/overview-9/index.html
 * - https://en.wikipedia.org/wiki/List_of_date_formats_by_country
 * - https://gist.github.com/mlconnor/1887156
 * - https://en.wikipedia.org/wiki/Decimal_separator
 * - https://leap.hcldoc.com/help/topic/SSS28S_8.2.1/XFDL_Specification/i_xfdl_r_formats_en_CA.html
 * @module i18n/_index
 */

import type { AllSettingsJson } from "../data/settings";
import { initLog } from "../data/common";
import { applyAllSettings } from "../data/settings";

type Register = Record<string, () => Promise<object>>;

//-------------------------------------------------------------------------------------------------
// region lang

const languages: string[] = [];
const languageRegister: Register = {};

/** Register translation loading function. */
export function registerLanguage(language: string, fn: () => Promise<object>): void {
    if (!languages.includes(language)) {
        languages.push(language);
    }
    languageRegister[language] = fn;
}

/** Returns list of supported languages. */
export function supportedLanguages(): string[] {
    return languages;
}

//-------------------------------------------------------------------------------------------------
// region locale

const locales: string[] = [];
const localeRegister: Register = {};

/** Register locale loading function. */
export function registerLocale(locale: string, fn: () => Promise<object>): void {
    if (!locales.includes(locale)) {
        locales.push(locale);
    }
    localeRegister[locale] = fn;
}

/** Returns list of supported locales. */
export function supportedLocales(): string[] {
    return locales;
}

//-------------------------------------------------------------------------------------------------
// region apply

let currLocale: string = "en";

/** Takes module import promise, reads json, applies settings. */
async function readAndApply(prom: Promise<unknown>): Promise<void> {
    type SettingImport = {
        default: AllSettingsJson;
    };
    const langJson: SettingImport = (await prom) as SettingImport;
    applyAllSettings(langJson.default);
}

/** Return currently set locale. */
export function getLocale(): string {
    return currLocale;
}

/** Imports locale settings: validation messages, calendar, date and number formats.
    Returns applied local string or null if locale is not found */
export async function applyLocale(locale: string): Promise<string | null> {
    if (!locale) {
        initLog.warn("Missing locale");
        return null;
    }
    const lang: string = locale.split("-")[0];

    // translate semantic ui components
    const langFn: () => Promise<object> = languageRegister[lang];
    if (!langFn) {
        initLog.warn(`No language translation for ${lang}`);
        return null;
    }
    const langProm: Promise<object> = langFn();
    initLog.log(`Applying ${lang} language`);
    await readAndApply(langProm);

    if (locale === lang) {
        currLocale = lang;
        return currLocale;
    }

    // apply country formats
    const localeFn: () => Promise<object> = localeRegister[locale];
    if (!localeFn) {
        initLog.warn(`No locale settings for ${locale}`);
        currLocale = lang;
        return currLocale;
    }
    const localeProm: Promise<object> = localeFn();
    initLog.log(`Applying ${locale} locale`);
    await readAndApply(localeProm);

    currLocale = locale;
    return currLocale;
}

//-------------------------------------------------------------------------------------------------
// region initialize

async function noop(): Promise<object> {
    return {};
}

/** Register known locales.
 * Only required translations and settings are dynamically loaded into memory
 * when {@link i18n/_index.applyLocale} is called.
 * */
export function registerBaseLocales(): void {
    registerLanguage("de", () => import("./de"));
    registerLanguage("el", () => import("./el"));
    registerLanguage("en", () => import("./en"));
    registerLanguage("es", () => import("./es"));
    registerLanguage("fr", () => import("./fr"));
    registerLanguage("it", () => import("./it"));
    registerLanguage("pl", () => import("./pl"));
    registerLanguage("ru", () => import("./ru"));
    registerLanguage("uk", () => import("./uk"));

    registerLocale("de-DE", noop);
    registerLocale("el-GR", noop);
    registerLocale("en-CA", () => import("./en-CA"));
    registerLocale("en-GB", () => import("./en-GB"));
    registerLocale("en-US", () => import("./en-US"));
    registerLocale("es-ES", () => import("./es-ES"));
    registerLocale("es-MX", () => import("./es-MX"));
    registerLocale("es-US", () => import("./es-US"));
    registerLocale("fr-FR", () => import("./fr-FR"));
    registerLocale("fr-CA", () => import("./fr-CA"));
    registerLocale("it-IT", noop);
    registerLocale("pl-PL", noop);
    registerLocale("ru-RU", noop);
    registerLocale("uk-UA", noop);
}
