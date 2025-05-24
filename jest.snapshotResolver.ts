interface SnapshotResolver {
  testPathForConsistencyCheck: string
  resolveSnapshotPath: (testPath: string, snapshotExtension: string) => string
  resolveTestPath: (snapshotPath: string, snapshotExtension: string) => string
}

// Use the interface as the type for the exported object
const snapshotResolver: SnapshotResolver = {
  testPathForConsistencyCheck: "some/example.test.tsx",

  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath + snapshotExtension,

  resolveTestPath: (snapshotPath, snapshotExtension) =>
    snapshotPath.replace(snapshotExtension, ""),
}

export default snapshotResolver
