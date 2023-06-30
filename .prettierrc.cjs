// .prettierrc.cjs
// default value are commented

module.exports = {
    printWidth: 100,
    tabWidth: 4,
    // useTabs: false,
    // semi: true,
    // singleQuote: false,
    // quoteProps: "as-needed", // suggested: "consistent"
    // jsxSingleQuote: false,
    // trailingComma: "es5", // suggested: "none"
    // bracketSpacing: true,
    // bracketSameLine: false,
    // arrowParens: "always",
    // proseWrap: "preserve",
    // htmlWhitespaceSensitivity: "css",
    // endOfLine: "lf",
    // embeddedLanguageFormatting: "auto",
    // singleAttributePerLine: false,

    plugins: ["prettier-plugin-svelte"],
    // svelteSortOrder: "options-scripts-markup-styles",
    // svelteStrictMode: false,
    svelteAllowShorthand: false,
    // svelteBracketNewLine: true,
    // svelteIndentScriptAndStyle: true,
};
