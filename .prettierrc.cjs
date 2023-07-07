// .prettierrc.cjs
// default value are commented

module.exports = {
    tabWidth: 4, // 2
    printWidth: 100, // 80
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
    svelteAllowShorthand: false, // true
    // svelteSortOrder: "options-scripts-markup-styles",
    // svelteStrictMode: false,
    // svelteBracketNewLine: true,
    // svelteIndentScriptAndStyle: true,

    // new code below, no difference observed - is it required?
    pluginSearchDirs: ["."],
    overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
