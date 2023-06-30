// .eslintrc.cjs
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2021,
        tsconfigRootDir: __dirname, // current folder in node
        project: ["tsconfig.eslint.json"],
        extraFileExtensions: [".svelte"],
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "airbnb-typescript",
    ],
    plugins: ["svelte3", "@typescript-eslint", "react", "import", "jsx-a11y", "promise"],
    overrides: [
        {
            files: ["*.svelte"],
            processor: "svelte3/svelte3",
        },
    ],
    settings: {
        "svelte3/typescript": () => require("typescript"),
        // "svelte3/typescript": true,
    },
    env: {
        browser: true,
        es2021: true,
    },
    rules: {
        "@typescript-eslint/comma-dangle": ["warn", "only-multiline"],
        "@typescript-eslint/indent": ["warn", 4],
        "@typescript-eslint/quotes": ["warn", "double", { avoidEscape: true }],

        "@typescript-eslint/ban-ts-comment": "off", // it is there on purpose
        "@typescript-eslint/no-inferrable-types": "off", // extra check is good
        "@typescript-eslint/restrict-template-expressions": "off", // complains about string[]
    },
};
