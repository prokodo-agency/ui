import globals from "globals"
import unusedImports from "eslint-plugin-unused-imports"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import typescriptParser from "@typescript-eslint/parser"
import typescriptPlugin from "@typescript-eslint/eslint-plugin"
import testingLibrary from "eslint-plugin-testing-library"
import jestDom from "eslint-plugin-jest-dom"
import storybook from "eslint-plugin-storybook"
import prettierConfig from "eslint-config-prettier"
import jest from "eslint-plugin-jest"
import importPlugin from "eslint-plugin-import"
import jsxA11y from "eslint-plugin-jsx-a11y"
import { fixupPluginRules } from "@eslint/compat"

export default [
  {
    ignores: [
      "**/coverage/",
      "**/node_modules/",
      "**/*.scss",
      "jest.d.ts",
      "postcss.config.js",
      "src/vendor/hugeicons/**",
      "src/components/icon/loaders/"
    ],
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      react,
      "react-hooks": fixupPluginRules(reactHooks),
      "jsx-a11y": jsxA11y,
      "unused-imports": unusedImports,
      import: importPlugin,
      "@typescript-eslint": typescriptPlugin,
      storybook,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        cache: true,
      },
      globals: {
        JSX: true,
        NodeJS: true,
        google: "readonly",
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      react: {
        version: "detect",
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      // Disable for App Router
      ...storybook.configs.recommended.rules,
      ...prettierConfig.rules,

      // React-specific rules for code quality
      "react/react-in-jsx-scope": "off", // Deprecated since react 17+, because of react-jsx resolution in tsconfig
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: "last",
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
      "react/no-unescaped-entities": "error",
      "react/no-array-index-key": "error",
      "react/no-multi-comp": ["error", { ignoreStateless: true }],
      "react/prop-types": "off", // Use TypeScript for prop validation

      // Import and order rules
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "src/**",
              group: "internal",
              position: "before",
            },
          ],
          "newlines-between": "always",
          warnOnUnassignedImports: true,
        },
      ],
      "import/no-cycle": ["error", { maxDepth: 2 }],
      "import/no-extraneous-dependencies": "error",
      "import/no-unresolved": "error",
      "import/newline-after-import": ["warn", { count: 1 }],

      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/strict-boolean-expressions": "warn",

      // Accessibility rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          labelComponents: [],
          labelAttributes: [],
          controlComponents: [],
          depth: 3,
        },
      ],
      "jsx-a11y/no-autofocus": "error",
      "jsx-a11y/no-static-element-interactions": "error",

      // Other best practices
      "no-trailing-spaces": ["error", { ignoreComments: false }],
      "no-unused-vars": "off", // Replaced by TypeScript rule
      "unused-imports/no-unused-imports": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "prefer-destructuring": [
        "error",
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      "no-duplicate-imports": "error",
      "arrow-body-style": ["error", "as-needed"],
    },
  },
  // TypeScript declaration files
  {
    files: ["**/*.d.ts"],
    rules: {
      "import/newline-after-import": "off",
    },
  },
  {
    files: ["src/**/*.test.*"],
    plugins: {
      jest,
      "testing-library": fixupPluginRules(testingLibrary),
      "jest-dom": jestDom,
    },
    rules: {
      ...jest.configs.recommended.rules,
      ...testingLibrary.configs.react.rules,
      ...jestDom.configs.recommended.rules,
      "react/display-name": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "testing-library/no-dom-import": ["error", "react"],
      "testing-library/prefer-presence-queries": "warn",
      "testing-library/no-manual-cleanup": "error",
    },
  },
]
