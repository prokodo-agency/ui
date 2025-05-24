const fs = require("fs");
const path = require("path");

const NODE_ICONS_DIR = path.resolve(__dirname, "../node_modules/hugeicons-react/dist/esm/icons");
const ICONS_MAP_PATH = path.resolve(__dirname, "../src/components/icon/iconsMap.ts");

const toCamelCase = (str) =>
  str.replace(/_icon$/, "").split(/[_-]/).map((p, i) =>
    i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)).join("");

const files = fs.readdirSync(NODE_ICONS_DIR).filter(f => f.endsWith(".js"));
const entries = files.map(file => {
  const name = toCamelCase(file.replace(/\.js$/, ""));
  return `  "${name}_icon": () => import("hugeicons-react/dist/esm/icons/${file}")`;
});

fs.writeFileSync(
  ICONS_MAP_PATH,
  `// Auto-generated\nexport const ICONS = {\n${entries.join(",\n")}\n} as const;\n`
);

console.log(`✅ Generated iconsMap.ts with ${entries.length} entries`);
