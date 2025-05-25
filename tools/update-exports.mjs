import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const componentsDir = path.join(rootDir, 'src/components')
const packageJsonPath = path.join(rootDir, 'package.json')

// Load package.json
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

// Base export
const exportsField = {
  "./theme.css": "./dist/ui.css",
  '.': {
    types: './dist/types/index.d.ts',
    import: './dist/index.js',
  },
}

// Add per-component exports
const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

for (const name of components) {
  const entryFile = path.join(componentsDir, name, 'index.ts')
  if (!existsSync(entryFile)) continue

  exportsField[`./${name}`] = {
    import: `./dist/components/${name}/index.js`,
    types: `./dist/types/components/${name}/index.d.ts`,
  }
}

// Update package.json
pkg.exports = exportsField

// Write back
writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')
console.log(`✅ package.json "exports" updated with ${components.length} components.`)
