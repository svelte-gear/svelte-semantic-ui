// i18n/ja-JP

// Japanese translations and formats.
// Number: ¥1,000
// Date:   2024/03/01 14:50

import type {
    CalendarSettings,
    CalendarText,
    FormPropmt,
    FormText,
    NumberSettings,
} from "@svelte-gear/svelte-semantic-ui";

const formPrompt: FormPropmt = {
    empty: "{name}には値が必要です",
    checked: "{name}をチェックする必要があります",
    email: "{name}は有効なメールアドレスでなければなりません",
    url: "{name}は有効なURLでなければなりません",
    regExp: "{name}の形式が正しくありません",
    integer: "{name}は整数でなければなりません",
    decimal: "{name}は小数点数でなければなりません",
    number: "{name}は数字で設定されなければなりません",
    is: "{name}は'{ruleValue}'でなければなりません",
    isExactly: "{name}は正確に'{ruleValue}'でなければなりません",
    not: "{name}を'{ruleValue}'に設定することはできません",
    notExactly: "{name}を正確に'{ruleValue}'に設定することはできません",
    contains: "{name}に'{ruleValue}'を含めることはできません",
    containsExactly: "{name}に正確に'{ruleValue}'を含めることはできません",
    doesntContain: "{name}は'{ruleValue}'を含める必要があります",
    doesntContainExactly: "{name}は正確に'{ruleValue}'を含める必要があります",
    minLength: "{name}は少なくとも{ruleValue}文字でなければなりません",
    exactLength: "{name}は正確に{ruleValue}文字でなければなりません",
    maxLength: "{name}は{ruleValue}文字を超えてはなりません",
    match: "{name}は{ruleValue}フィールドと一致しなければなりません",
    different: "{name}は{ruleValue}フィールドと異なる値を持つ必要があります",
    creditCard: "{name}は有効なクレジットカード番号でなければなりません",
    minCount: "{name}は少なくとも{ruleValue}個の選択肢が必要です",
    exactCount: "{name}は正確に{ruleValue}個の選択肢が必要です",
    maxCount: "{name}は{ruleValue}個以下の選択肢が必要です",

    start: "{name}は'{ruleValue}'で始まる必要があります",
    isoDate: "{name}は'YYYY-MM-DD'形式に従う必要があります",
    startEnd: "{name}は'{ruleValue}'で始まり、'{ruleValue}'で終わる必要があります",
};

const formText: FormText = {
    unspecifiedRule: "有効な値を入力してください",
    unspecifiedField: "このフィールド",
    leavingMessage:
        "このページには保存されていない変更があります。このまま進むと変更が破棄されます。",
};

const calendarText: CalendarText = {
    days: ["日", "月", "火", "水", "木", "金", "土"],
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    monthsShort: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
    ],
    today: "今日",
    now: "今",
    am: "午前",
    pm: "午後",
    weekNo: "週",
};

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 0,
    monthFirst: true,
    formatter: {
        cellTime: "HH:mm",
        date: "YYYY/MM/DD",
        datetime: "YYYY/MM/DD HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimalSeparator: ".",
    thousandSeparator: ",",
    moneyPrefix: "¥",
    moneySuffix: "",
    moneyPrecision: 0,
    listSeparator: ",",
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
