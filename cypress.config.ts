import { defineConfig } from "cypress"
import { installPlugin, onBeforeBrowserLaunch } from "@chromatic-com/cypress"

export default defineConfig({
  component: {
    watchForFileChanges: false,
    // allowCypressEnv: false — enable once @chromatic-com/cypress/support no longer
    // calls Cypress.env("assetDomains") internally (tracked upstream).
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "cypress/component/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/component.ts",
    indexHtmlFile: "cypress/support/component-index.html",
    setupNodeEvents(on, config) {
      // Chromatic integration requires ELECTRON_EXTRA_LAUNCH_ARGS=--remote-debugging-port=<n>
      // which is only set in CI. Only enable the plugin in that context.
      const hasPort = /--remote-debugging-port=\d+/.test(
        process.env.ELECTRON_EXTRA_LAUNCH_ARGS ?? "",
      )

      if (hasPort) {
        installPlugin(on, config)
        on("before:browser:launch", (browser, launchOptions) =>
          onBeforeBrowserLaunch(browser, launchOptions, config),
        )
      } else {
        // Register no-op Chromatic tasks so cy.task('prepareArchives') doesn't fail
        on("task", {
          prepareArchives() {
            return null
          },
          saveArchive() {
            return null
          },
        })
      }
      on("task", {
        logViolations(
          violations: Array<{
            id: string
            description: string
            nodes: unknown[]
          }>,
        ) {
          if (violations.length > 0) {
            console.error("\n  ♿ axe violations:")
            violations.forEach(v => {
              console.error(
                `     [${v.id}] ${v.description} (${v.nodes.length} node(s))`,
              )
            })
          }
          return null
        },
      })
    },
  },
})
