// locale-info.ts
// Helper functions for storing selected locale in a cookie and matching browser locale.

/* eslint-disable implicit-arrow-linebreak, function-paren-newline  */

const localeCookieName: string = "sui_locale";
const localeCookieExpDays: number = 90;

export function saveLocaleCookie(value: string): void {
    const date: Date = new Date();
    date.setTime(date.getTime() + localeCookieExpDays * 24 * 60 * 60 * 1000);
    document.cookie = `${localeCookieName}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Strict`;
}

export function readLocaleCookie(): string | null {
    const nameEquals: string = `${localeCookieName}=`;
    const cookieArray: string[] = document.cookie.split(";");
    const cookie: string | undefined = cookieArray.find((c: string) =>
        c.trim().startsWith(nameEquals)
    );
    return cookie ? cookie.trim().slice(nameEquals.length) : null;
}

function getLanguage(locale: string): string {
    return locale.split("-")[0];
}

function getLanguages(locales: readonly string[]): string[] {
    const languages: string[] = locales.map((locale: string): string => getLanguage(locale));
    const uniqueLanguages: string[] = [...new Set(languages)];
    return uniqueLanguages;
}

export function cookieMatch(supportedLocales: string[]): string | null {
    const cookieLocale: string | null = readLocaleCookie();
    // look for exact match
    if (!cookieLocale) {
        return null;
    }
    if (supportedLocales.includes(cookieLocale)) {
        return cookieLocale;
    }
    // try partial matching by language
    const cookieLanguage: string = getLanguage(cookieLocale);
    if (getLanguages(supportedLocales).includes(cookieLanguage)) {
        console.debug(`Partial cookie locale match: ${cookieLocale} ~= ${cookieLanguage}`);
        return cookieLanguage;
    }
    // no match found
    return null;
}

export function browserMatch(supportedLocales: string[]): string | null {
    // look for exact match
    const exactMatch: string | undefined = navigator.languages.find((browserLocale: string) =>
        supportedLocales.includes(browserLocale)
    );
    if (exactMatch) {
        return exactMatch;
    }

    // try partial matching by language
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
