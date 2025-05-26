const fs = require("fs")
const path = require("path")

const NODE_ICONS_DIR = path.resolve(
  __dirname,
  "../node_modules/hugeicons-react/dist/esm/icons"
)

const ICONS_TYPES_PATH = path.resolve(
  __dirname,
  "../src/components/icon/icons.d.ts"
)

const ICONS_VENDOR_DIR = path.resolve(__dirname, "../src/vendor/hugeicons")

fs.mkdirSync(ICONS_VENDOR_DIR, { recursive: true })

const toPascalCase = str =>
  str
    .replace(/_icon$/, "")
    .split(/[_-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") + "Icon"

const files = fs.readdirSync(NODE_ICONS_DIR).filter(f => f.endsWith(".js"))
const pascalNames = files.map(file => toPascalCase(file.replace(/\.js$/, "")))

// 1. Schreibe IconName-Union-Typ
fs.writeFileSync(
  ICONS_TYPES_PATH,
  `// Auto-generated, do not edit manually.\n\nexport type IconName =\n${pascalNames
    .map(name => `  | "${name}"`)
    .join("\n")}\n`
)

// 2. Icons kopieren & Importpfade anpassen
files.forEach(file => {
  const srcPath = path.join(NODE_ICONS_DIR, file)
  const destPath = path.join(ICONS_VENDOR_DIR, file)

  let content = fs.readFileSync(srcPath, "utf-8")

  content = content.replace(
    /import\s+(\w+)\s+from\s*['"]\.\.\/create-hugeicon-component\.js['"]/g,
    'import $1 from "./create-hugeicon-component"'
  )

  fs.writeFileSync(destPath, content)
})

// 3. Lesbare helper-Datei schreiben (statt minified)
const helperTsPath = path.join(ICONS_VENDOR_DIR, "create-hugeicon-component.ts")
fs.writeFileSync(
  helperTsPath,
  `import { forwardRef, createElement } from "react"
import defaultAttributes from "./defaultAttributes"

export type IconProps = {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
} & React.SVGProps<SVGSVGElement>

const createIconComponent = (
  name: string,
  data: [string, Record<string, any>][]
) => {
  const Component = forwardRef<SVGSVGElement, IconProps>(
    (
      {
        color = "currentColor",
        size = 24,
        strokeWidth = 1.5,
        className = "",
        children,
        ...rest
      },
      ref
    ) => {
      const props = {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        strokeWidth,
        color,
        className,
        ...rest,
      }

      return createElement(
        "svg",
        props,
        ...(data?.map(([tag, attrs]) => createElement(tag, { key: attrs.key, ...attrs })) ?? []),
        ...(Array.isArray(children) ? children : [children])
      )
    }
  )

  Component.displayName = \`\${name}Icon\`
  return Component
}

export default createIconComponent
`
)

const NODE_DEFAULT_ATTR = path.resolve(
  __dirname,
  "../node_modules/hugeicons-react/dist/esm/defaultAttributes.js"
)
const VENDOR_DEFAULT_ATTR = path.join(ICONS_VENDOR_DIR, "defaultAttributes.js")
fs.copyFileSync(NODE_DEFAULT_ATTR, VENDOR_DEFAULT_ATTR)

// 4. defaultAttributes.d.ts stub erzeugen
const DEFAULT_ATTR_DTS = path.join(ICONS_VENDOR_DIR, "defaultAttributes.d.ts")
fs.writeFileSync(
  DEFAULT_ATTR_DTS,
  `// Auto-generated stub for hugeicons default attributes
declare const defaultAttributes: {
  xmlns: string
  fill: string
  stroke: string
  strokeLinecap: string
  strokeLinejoin: string
}
export default defaultAttributes
`
)

console.log(`✅ Copied ${files.length} icons, rewrote imports, and generated TypeScript helper.`)
