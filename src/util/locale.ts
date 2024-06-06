// util/locale.ts
// Helper functions for storing selected locale in a cookie.

const localeCookieName: string = "ssui_locale";
const localeCookieExpDays: number = 90;

export function saveLocaleCookie(value: string): void {
    const date: Date = new Date();
    date.setTime(date.getTime() + localeCookieExpDays * 24 * 60 * 60 * 1000);
    document.cookie = `${localeCookieName}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Strict`;
}

export function readLocaleCookie(): string | null {
    const nameEQ: string = localeCookieName + "=";
    const ca: string[] = document.cookie.split(";");
    for (const c of ca) {
        const cookie: string = c.trim();
        if (cookie.startsWith(nameEQ)) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

export function getLanguage(locale: string): string {
    return locale.split("-")[0];
}

export function getLanguages(locales: readonly string[]): string[] {
    const languages: string[] = locales.map((locale: string): string => getLanguage(locale));
    const uniqueLanguages: string[] = [...new Set(languages)];
    return uniqueLanguages;
}

export function cookieMatch(supportedLocales: string[]): string | null {
    const cookieLocale: string | null = readLocaleCookie();
    if (!cookieLocale) {
        return null;
    }
    if (supportedLocales.includes(cookieLocale)) {
        return cookieLocale;
    }
    const cookieLanguage: string = getLanguage(cookieLocale);
    if (getLanguages(supportedLocales).includes(cookieLanguage)) {
        return cookieLanguage;
    }
    return null;
}

export function browserMatch(supportedLocales: string[]): string | null {
    // look for exact match
    for (const browserLocale of navigator.languages) {
        if (supportedLocales.includes(browserLocale)) {
            return browserLocale;
        }
    }
    // try partial matching by language
    const supportedLanguages: string[] = getLanguages(supportedLocales);
    for (const browserLanguage of getLanguages(navigator.languages)) {
        if (supportedLanguages.includes(browserLanguage)) {
            return browserLanguage;
        }
    }
    // no match found
    return null;
}
