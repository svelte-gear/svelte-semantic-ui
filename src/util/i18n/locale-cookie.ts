// i18n/locale-cookie
// Helper functions for storing selected locale in a cookie.

const localeCookieName: string = "ssui_locale";
const localeCookieExpDays: number = 90;

export function saveLocaleCookie(value: string): void {
    const date: Date = new Date();
    date.setTime(date.getTime() + localeCookieExpDays * 24 * 60 * 60 * 1000);
    document.cookie = `${localeCookieName}=${value}; expires=${date.toUTCString()}; path=/`;
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
