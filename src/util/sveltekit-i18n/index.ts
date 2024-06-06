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

const langList: { [key: string]: string } = {
    en: "English",
    es: "Español",
    cs: "Česky",
};

const config: Config = {
    translations: {
        en: langList,
        es: langList,
        cs: langList,
        // en: { en: "English",  es: "Spanish",   cs: "Czech" },
        // es: { en: "Inglés",   es: "Español",   cs: "Checo" },
        // cs: { en: "Anglicky", es: "Španělsky", cs: "Česky" },
    },
    loaders: [
        { locale: "en", key: "", loader: async () => (await import("./en.json")).default },
        { locale: "es", key: "", loader: async () => (await import("./es.json")).default },
        { locale: "cs", key: "", loader: async () => (await import("./cs.json")).default },
    ],
};

// type definition of i18n is enormous, there is no need to re-document it
// eslint-disable-next-line @typescript-eslint/typedef
const ski18n = new i18n(config);

type LtRes = Promise<void | void[]> | undefined;

/** Translation function used in the application  */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const t: Readable<(key: string, ...params: { [key: string]: any }[]) => any> = ski18n.t;

/** Load translation files for locale and path. */
export const loadTranslations: (locale: string, route?: string) => LtRes = ski18n.loadTranslations;

/** List of locales configured in sveltekit-i18n. */
export const locales: Readable<string[]> & { get: () => string[] } = ski18n.locales;

/** Currntly applied locale. */
export const locale: Readable<string> & { get: () => string } = ski18n.locale;
