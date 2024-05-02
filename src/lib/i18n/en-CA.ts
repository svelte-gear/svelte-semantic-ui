// i18n/en-CA.ts

import { isoDate, isoTime } from "../data/common";
import { calendarDefaults } from "../components/use-calendar";
import { formatDefaults } from "../data/use-format";

import "./en";

calendarDefaults.ampm = false;
calendarDefaults.firstDayOfWeek = 1;
calendarDefaults.monthFirst = false;
calendarDefaults.formatter = { date: isoDate, time: isoTime };

formatDefaults.decimal = ".";
formatDefaults.thousandSeparator = " ";
formatDefaults.moneySuffix = " CAD";
formatDefaults.moneySuffix = "";
