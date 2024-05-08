// en-CA.ts

import { calendarDefaults } from "../components/use-calendar";
import { formatDefaults, fmt } from "../data/format";

import "./en";

calendarDefaults.ampm = false;
calendarDefaults.firstDayOfWeek = 1;
calendarDefaults.monthFirst = false;
calendarDefaults.formatter = { date: fmt.isoDate, time: fmt.isoTime };

formatDefaults.decimal = ".";
formatDefaults.thousandSeparator = " ";
formatDefaults.moneySuffix = " CAD";
formatDefaults.moneySuffix = "";

// TODO: consider isf calemdar may be optional

// formatDefaults.simpleDateFormat_monthFirst = false;
// formatDefaults.simpleDateFormat_locale = "en-CA";
