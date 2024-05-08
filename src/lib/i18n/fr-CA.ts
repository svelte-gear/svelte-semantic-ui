// fr-CA.ts

import { calendarDefaults } from "../components/use-calendar";
import { formatDefaults, fmt } from "../data/format";

import "./fr";

calendarDefaults.ampm = false;
calendarDefaults.firstDayOfWeek = 1;
calendarDefaults.monthFirst = false;
calendarDefaults.formatter = { date: fmt.isoDate, time: fmt.isoTime };

formatDefaults.decimal = ",";
formatDefaults.thousandSeparator = " ";
formatDefaults.moneyPrefix = "";
formatDefaults.moneySuffix = " $ CAD";
