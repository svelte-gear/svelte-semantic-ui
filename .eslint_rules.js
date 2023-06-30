// eslint_rules.js

/* eslint-disable quote-props, key-spacing, object-property-newline, no-multi-spaces, max-len */
/* eslint-disable @typescript-eslint/naming-convention */

export default {
    //----------------------------------------------------------------------------------------------
    /*
     ██████  ██████  ██████  ███████
    ██      ██    ██ ██   ██ ██
    ██      ██    ██ ██████  █████
    ██      ██    ██ ██   ██ ██
     ██████  ██████  ██   ██ ███████
   */

    // prefer explicit types, param: default val is not a reason to skip type, prop: always declare type of class fields
    "@typescript-eslint/no-inferrable-types": [
        "error",
        { ignoreParameters: true, ignoreProperties: true },
    ],

    // assertion is there for a reason!
    "@typescript-eslint/no-non-null-assertion": "off",

    // indent 3 spaces, ignore comments, don't indent .then()
    "@typescript-eslint/indent": ["warn", 3, { ignoreComments: true, MemberExpression: 0 }],

    //----------------------------------------------------------------------------------------------
    /*
     █████  ██   ████████ ███████ ██████
    ██   ██ ██      ██    ██      ██   ██
    ███████ ██      ██    █████   ██████
    ██   ██ ██      ██    ██      ██   ██
    ██   ██ ███████ ██    ███████ ██   ██
   */

    // code flow

    // allow single line for shorter code
    "@typescript-eslint/brace-style": ["error", "stroustrup", { allowSingleLine: true }],

    // may modify passed-in objects
    "no-param-reassign": ["error", { props: false }],

    // usefull in loops
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],

    // explicitly void unused promises
    "no-void": ["error", { allowAsStatement: true }],

    // no rule, just consistency
    "object-curly-newline": ["error", { consistent: true }],

    // shorthand is confusing !?
    "object-shorthand": ["error", "never"],

    // spacing and separators

    // don't
    "@typescript-eslint/comma-dangle": ["warn", "never"],

    // consize blocks are easier to read
    "@typescript-eslint/lines-between-class-members": [
        "warn",
        "always",
        { exceptAfterSingleLine: true },
    ],

    // arbitrary compromise
    "max-len": ["warn", { code: 100 }],

    // allow two empty lines for decoration
    "no-multiple-empty-lines": ["warn", { max: 2, maxBOF: 0, maxEOF: 1 }],

    //----------------------------------------------------------------------------------------------
    /*
     █████  ██████  ██████
    ██   ██ ██   ██ ██   ██
    ███████ ██   ██ ██   ██
    ██   ██ ██   ██ ██   ██
    ██   ██ ██████  ██████
   */

    // explicit return types everywhere
    "@typescript-eslint/explicit-function-return-type": [
        2,
        {
            allowExpressions: false,
            allowTypedFunctionExpressions: false,
            allowHigherOrderFunctions: false,
            allowConciseArrowFunctionExpressionsStartingWithVoid: false,
        },
    ],

    // require parens in (arg) => {...}, makes arrow functions more visible
    "arrow-parens": ["error", "always"],

    // consistent function call decoration
    "function-paren-newline": ["error", "consistent"],

    // semicolons all the way
    "@typescript-eslint/member-delimiter-style": [
        2,
        {
            multiline: { delimiter: "semi", requireLast: true },
            singleline: { delimiter: "semi", requireLast: true },
        },
    ],

    // spacing: { looks: cleaner, easier: to_read }
    "object-curly-spacing": ["warn", "always"],

    // leave out js and ts extensions
    "import/extensions": [
        "warn",
        "always",
        { js: "never", jsx: "never", ts: "never", tsx: "never" },
    ],

    //----------------------------------------------------------------------------------------------
    /*
    ██  ██████  ███    ██  ██████  ██████  ███████
    ██ ██       ████   ██ ██    ██ ██   ██ ██
    ██ ██   ███ ██ ██  ██ ██    ██ ██████  █████
    ██ ██    ██ ██  ██ ██ ██    ██ ██   ██ ██
    ██  ██████  ██   ████  ██████  ██   ██ ███████
   */

    // "arrow-body-style": "off",   // allow explicit returns for promise chain
    "max-classes-per-file": "off", // list and list item in one file

    "no-console": "off", // console is good
    "no-else-return": "off", // returns from promises
    "no-underscore-dangle": "off", // "private" _variables
    "no-unneeded-ternary": "off", // explicit to boolean, default assignment

    "operator-assignment": "off", // explicit x = x + 1 is good
    "padded-blocks": "off", // no real benefit
    "prefer-object-spread": "off", // spread if often confusing
    "space-in-parens": "off", // spaces don't hurt

    "import/no-useless-path-segments": "off", // ../ is easier to copy to another file
    "import/prefer-default-export": "off", // disagree
    "react/jsx-boolean-value": "off", // explicit boolean attr
    "react/jsx-curly-newline": "off", // starting on the same line, ending on new
    "react/jsx-one-expression-per-line": "off", // <h3>Loading</h3>
    "react/prefer-stateless-function": "off", // opinion, like consistency of classes
    "react/sort-comp": "off", // sorting class methods is not helping
    "@typescript-eslint/quotes": "off", // like the "double quotes" :-)

    //----------------------------------------------------------------------------------------------
    /*
    ██████  ███████ ██████  ██    ██  ██████ ███████
    ██   ██ ██      ██   ██ ██    ██ ██      ██
    ██████  █████   ██   ██ ██    ██ ██      █████
    ██   ██ ██      ██   ██ ██    ██ ██      ██
    ██   ██ ███████ ██████   ██████   ██████ ███████
   */

    "comma-spacing": "warn",
    "eol-last": "warn",
    "key-spacing": "warn",
    "no-trailing-spaces": "warn",

    "import/order": "warn",
    "react/jsx-closing-bracket-location": "warn",
    "react/jsx-first-prop-new-line": "warn",
    "react/jsx-props-no-multi-spaces": "warn",
    "react/jsx-tag-spacing": "warn",
    "react/self-closing-comp": "warn",

    "jsx-a11y/click-events-have-key-events": "warn", // fix accessability later
    "jsx-a11y/no-noninteractive-element-interactions": "warn",

    "@typescript-eslint/no-unsafe-assignment": "warn", // for temporary unsafe hacks
    "@typescript-eslint/no-unsafe-member-access": "warn", // --''--
    "@typescript-eslint/no-unused-vars": "warn", // see tsconfig noUnusedLocals
    "@typescript-eslint/space-infix-ops": "warn", // this is just formatting

    //----------------------------------------------------------------------------------------------
    /*
    ██████  ███████  ██████  ██████  ██████
    ██   ██ ██      ██      ██    ██ ██   ██
    ██   ██ █████   ██      ██    ██ ██████
    ██   ██ ██      ██      ██    ██ ██   ██
    ██████  ███████  ██████  ██████  ██   ██
   */

    "@typescript-eslint/naming-convention": [
        1,
        {
            // allow snake_case and _underscores
            selector: "default",
            format: ["camelCase"],
        },
        {
            selector: "variable", // var, let, const
            format: ["camelCase", "UPPER_CASE", "snake_case"],
            leadingUnderscore: "allow",
        },
        {
            selector: "property", // object, class, or object type property
            format: ["camelCase", "UPPER_CASE", "snake_case"],
            leadingUnderscore: "allow",
        },
        {
            selector: "typeProperty", // object type property
            format: ["camelCase", "UPPER_CASE", "snake_case"],
            leadingUnderscore: "allow",
        },
        {
            selector: "parameter", // function parameter
            format: ["camelCase", "UPPER_CASE", "snake_case"],
            leadingUnderscore: "allow",
        },
        {
            selector: "function", // named function declaration or expression
            format: ["camelCase"],
            leadingUnderscore: "allow",
        },
        {
            selector: "method", // object, class or object type method
            format: ["camelCase"],
            leadingUnderscore: "allow",
        },
        {
            selector: "accessor", // get, set
            format: ["camelCase"],
            leadingUnderscore: "allow",
        },
        {
            selector: "typeLike", // class, interface, typeAlias, enum, typeParam
            format: ["PascalCase"],
        },
    ],
};
