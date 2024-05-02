// routes/+layout.ts

import type { LoadEvent } from "@sveltejs/kit";

export const ssr = false;
export const prerender = true;

// import "../utils/import-modules"; // individual components from semantic-ui and fomantic-ui
// import "../utils/import-semantic"; // full semantic-ui + some fomantic components
// import "../utils/import-fomantic"; // full fomantic-ui library

export async function load({ params }: LoadEvent): Promise<{ locale: string }> {
    void params;
    const locale: string = "en-GB";

    let i18n: Promise<unknown> | undefined = undefined;
    if (locale === "fr") {
        i18n = import("../lib/i18n/fr");
    } else if (locale === "fr-CA") {
        i18n = import("../lib/i18n/fr-CA");
    } else if (locale === "fr-FR") {
        i18n = import("../lib/i18n/fr-FR");
    } else if (locale === "en") {
        i18n = import("../lib/i18n/en");
    } else if (locale === "en-CA") {
        i18n = import("../lib/i18n/en-CA");
    } else if (locale === "en-GB") {
        i18n = import("../lib/i18n/en-GB");
    } else if (locale === "en-US") {
        i18n = import("../lib/i18n/en-US");
    }

    if (i18n !== undefined) {
        await i18n;
    }
    return { locale: locale };
}
