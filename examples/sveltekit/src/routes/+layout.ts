// +layout.ts
// Script executed for all pages.

import type { LoadEvent } from "@sveltejs/kit";
import {
    applyLocale,
    supportedLocales,
    initializeFramework,
    initLog,
    formLog,
    compLog,
} from "@svelte-gear/svelte-semantic-ui";

import { browserMatch } from "../locale-info";

export const ssr: boolean = false;
export const prerender: boolean = true;

type LocaleObj = {
    locale: string;
};

/** Runs before the application is displayed, saves loaded locale into the context */
export async function load({ params }: LoadEvent): Promise<LocaleObj> {
    void params;
    let res: string | null = null;

    initLog.build("debug");
    formLog.build("debug");
    compLog.build("debug");
    await initializeFramework();

    // Find the overlap between browser languages and supported locales
    const browserLocale: string | null = browserMatch(supportedLocales());
    if (browserLocale) {
        res = await applyLocale(browserLocale);
        return { locale: res! };
    }

    // default to international English
    res = await applyLocale("en");
    return { locale: res! };
}
