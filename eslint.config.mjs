import globals from "globals";
import pluginJs from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node    
      }
    },
    plugins: {
      prettier: pluginPrettier 
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "prettier/prettier": "error",
       "semi": ["error", "always"],
       "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  },
  configPrettier
];
