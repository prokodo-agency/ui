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

const ICON_LOADERS_DIR = path.resolve(__dirname, "../src/components/icon/loaders")
fs.mkdirSync(ICON_LOADERS_DIR, { recursive: true })

const toPascalCase = str =>
  str
    .replace(/_icon$/, "")
    .split(/[_-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") + "Icon"

const files = fs.readdirSync(NODE_ICONS_DIR).filter(f => f.endsWith(".js"))
const seen = new Set()
const pascalNames = []
const uniqueFiles = []

files.forEach(file => {
  const base = file.replace(/\.js$/, "")
  const pascal = toPascalCase(base)
  if (!seen.has(pascal)) {
    seen.add(pascal)
    pascalNames.push(pascal)
    uniqueFiles.push({ file, base })
  }
})

// 1. Schreibe IconName-Union-Typ
fs.writeFileSync(
  ICONS_TYPES_PATH,
  `// Auto-generated, do not edit manually.\n\nexport type IconName =\n${pascalNames
    .map(name => `  | "${name}"`)
    .join("\n")}\n`
)

// 2. Icons kopieren & Importpfade anpassen
uniqueFiles.forEach(({ file }) => {
  const srcPath = path.join(NODE_ICONS_DIR, file)
  const tsFileName = file.replace(/\.js$/, ".ts")
  const destPath = path.join(ICONS_VENDOR_DIR, tsFileName)

  let content = fs.readFileSync(srcPath, "utf-8")

  content = content.replace(
    /import\s+(\w+)\s+from\s*['"]\.\.\/create-hugeicon-component\.js['"]/g,
    'import $1 from "./create-hugeicon-component"'
  )

  fs.writeFileSync(destPath, content)
})

// 3. create-hugeicon-component.ts
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

// 4. defaultAttributes
const NODE_DEFAULT_ATTR = path.resolve(
  __dirname,
  "../node_modules/hugeicons-react/dist/esm/defaultAttributes.js"
)
const VENDOR_DEFAULT_ATTR = path.join(ICONS_VENDOR_DIR, "defaultAttributes.js")
fs.copyFileSync(NODE_DEFAULT_ATTR, VENDOR_DEFAULT_ATTR)

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

// 5. Typed loader files
files.forEach((file) => {
  const snakeName = file.replace(/\.js$/, "")
  const pascalName = toPascalCase(snakeName)
  const loaderPath = path.join(ICON_LOADERS_DIR, `${pascalName}.ts`)
  const importPath = `../../../vendor/hugeicons/${snakeName}`

  fs.writeFileSync(
    loaderPath,
    `// Auto-generated loader for ${pascalName}
import type { FC } from "react"
import type { IconProps } from "../Icon.model"
import Component from "${importPath}"
export default Component as FC<IconProps>
`
  )
})

// 6. getIconLoader.ts
const GET_ICON_LOADER_PATH = path.resolve(__dirname, "../src/components/icon/getIconLoader.ts")

fs.writeFileSync(
  GET_ICON_LOADER_PATH,
  `// Auto-generated dynamic icon loader
import type { IconProps } from "./Icon.model"
import type { IconName } from "./icons"
import type { FC } from "react"

export const getIconLoader = (name: IconName): (() => Promise<{ default: FC<IconProps> }>) | null => {
  switch (name) {
${pascalNames.map(name => `    case "${name}": return () => import("./loaders/${name}");`).join("\n")}
    default: return null
  }
}
`
)

console.log(`✅ Copied ${files.length} icons, generated typed loaders, and getIconLoader.ts`)
