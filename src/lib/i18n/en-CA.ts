// en-CA.ts

import { isoDate, isoTime } from "../data/_common";
import { calendarDefaults } from "../components/use-calendar";
import { formatDefaults } from "../components/use-format";

import "./en";

calendarDefaults.ampm = false;
calendarDefaults.firstDayOfWeek = 1;
calendarDefaults.monthFirst = false;
calendarDefaults.formatter = { date: isoDate, time: isoTime };

formatDefaults.decimal = ".";
formatDefaults.thousandSeparator = " ";
formatDefaults.moneySuffix = " CAD";
formatDefaults.moneySuffix = "";

// TODO: consider isf calemdar may be optional

// formatDefaults.simpleDateFormat_monthFirst = false;
// formatDefaults.simpleDateFormat_locale = "en-CA";
