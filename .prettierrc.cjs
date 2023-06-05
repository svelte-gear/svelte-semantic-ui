// .prettierrc.cjs
// default value are commented

module.exports = {
   printWidth: 120,
   tabWidth: 3,
   // useTabs: false,
   // semi: true,
   // singleQuote: false,
   quoteProps: "consistent",
   // jsxSingleQuote: false,
   trailingComma: "none",
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
   svelteAllowShorthand: false
   // svelteBracketNewLine: true,
   // svelteIndentScriptAndStyle: true,
};
