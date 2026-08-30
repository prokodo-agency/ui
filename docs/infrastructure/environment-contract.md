# Environment contract

The library has no product infrastructure or server-secret runtime. ENV use is limited to build, Storybook, Cypress/Chromatic and documented public library flags. `.github/workflows` and `cypress.config.ts` are provisioning/reference sources.

The scanner processes names and references only and excludes credential files. Any new secret-like browser/public name blocks readiness. Publishing tokens remain GitHub-managed and must never enter artifacts or local fixtures.
