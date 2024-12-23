/**
 * 'fmt' and 'parse' utility object, input formatter classes.
 * @module data/input-formatter
 */

import type { CalendarSettings, DateFormatFn, DateParseFn } from "./semantic-types";
import { calendarDefaults } from "./settings";
import { helperDateFormat } from "./semantic-date-format";

/** Number format function, must return null if it can't parse value and doesn't want to override it. */
export interface DateFormatter {
    format: (val: Date | undefined) => string;
    parse: (val: string) => Date | undefined;
}

export class DateFmt implements DateFormatter {
    private settings: CalendarSettings;

    constructor(settings: CalendarSettings = {}) {
        const def: CalendarSettings = calendarDefaults.read();

        /* eslint-disable key-spacing, no-multi-spaces */
        /* prettier-ignore */
        this.settings = {
            // settings which are used for format() and parse()
            type:           settings.type                ?? def.type,
            monthFirst:     settings.monthFirst          ?? def.monthFirst,
            firstDayOfWeek: settings.firstDayOfWeek      ?? def.firstDayOfWeek,
            centuryBreak:   settings.centuryBreak        ?? def.centuryBreak,
            currentCentury: settings.currentCentury      ?? def.currentCentury,
            parser: {
                date:       settings.parser?.date        ?? def.parser?.date,
            },
            formatter: {
                date:       settings.formatter?.date     ?? def.formatter?.date,
                datetime:   settings.formatter?.datetime ?? def.formatter?.datetime,
                time:       settings.formatter?.time     ?? def.formatter?.time,
            },
            // deep-copy sub-objects
            text:   { ...def.text,   ...settings.text },
            regExp: { ...def.regExp, ...settings.regExp },
        };
        /* eslint-enable */
    }

    parse(val: string): Date | undefined {
        if (!val) {
            return undefined;
        }
        const dateParser: DateParseFn = this.settings.parser!.date!;
        return dateParser(val, this.settings) ?? undefined;
    }

    format(val: Date | undefined): string {
        if (val === undefined || val === null) {
            return "";
        }
        if (!(val instanceof Date)) {
            throw new Error(`dateFormatter expects Date as data type, got ${typeof val} = ${val}`);
        }
        const type: string = this.settings.type!;
        type SettingsFormatter = {
            [key: string]: string | DateFormatFn;
        };
        const formatter: SettingsFormatter = this.settings.formatter! as SettingsFormatter;
        const formatStrOrFunc: string | DateFormatFn = formatter[type];
        return helperDateFormat(formatStrOrFunc, val, this.settings as Required<CalendarSettings>);
    }
}
