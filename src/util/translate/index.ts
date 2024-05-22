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

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type { Readable } from "svelte/store";
import type { Config } from "sveltekit-i18n";
import i18n from "sveltekit-i18n";

const langList: { [key: string]: string } = {
    en: "English",
    cz: "Česky",
};

export const config: Config = {
    translations: {
        en: { lang: langList },
        cs: { lang: langList },
    },
    loaders: [
        { locale: "en", key: "", loader: async () => (await import("./en.json")).default },
        { locale: "es", key: "", loader: async () => (await import("./es.json")).default },
        { locale: "cs", key: "", loader: async () => (await import("./cs.json")).default },
    ],
    // loaders: [
    //     { locale: "en", key: "menu", loader: async () => (await import("./en-menu")).default },
    //     { locale: "en", key: "cont", loader: async () => (await import("./en-cont")).default },
    //     { locale: "cs", key: "menu", loader: async () => (await import("./cs-menu")).default },
    //     { locale: "cs", key: "cont", loader: async () => (await import("./cs-cont")).default },
    // ],
};

// the type of i18n is enormous, there is no need to re-document it
// eslint-disable-next-line @typescript-eslint/typedef, @typescript-eslint/naming-convention
const sk_i18n = new i18n(config);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const t: Readable<(key: string, ...params: { [key: string]: any }[]) => any> = sk_i18n.t;

export const loadTranslations: (
    locale: string,
    route?: string
) => Promise<void | void[]> | undefined = sk_i18n.loadTranslations;

export const supportedLocales: Readable<string[]> & {
    get: () => string[];
} = sk_i18n.locales;

export const currentLocale: Readable<string> & {
    get: () => string;
} = sk_i18n.locale;

// export const loadingTrans: Readable<boolean> & {
//     toPromise: (locale?: string, route?: string) => Promise<void[] | void>;
//     get: () => boolean;
// } = sk_i18n.loading;
