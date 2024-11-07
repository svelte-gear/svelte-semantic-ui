/**
```
You have {{count:gt;
    0:
        {{count}} new {{count;
            1:message;
            default: messages
        }}!;
    default:
        no messages...
}}

{{count:gt;
    0:
        Máte {{count}} {{count:gte;
            1:novou zprávu;
            2:nové zprávy;
            5:nových zpráv
        }}!;
    default:
        Nemáte žádné zprávy...
}}

{{count:gt;
    0:
        У вас {{count}} {{count_20:gte;
            1:новое сообщение;
            2:новых сообщения;
            5:новых сообщений
        }}!;
    default:
        Нет новых сообщений...
}}
```
 * https://www.youtube.com/watch?v=kowM-MoGVns
 */

import type { Readable } from "svelte/store";
import type { Config } from "sveltekit-i18n";
import i18n from "sveltekit-i18n";

type StringMap = {
    [key: string]: string;
};

const langList: StringMap = {
    en: "English",
    es: "Español",
    fr: "Française",
};

const config: Config = {
    translations: {
        en: langList, // en: { en: "English", es: "Spanish",  fr: "French" },
        es: langList, // es: { en: "Inglés",  es: "Español",  fr: "Francés" },
        fr: langList, // cs: { en: "Anglais", es: "Espagnol", fr: "Française" },
    },
    loaders: [
        { locale: "en", key: "", loader: async () => (await import("./en.json")).default },
        { locale: "es", key: "", loader: async () => (await import("./es.json")).default },
        { locale: "fr", key: "", loader: async () => (await import("./fr.json")).default },
    ],
};

// type definition of i18n is enormous, there is no need to re-document it
// eslint-disable-next-line @typescript-eslint/typedef, new-cap
const ski18n = new i18n(config);

type LtRes = Promise<void | void[]> | undefined;

type AnyMap = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

/** Translation function used in the application  */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const t: Readable<(key: string, ...params: AnyMap[]) => any> = ski18n.t;

/** Load translation files for locale and path. */
export const loadTranslations: (locale: string, route?: string) => LtRes = ski18n.loadTranslations;

type GetStringArray = {
    get: () => string[];
};

/** List of locales configured in sveltekit-i18n. */
export const locales: Readable<string[]> & GetStringArray = ski18n.locales;

type GetString = {
    get: () => string;
};

/** Currntly applied locale. */
export const locale: Readable<string> & GetString = ski18n.locale;
