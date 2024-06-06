// i18n/en-GB-ext
// Alternative date format recommended by NHS: 1-Mar-2024

import type { CalendarSettings } from "../../lib/data/semantic-types";

const calendarSettings: Partial<CalendarSettings> = {
    formatter: {
        cellTime: "HH:mm",
        date: "DD-MMM-YYYY",
        datetime: "DD-MMM-YYYY HH:mm",
        time: "HH:mm",
    },
};

export default {
    calendar: {
        ...calendarSettings,
    },
};
