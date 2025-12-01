import { glob } from "glob"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.join(__dirname, "..", "dist")

async function run() {
  // Find all *.module.css files inside dist/components/...
  const files = await glob("components/**/*.module.css", {
    cwd: distDir,
  })

  await Promise.all(
    files.map(async rel => {
      const abs = path.join(distDir, rel)
      const css = await readFile(abs, "utf8")

      // Example: Headline.module.css → Headline.css
      const out = abs.replace(".module.css", ".css")
      await writeFile(out, css)
    }),
  )

  console.log(`✅ Duplicated ${files.length} .module.css files as global .css`)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
