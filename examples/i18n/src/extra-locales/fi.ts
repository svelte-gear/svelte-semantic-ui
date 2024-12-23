// i18n/fi-FI

// Finnish translations and formats.
// Number: 1 000,00 €
// Date:   01.03.2024 14:50

import type {
    CalendarSettings,
    CalendarText,
    FormPropmt,
    FormText,
    NumberSettings,
} from "@svelte-gear/svelte-semantic-ui";

const formPrompt: FormPropmt = {
    empty: "{name} täytyy olla arvo",
    checked: "{name} täytyy olla valittu",
    email: "{name} täytyy olla kelvollinen sähköposti",
    url: "{name} täytyy olla kelvollinen URL",
    regExp: "{name} ei ole oikein muotoiltu",
    integer: "{name} täytyy olla kokonaisluku",
    decimal: "{name} täytyy olla desimaaliluku",
    number: "{name} täytyy olla numero",
    is: "{name} täytyy olla '{ruleValue}'",
    isExactly: "{name} täytyy olla tarkalleen '{ruleValue}'",
    not: "{name} ei voi olla '{ruleValue}'",
    notExactly: "{name} ei voi olla tarkalleen '{ruleValue}'",
    contains: "{name} ei voi sisältää '{ruleValue}'",
    containsExactly: "{name} ei voi sisältää tarkalleen '{ruleValue}'",
    doesntContain: "{name} täytyy sisältää '{ruleValue}'",
    doesntContainExactly: "{name} täytyy sisältää tarkalleen '{ruleValue}'",
    minLength: "{name} täytyy olla vähintään {ruleValue} merkkiä pitkä",
    exactLength: "{name} täytyy olla tarkalleen {ruleValue} merkkiä pitkä",
    maxLength: "{name} ei voi olla pidempi kuin {ruleValue} merkkiä",
    match: "{name} täytyy vastata kenttää {ruleValue}",
    different: "{name} täytyy olla eri arvo kuin kenttä {ruleValue}",
    creditCard: "{name} täytyy olla kelvollinen luottokortin numero",
    minCount: "{name} täytyy olla vähintään {ruleValue} valintaa",
    exactCount: "{name} täytyy olla tarkalleen {ruleValue} valintaa",
    maxCount: "{name} täytyy olla {ruleValue} tai vähemmän valintoja",

    start: "{name} pitää alkaa '{ruleValue}'",
    isoDate: "{name} pitää olla muodossa 'VVVV-KK-PP' (vuosi-kuukausi-päivä)",
    startEnd: "{name} pitää alkaa ja loppua '{ruleValue}'",
};

const formText: FormText = {
    unspecifiedRule: "Anna kelvollinen arvo",
    unspecifiedField: "Tämä kenttä",
    leavingMessage: "Tällä sivulla on tallentamattomia muutoksia, jotka hylätään, jos jatkat.",
};

const calendarText: CalendarText = {
    days: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
    months: [
        "Tammikuu",
        "Helmikuu",
        "Maaliskuu",
        "Huhtikuu",
        "Toukokuu",
        "Kesäkuu",
        "Heinäkuu",
        "Elokuu",
        "Syyskuu",
        "Lokakuu",
        "Marraskuu",
        "Joulukuu",
    ],
    monthsShort: [
        "Tammi",
        "Helmi",
        "Maalis",
        "Huhti",
        "Touko",
        "Kesä",
        "Heinä",
        "Elo",
        "Syys",
        "Loka",
        "Marras",
        "Joulu",
    ],
    today: "Tänään",
    now: "Nyt",
    am: "AM",
    pm: "PM",
    weekNo: "viikko",
};

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 1,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "DD.MM.YYYY",
        datetime: "DD.MM.YYYY HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimalSeparator: ",",
    thousandSeparator: " ",
    moneyPrefix: "",
    moneySuffix: " €",
    moneyPrecision: 2,
};

export default {
    form: {
        prompt: formPrompt,
        text: formText,
    },
    calendar: {
        text: calendarText,
        ...calendarSettings,
    },
    number: {
        ...numberSettings,
    },
};
