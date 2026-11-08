import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

export function verifyReleaseRequest({
  event,
  ref,
  expectedVersion,
  commitMessage,
  packageName,
  packageVersion,
}) {
  if (ref !== "refs/heads/main") throw new Error("release_main_required")
  const validVersion =
    typeof packageVersion === "string" &&
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(packageVersion)?.[0] ===
      packageVersion
  if (packageName !== "@prokodo/ui" || !validVersion) {
    throw new Error("release_package_invalid")
  }
  if (event === "workflow_dispatch") {
    if (expectedVersion !== packageVersion)
      throw new Error("release_exact_version_required")
  } else if (event === "push") {
    if (!commitMessage?.startsWith("chore(release):"))
      throw new Error("release_bump_commit_required")
  } else {
    throw new Error("release_event_invalid")
  }
  return { version: packageVersion }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [event, ref, expectedVersion, commitMessage] = process.argv.slice(2)
  const pkg = JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
  )
  process.stdout.write(
    `${JSON.stringify(
      verifyReleaseRequest({
        event,
        ref,
        expectedVersion,
        commitMessage,
        packageName: pkg.name,
        packageVersion: pkg.version,
      }),
    )}\n`,
  )
}
