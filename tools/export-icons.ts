import { readdir, readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { parse } from "acorn"
import * as walk from "acorn-walk"

const ICONS_DIR = path.resolve(
  "node_modules/@hugeicons/core-free-icons/dist/esm",
)
const OUTPUT_DIR = path.resolve("assets/icons")
const TYPES_PATH = path.resolve("src/components/icon/IconList.ts")

await mkdir(OUTPUT_DIR, { recursive: true })

const pascalToSnakeIcon = (name: string): string =>
  name
    .replace(/Icon$/, "")
    // fooBar → foo_Bar
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    // foo1 → foo_1
    .replace(/([a-zA-Z])([0-9])/g, "$1_$2")
    .toLowerCase() + "_icon"

const files = (await readdir(ICONS_DIR)).filter(
  f => f.endsWith(".js") && f !== "index.js",
)

const pascalNames: string[] = []
const seen = new Set<string>()

for (const file of files) {
  const filePath = path.join(ICONS_DIR, file)
  const code = await readFile(filePath, "utf-8")

  const ast = parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
  })

  let nodesArrayLiteral: any = null
  let iconVarName: string | null = null

  walk.simple(ast, {
    VariableDeclarator(node: any) {
      // const AbacusIcon = [...]
      if (
        node.id?.type === "Identifier" &&
        node.id.name.endsWith("Icon") &&
        node.init?.type === "ArrayExpression"
      ) {
        iconVarName = node.id.name
        nodesArrayLiteral = node.init
      }
    },
  })

  if (!nodesArrayLiteral) {
    console.warn(`❌ Could not extract nodes from ${file}`)
    continue
  }

  if (!iconVarName) {
    console.warn(`❌ Could not determine icon name from ${file}`)
    continue
  }

  const pascal = iconVarName // AbacusIcon
  if (seen.has(pascal)) continue
  seen.add(pascal)
  pascalNames.push(pascal)

  const base = pascalToSnakeIcon(pascal) // abacus_icon

  const nodes: [string, Record<string, string>][] =
    nodesArrayLiteral.elements.map((el: any) => {
      const tag = el.elements[0].value
      const attrs: Record<string, string> = {}
      for (const prop of el.elements[1].properties) {
        const key = prop.key.name || prop.key.value
        const value = prop.value.value
        attrs[key] = value
      }
      return [tag, attrs]
    })

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">`,
    ...nodes.map(([tag, attrs]) => {
      const attrString = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")
      return `  <${tag} ${attrString} />`
    }),
    `</svg>`,
  ].join("\n")

  await writeFile(path.join(OUTPUT_DIR, `${base}.svg`), svg, "utf-8")
}

await writeFile(
  TYPES_PATH,
  `// Auto-generated, do not edit manually.\n\nexport const ICON_NAMES =[\n${pascalNames.map(name => `  "${name}",`).join("\n")}\n] as const\n
export type IconName = typeof ICON_NAMES[number]
  `,
)

console.log(`✅ Exported ${pascalNames.length} SVG icons to assets/icons`)
console.log(`✅ Generated IconName union type`)
