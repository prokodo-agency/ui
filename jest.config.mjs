// jest.config.mjs
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { pathsToModuleNameMapper } from "ts-jest"

const __dirname = dirname(fileURLToPath(import.meta.url))

const tsconfig = JSON.parse(
  readFileSync(join(__dirname, "tsconfig.json"), "utf8"),
)

const tsConfigPaths = tsconfig.compilerOptions.paths ?? {}
const tsConfigBaseUrl = `<rootDir>/${tsconfig.compilerOptions.baseUrl}`

export default {
  transform: {
    "^.+\\.(ts|tsx|js|jsx|mjs)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "\\.svg$": "<rootDir>/src/tests/mocks/svgr.ts",
    "\\.(jpg|jpeg|png|gif|webp|avif|ico)$":
      "<rootDir>/src/tests/mocks/image.ts",
    ...pathsToModuleNameMapper(tsConfigPaths, {
      prefix: tsConfigBaseUrl,
    }),
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!.*\\.(mjs|jsx?|tsx?)$)"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  collectCoverage: true,
  setupFilesAfterEnv: ["./jest.setup.ts"],
}
