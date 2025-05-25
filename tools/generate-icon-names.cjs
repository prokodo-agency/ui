const fs = require("fs")
const path = require("path")

const NODE_ICONS_DIR = path.resolve(
  __dirname,
  "../node_modules/hugeicons-react/dist/esm/icons",
)
const ICONS_MAP_PATH = path.resolve(
  __dirname,
  "../src/components/icon/iconsMap.ts",
)

const toPascalCase = str =>
  str
    .replace(/_icon$/, "")
    .split(/[_-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") + "Icon"

const files = fs.readdirSync(NODE_ICONS_DIR).filter(f => f.endsWith(".js"))
const entries = files.map(file => {
  const name = toPascalCase(file.replace(/\.js$/, ""))
  return `  "${name}": () => import("hugeicons-react/dist/esm/icons/${file}")`
})

fs.writeFileSync(
  ICONS_MAP_PATH,
  `// Auto-generated\nexport const ICONS = {\n${entries.join(",\n")}\n} as const;\n`,
)

console.log(`✅ Generated iconsMap.ts with ${entries.length} entries`)
