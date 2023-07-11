// .prettierrc.cjs
// default value are commented

module.exports = {
    tabWidth: 4, // default: 2
    printWidth: 100, // default: 80
    // useTabs: false,
    // semi: true,
    // singleQuote: false,
    // quoteProps: "as-needed",         // suggested: "consistent"
    // jsxSingleQuote: false,
    // trailingComma: "es5",            // suggested: "none"
    // bracketSpacing: true,
    // bracketSameLine: false,
    // arrowParens: "always",
    // proseWrap: "preserve",
    // htmlWhitespaceSensitivity: "css",
    // endOfLine: "lf",
    // embeddedLanguageFormatting: "auto",
    // singleAttributePerLine: false,

    plugins: ["prettier-plugin-svelte"],
    svelteAllowShorthand: false, // default: true
    // svelteSortOrder: "options-scripts-markup-styles",
    // svelteStrictMode: false,
    // svelteBracketNewLine: true,
    // svelteIndentScriptAndStyle: true,
    overrides: [
        {
            files: "*.svelte",
            options: { parser: "svelte" },
        },
    ],
};
