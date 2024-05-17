// .eslintrc.cjs
// https://typescript-eslint.io/linting/typed-linting/

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
        project: ["tsconfig.eslint.json"],
        tsconfigRootDir: __dirname, // current folder in node
        extraFileExtensions: [".svelte"],
    },
    plugins: ["@typescript-eslint", "react", "import", "jsx-a11y", "promise"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:svelte/recommended",
        "airbnb-typescript",
        // "prettier", // make rules the same instead of disabling them
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
    rules: {
        "@typescript-eslint/comma-dangle": ["warn", "only-multiline"],
        "@typescript-eslint/indent": ["warn", 4],
        "@typescript-eslint/quotes": ["warn", "double", { avoidEscape: true }],

        "@typescript-eslint/ban-ts-comment": "off", // it is there on purpose
        "@typescript-eslint/no-inferrable-types": "off", // extra check is good
        "@typescript-eslint/restrict-template-expressions": "off", // complains about string[]

        "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
        "@typescript-eslint/explicit-module-boundary-types": "warn",
        "@typescript-eslint/typedef": [
            "warn",
            {
                arrayDestructuring: true,
                arrowParameter: true,
                memberVariableDeclaration: true,
                objectDestructuring: true,
                parameter: true,
                propertyDeclaration: true,
                variableDeclaration: true,
                variableDeclarationIgnoreFunction: false,
            },
        ],
        // indent: [
        //     "error",
        //     4,
        //     {
        //         SwitchCase: 1,
        //         VariableDeclarator: 1,
        //         outerIIFEBody: 1,
        //         MemberExpression: 1,
        //         FunctionDeclaration: {
        //             parameters: 1,
        //             body: 1,
        //         },
        //         FunctionExpression: {
        //             parameters: 1,
        //             body: 1,
        //         },
        //         CallExpression: {
        //             arguments: 1,
        //         },
        //         ArrayExpression: 1,
        //         ObjectExpression: 1,
        //         ImportDeclaration: 1,
        //         flatTernaryExpressions: false,
        //         ignoredNodes: ["TemplateLiteral *"],
        //         offsetTernaryExpressions: true,
        //     },
        // ],
    },
};
