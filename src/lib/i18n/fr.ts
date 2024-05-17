/**
 * French translations.
 * @module i18n/fr
 */

import { promptDefaults } from "../data/rule-book";
import { dateFormatDefaults } from "../data/format";

/*
                   dP oo       dP            dP
                   88          88            88
 dP   .dP .d8888b. 88 dP .d888b88 .d8888b. d8888P .d8888b. 88d888b.
 88   d8' 88'  `88 88 88 88'  `88 88'  `88   88   88'  `88 88'  `88
 88 .88'  88.  .88 88 88 88.  .88 88.  .88   88   88.  .88 88
 8888P'   `88888P8 dP dP `88888P8 `88888P8   dP   `88888P' dP

*/

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
    empty: "{name} doit avoir une valeur.",
    checked: "{name} doit être coché.",
    email: "{name} doit être une adresse e-mail valide.",
    url: "{name} doit être une URL valide.",
    regExp: "{name} n'est pas correctement formaté.",
    integer: "{name} doit être un nombre entier.",
    decimal: "{name} doit être un nombre décimal.",
    number: "{name} doit être défini comme un nombre.",
    is: "{name} doit être '{ruleValue}'.",
    isExactly: "{name} doit être exactement '{ruleValue}'.",
    not: "{name} ne peut pas être défini comme '{ruleValue}'.",
    notExactly: "{name} ne peut pas être défini exactement comme '{ruleValue}'.",
    contain: "{name} ne peut pas contenir '{ruleValue}'.",
    containExactly: "{name} ne peut pas contenir exactement '{ruleValue}'.",
    doesntContain: "{name} doit contenir '{ruleValue}'.",
    doesntContainExactly: "{name} doit contenir exactement '{ruleValue}'.",
    minLength: "{name} doit comporter au moins {ruleValue} caractères.",
    length: "{name} doit comporter au moins {ruleValue} caractères.",
    exactLength: "{name} doit comporter exactement {ruleValue} caractères.",
    maxLength: "{name} ne peut pas dépasser {ruleValue} caractères.",
    size: "{name} doit avoir une longueur entre {min} et {max} caractères.",
    match: "{name} doit correspondre au champ {ruleValue}.",
    different: "{name} doit avoir une valeur différente du champ {ruleValue}.",
    creditCard: "{name} doit être un numéro de carte de crédit valide.",
    minCount: "{name} doit comporter au moins {ruleValue} choix.",
    exactCount: "{name} doit comporter exactement {ruleValue} choix.",
    maxCount: "{name} doit comporter {ruleValue} choix ou moins.",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Veuillez entrer une valeur valide",
    unspecifiedField: "Ce champ",
    leavingMessage:
        "Des modifications non enregistrées sont présentes sur cette page et seront perdues si vous continuez.",
});

/*
                   dP                         dP
                   88                         88
 .d8888b. .d8888b. 88 .d8888b. 88d888b. .d888b88 .d8888b. 88d888b.
 88'  `"" 88'  `88 88 88ooood8 88'  `88 88'  `88 88'  `88 88'  `88
 88.  ... 88.  .88 88 88.  ... 88    88 88.  .88 88.  .88 88
 `88888P' `88888P8 dP `88888P' dP    dP `88888P8 `88888P8 dP

*/

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
    days: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
    months: [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
    ],
    monthsShort: [
        "jan",
        "fév",
        "mar",
        "avr",
        "mai",
        "juin",
        "juil",
        "aoû",
        "sep",
        "oct",
        "nov",
        "déc",
    ],
    today: "aujourd'hui",
    now: "maintenant",
    am: "AM",
    pm: "PM",
});
