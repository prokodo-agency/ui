import { pathsToModuleNameMapper } from "ts-jest"

import { compilerOptions } from "./tsconfig.json"

const tsConfigPaths = compilerOptions.paths ?? {}
const tsConfigBaseUrl = `<rootDir>/${compilerOptions.baseUrl}`
const esModules = [
  "react-markdown",
  "vfile-message",
  "markdown-table",
  "unist-.*",
  "unified",
  "bail",
  "is-plain-obj",
  "trough",
  "remark-.*",
  "rehype-.*",
  "html-void-elements",
  "hast-util-.*",
  "zwitch",
  "hast-to-hyperscript",
  "hastscript",
  "web-namespaces",
  "mdast-util-.*",
  "escape-string-regexp",
  "micromark.*",
  "decode-named-character-reference",
  "character-entities",
  "property-information",
  "hast-util-whitespace",
  "space-separated-tokens",
  "comma-separated-tokens",
  "pretty-bytes",
  "ccount",
  "mdast-util-gfm",
  "gemoji",
  /** react-markdown 8.0.3 */
  "trim-lines",
  "jest-runtime",
  "vfile",
  /** react-markdown 7.2.1 */
  "longest-streak",
].join("|")

/**
 * @type {import("@jest/types").Config.InitialOptions}
 */
export default {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  collectCoverage: true,
  setupFilesAfterEnv: ["./jest.setup.ts"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "react-markdown":
      "<rootDir>/node_modules/react-markdown/react-markdown.min.js",
    "^@/public/json/animations/(.*)\\.json$":
      "<rootDir>/src/__mocks__/animations/$1.json",
    "\\.(css|scss|sass)$": "<rootDir>/node_modules/jest-css-modules",
    "\\.svg$": "<rootDir>/src/tests/mocks/svgr.ts",
    "\\.(jpg|jpeg|png|gif|webp|avif|ico)$":
      "<rootDir>/src/tests/mocks/image.ts",
    // This adds support for the TS compiler options `baseUrl` and `paths`.
    ...pathsToModuleNameMapper(tsConfigPaths, { prefix: tsConfigBaseUrl }),
  },
  moduleDirectories: ["node_modules", "src"],
  modulePaths: ["node_modules", tsConfigBaseUrl],
  testPathIgnorePatterns: ["node_modules", "cypress"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./jest.babel-config.json" },
    ],
  },
  transformIgnorePatterns: [
    `[/\\\\]node_modules[/\\\\](?!${esModules}).+\\.(js|jsx|mjs|cjs|ts|tsx)$`,
  ],
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  snapshotResolver: "./jest.snapshotResolver.js",
}
