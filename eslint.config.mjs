import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

/* eslint-disable no-redeclare */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* eslint-enable no-redeclare */

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/node_modules/", "**/lib/"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    // "airbnb-base",
    "prettier",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 12,
        sourceType: "commonjs",
    },

    settings: {
        // "import/extensions": [".js", ".jsx", ".ts", ".tsx"],

        // "import/resolver": {
        //     node: {
        //         extensions: [".js", ".jsx", ".ts", ".tsx"],
        //     },

        //     typescript: {},
        // },
    },

    rules: {
        // "import/prefer-default-export": "off",

        // "import/extensions": ["error", "ignorePackages", {
        //     js: "never",
        //     jsx: "never",
        //     ts: "never",
        //     tsx: "never",
        // }],

        "no-console": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
        "no-param-reassign": "off",
    },
}];