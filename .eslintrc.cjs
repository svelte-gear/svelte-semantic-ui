// .eslintrc.cjs
// https://typescript-eslint.io/linting/typed-linting/

// TODO: consider https://github.com/sveltejs/eslint-config/blob/master/index.js

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/typedef, @typescript-eslint/no-var-requires
const rules = require("./.eslint_rules.cjs");

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
        project: [
            // library project
            "tsconfig.json",
            "tsconfig_eslint.json",
            // example projects are linted from the root project to keep thier config minimal
            "examples/vite/tsconfig.json",
            "examples/svelte-kit/tsconfig.json",
            // TODO: minimal webpack config - "examples/webpack/tsconfig.eslint.json",
        ],
        tsconfigRootDir: __dirname, // current folder in node
        extraFileExtensions: [".svelte"],
    },
    plugins: ["@typescript-eslint", "import", "jsx-a11y", "promise"], // "react"
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked", // includes "recommended"
        "plugin:svelte/recommended",
        "airbnb-base", //                                    has rules not incl in airbnb-typescript
        "airbnb-typescript/base", //                         base doesn't reference react
    ],
    overrides: [
        {
            files: ["*.svelte"],
            parser: "svelte-eslint-parser",
            parserOptions: {
                parser: "@typescript-eslint/parser",
            },
        },
    ],
    env: {
        browser: true,
        es2020: true,
    },
    rules: rules,
};
