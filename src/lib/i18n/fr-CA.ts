// fr-CA.ts

import { isoDate, isoTime } from "../data/_common";
import { calendarDefaults } from "../components/use-calendar";
import { formatDefaults } from "../data/format";

import "./fr";

calendarDefaults.ampm = false;
calendarDefaults.firstDayOfWeek = 1;
calendarDefaults.monthFirst = false;
calendarDefaults.formatter = { date: isoDate, time: isoTime };

formatDefaults.decimal = ",";
formatDefaults.thousandSeparator = " ";
formatDefaults.moneyPrefix = "";
formatDefaults.moneySuffix = " $ CAD";
