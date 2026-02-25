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
  maxWorkers: "50%",
  coverageProvider: "babel",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.stories.{ts,tsx}",
    "!src/**/*.model.{ts,tsx}",
    "!src/tests/**",
    "!src/types/**",
    "!src/index.ts",
    "!src/constants/**",
    "!src/**/index.ts",
    "!src/**/*.d.ts",
    // Island infrastructure: createIsland is globally mocked in jest.setup.ts
    // so that React.lazy Suspense doesn't cause AggregateErrors across tests.
    // createLazyWrapper and useHydrationReady depend on IntersectionObserver /
    // React.lazy and are not testable in jsdom without extensive browser mocks.
    "!src/helpers/createIsland.tsx",
    "!src/helpers/createLazyWrapper.tsx",
    "!src/hooks/useHydrationReady.ts",
    // Pure generated data files — no logic, just constant exports.
    "!src/components/icon/IconList.ts",
    "!src/components/lottie/LottieAnimations.ts",
    // Vite-specific Quill CSS import (`?inline`) that cannot run in Jest.
    "!src/components/RTE/RTE.theme.ts",
  ],
  // Hard-gate: CI fails if any metric drops below 100%.
  // This turns coverage from a report into an enforced contract.
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  setupFilesAfterEnv: ["./jest.setup.ts"],
}
