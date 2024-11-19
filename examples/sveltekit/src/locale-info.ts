// locale-info.ts
// Helper functions for storing selected locale in a cookie and matching browser locale.

/* eslint-disable implicit-arrow-linebreak, function-paren-newline */

function getLanguage(locale: string): string {
    return locale.split("-")[0];
}

function getLanguages(locales: readonly string[]): string[] {
    const languages: string[] = locales.map((locale: string): string => getLanguage(locale));
    const uniqueLanguages: string[] = [...new Set(languages)];
    return uniqueLanguages;
}

export function browserMatch(supportedLocales: string[]): string | null {
    // look for exact match
    const exactMatch: string | undefined = navigator.languages.find((browserLocale: string) =>
        supportedLocales.includes(browserLocale)
    );
    if (exactMatch) {
        return exactMatch;
    }

    // try partial match by language
    const supportedLanguages: string[] = getLanguages(supportedLocales);
    const partialMatch: string | undefined = navigator.languages.find((browserLocale: string) =>
        supportedLanguages.includes(getLanguage(browserLocale))
    );
    if (partialMatch) {
        const lang: string = getLanguage(partialMatch);
        console.debug(`Partial browser locale match: ${partialMatch} -> ${lang}`);
        return lang;
    }

    // no match found
    return null;
}
