// eslint_rules.js

/* eslint-disable quote-props, key-spacing, no-multi-spaces, max-len */
/* eslint-disable @typescript-eslint/naming-convention */

module.exports = {
    /*

    .d8888b. .d8888b. 88d888b. .d8888b.
    88'  `"" 88'  `88 88'  `88 88ooood8
    88.  ... 88.  .88 88       88.  ...
    `88888P' `88888P' dP       `88888P'

    */

    "no-lonely-if": "off", //                                sometimes logic is easier to read this way
    "no-param-reassign": ["error", { props: false }], //     may modify fields in passed-in objects
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }], // usefull in loops
    "no-undef-init": "off", //                               no real benefit
    "no-void": ["error", { allowAsStatement: true }], //     explicitly void unused promises or function parameters
    "object-shorthand": ["error", "methods"], //             shorthand is confusing
    "prefer-destructuring": "off", //                        no real benefit

    // "@typescript-eslint/no-inferrable-types": "off", //   prefer explicit types
    // "@typescript-eslint/no-non-null-assertion": "off", // assertion is there for a reason!

    /*
                               dP   dP
                               88   88
    .d8888b. dP   .dP .d8888b. 88 d8888P .d8888b.
    Y8ooooo. 88   d8' 88ooood8 88   88   88ooood8
          88 88 .88'  88.  ... 88   88   88.  ...
    `88888P' 8888P'   `88888P' dP   dP   `88888P'

    */

    "import/no-mutable-exports": "off", //                   binding props
    "no-inner-declarations": "off", //                       functions in svelte script

    /*
                                 dP     dP   oo
                                 88     88
    88d888b. 88d888b. .d8888b. d8888P d8888P dP .d8888b. 88d888b.
    88'  `88 88'  `88 88ooood8   88     88   88 88ooood8 88'  `88
    88.  .88 88       88.  ...   88     88   88 88.  ... 88
    88Y888P' dP       `88888P'   dP     dP   dP `88888P' dP
    88
    dP
    */

    "comma-spacing": "warn",
    "eol-last": "warn",
    "key-spacing": "warn",
    "max-len": ["warn", { code: 120 }], //                   arbitrary compromise on page width
    "no-trailing-spaces": "warn",
    "object-curly-newline": ["error", { consistent: true }], // no rule, just consistency
    "operator-linebreak": "off", //                          prettier may break after "="
    "@typescript-eslint/brace-style": ["error", "1tbs", { allowSingleLine: true }], // for shorter code
    "@typescript-eslint/comma-dangle": ["warn", "only-multiline"], // dangling commas for multi-line
    "@typescript-eslint/indent": ["warn", 4, { SwitchCase: 1 }], // indent 4 spaces, don't indent .then()
    // flatTernaryExpressions: false,
    // ignoredNodes: ["TSTypeParameterInstantiation"],
    // ignoreComments: true,
    // MemberExpression: 0,

    /*
                   dP       dP
                   88       88
    .d8888b. .d888b88 .d888b88
    88'  `88 88'  `88 88'  `88
    88.  .88 88.  .88 88.  .88
    `88888P8 `88888P8 `88888P8

    */

    "arrow-parens": ["error", "always"], // require parens in (arg) => {...}, makes arrow functions more visible
    "function-paren-newline": ["error", "consistent"], //    consistent function call decoration
    "object-curly-spacing": ["warn", "always"], //           spacing: { looks: cleaner, easier: to_read }

    "import/extensions": [
        "warn", //                                           leave out js and ts extensions
        "always",
        { js: "never", jsx: "never", ts: "never", tsx: "never" },
    ],

    "@typescript-eslint/member-delimiter-style": [
        "error", //                                          semicolons all the way
        {
            multiline: { delimiter: "semi", requireLast: true },
            singleline: { delimiter: "semi", requireLast: true },
        },
    ],
    "@typescript-eslint/explicit-function-return-type": [
        "error", //                                          explicit return types
        {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: false,
            allowConciseArrowFunctionExpressionsStartingWithVoid: false,
        },
    ],
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

    /*
    oo
    dP .d8888b. 88d888b. .d8888b. 88d888b. .d8888b.
    88 88'  `88 88'  `88 88'  `88 88'  `88 88ooood8
    88 88.  .88 88    88 88.  .88 88       88.  ...
    dP `8888P88 dP    dP `88888P' dP       `88888P'
            .88
        d8888P
    */

    // "arrow-body-style": "off",   //                       allow explicit returns for promise chain
    "max-classes-per-file": "off", //                        list and list item in one file
    "@typescript-eslint/ban-ts-comment": "off", //           it is there on purpose
    "@typescript-eslint/restrict-template-expressions": "off", // complains about string[]

    "no-console": "off", //                                  console is good
    "no-else-return": "off", //                              returns from promises
    "no-underscore-dangle": "off", //                        "private" _variables
    "no-unneeded-ternary": "off", //                         explicit to boolean, default assignment

    "operator-assignment": "off", //                         explicit x = x + 1 is good
    "padded-blocks": "off", //                               no real benefit
    "prefer-object-spread": "off", //                        spread if often confusing
    "space-in-parens": "off", //                             spaces don't hurt

    "import/no-useless-path-segments": "off", //             ../ is easier to copy to another file
    "import/prefer-default-export": "off", //                disagree

    /*

    .8888b oo             dP            dP
    88   "                88            88
    88aaa  dP dP.  .dP    88 .d8888b. d8888P .d8888b. 88d888b.
    88     88  `8bd8'     88 88'  `88   88   88ooood8 88'  `88
    88     88  .d88b.     88 88.  .88   88   88.  ... 88
    dP     dP dP'  `dP    dP `88888P8   dP   `88888P' dP

    */

    "import/order": "warn",
    "jsx-a11y/click-events-have-key-events": "warn", //      allows to fix accessability later
    "jsx-a11y/no-noninteractive-element-interactions": "warn",

    "@typescript-eslint/lines-between-class-members": [
        "warn", //                                           consize blocks are easier to read
        "always",
        { exceptAfterSingleLine: true },
    ],
    "@typescript-eslint/no-unsafe-assignment": "warn", //    for temporary unsafe hacks
    "@typescript-eslint/no-unsafe-member-access": "warn", // --''--
    "@typescript-eslint/no-unused-vars": "warn", //          see tsconfig noUnusedLocals
    "@typescript-eslint/space-infix-ops": "warn", //         this is just formatting
    "@typescript-eslint/quotes": ["warn", "double", { avoidEscape: true }],
    "@typescript-eslint/explicit-module-boundary-types": "warn",

    /*
          dP
          88
    .d888b88 .d8888b. .d8888b. .d8888b. 88d888b.
    88'  `88 88ooood8 88'  `"" 88'  `88 88'  `88
    88.  .88 88.  ... 88.  ... 88.  .88 88
    `88888P8 `88888P' `88888P' `88888P' dP

    */

    "@typescript-eslint/naming-convention": [
        "warn",
        {
            selector: "default", //                          start with camelCase
            format: ["camelCase"],
        },
        {
            selector: "variable", //                         var, let, const
            format: ["camelCase", "UPPER_CASE", "snake_case"],
            leadingUnderscore: "allow",
        },
        {
            selector: "property", //                         object, class, or object type property
            format: ["camelCase", "UPPER_CASE", "snake_case"],
            leadingUnderscore: "allow",
        },
        {
            selector: "typeProperty", //                     object type property
            format: ["camelCase", "UPPER_CASE", "snake_case"],
            leadingUnderscore: "allow",
        },
        {
            selector: "parameter", //                        function parameter
            format: ["camelCase", "UPPER_CASE", "snake_case"],
            leadingUnderscore: "allow",
        },
        {
            selector: "function", //                         named function declaration or expression
            format: ["camelCase"],
            leadingUnderscore: "allow",
        },
        {
            selector: "method", //                           object, class or object type method
            format: ["camelCase"],
            leadingUnderscore: "allow",
        },
        {
            selector: "accessor", //                         get, set
            format: ["camelCase"],
            leadingUnderscore: "allow",
        },
        {
            selector: "typeLike", //                         class, interface, typeAlias, enum, typeParam
            format: ["PascalCase"],
        },
    ],
};
