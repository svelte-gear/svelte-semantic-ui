// i18n/gr
// Finnish translations and formats.

import { promptDefaults } from "../../lib/data/rule-book";
import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../../lib/data/format";

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
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
    contain: "{name} ei voi sisältää '{ruleValue}'",
    containExactly: "{name} ei voi sisältää tarkalleen '{ruleValue}'",
    doesntContain: "{name} täytyy sisältää '{ruleValue}'",
    doesntContainExactly: "{name} täytyy sisältää tarkalleen '{ruleValue}'",
    minLength: "{name} täytyy olla vähintään {ruleValue} merkkiä pitkä",
    length: "{name} täytyy olla vähintään {ruleValue} merkkiä pitkä",
    exactLength: "{name} täytyy olla tarkalleen {ruleValue} merkkiä pitkä",
    maxLength: "{name} ei voi olla pidempi kuin {ruleValue} merkkiä",
    size: "{name} täytyy olla pituudeltaan {min} ja {max} merkin välillä",
    match: "{name} täytyy vastata kenttää {ruleValue}",
    different: "{name} täytyy olla eri arvo kuin kenttä {ruleValue}",
    creditCard: "{name} täytyy olla kelvollinen luottokortin numero",
    minCount: "{name} täytyy olla vähintään {ruleValue} valintaa",
    exactCount: "{name} täytyy olla tarkalleen {ruleValue} valintaa",
    maxCount: "{name} täytyy olla {ruleValue} tai vähemmän valintoja",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Anna kelvollinen arvo",
    unspecifiedField: "Tämä kenttä",
    leavingMessage: "Tällä sivulla on tallentamattomia muutoksia, jotka hylätään, jos jatkat.",
});

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
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
});

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "";
numberFormatDefaults.moneySuffix = " €";
numberFormatDefaults.listSeparator = ",";

function fiDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 2);
    const month: string = pad(d.getMonth() + 1, 2);
    const year: number = d.getFullYear();
    return `${day}.${month}.${year}`;
}

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: fiDate, time: fmt.isoTime };
