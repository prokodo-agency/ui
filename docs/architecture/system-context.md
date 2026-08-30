# UI system context

`prokodo-ui` publishes React components and CSS/type exports consumed independently by `prokodo-portal` and `prokodo-website`. `src/index.ts` and `package.json#exports` are the public boundary. Vite builds the package; Storybook/Chromatic documents and visually validates it.

Consumer source is never imported. The consumer-contract artifact reports Portal/Website when source, exports, peer dependencies or Changesets change. Each consumer must validate the candidate version in a separate PR/run.
