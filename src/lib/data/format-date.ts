/**
 * DateFormatter object, is initialized using a portion of CalendarSettings.
 * @module data/format-date
 */

import type { CalendarSettings, DateFormatFn, DateParseFn } from "./semantic-types";
import { calendarDefaults } from "./settings";
import { helperDateFormat } from "./semantic-date-format";

/** Number format function, must return null if it can't parse value and doesn't want to override it. */
export interface DateFormatter {
    format: (val: Date | undefined) => string;
    parse: (val: string) => Date | undefined;
}

/** DateFormatter implementation which uses a copy of FomanticCalendar code */
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

        type SettingsFormatter = Record<string, string | DateFormatFn>;

        const formatter: SettingsFormatter = this.settings.formatter! as SettingsFormatter;
        const type: string = this.settings.type!;
        const formatStrOrFunc: string | DateFormatFn = formatter[type];
        return helperDateFormat(formatStrOrFunc, val, this.settings as Required<CalendarSettings>);
    }
}
