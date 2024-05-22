// i18n/en-GB-ext
// Alternative date format recommended by NHS: 1-Mar-2024

import { dateFormatDefaults, fmt, pad } from "../../lib/data/format";

import "../../lib/i18n/en-GB";

function gbDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 1);
    const month: string = dateFormatDefaults.text!.monthsShort[d.getMonth()];
    const year: number = d.getFullYear();
    return `${day}-${month}-${year}`;
}

dateFormatDefaults.formatter = { date: gbDate, time: fmt.isoTime };
