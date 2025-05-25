import fs from "node:fs"
import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import checker from "vite-plugin-checker"

function getComponentEntries() {
  const dir = path.resolve(__dirname, "src/components")
  const entries: Record<string, string> = {}
  fs.readdirSync(dir).forEach((name) => {
    const entry = path.join(dir, name, "index.ts")
    if (fs.existsSync(entry)) {
      entries[name] = entry
    }
  })
  return entries
}

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath: path.resolve(__dirname, "tsconfig.typecheck.json"),
      },
    }),
  ],
  assetsInclude: ["**/*.webp"],
  css: {
    modules: {
      // Allows for BEM-friendly CSS module naming
      generateScopedName: "[local]",
    },
    preprocessorOptions: {
      scss: {
        includePaths: [path.resolve(__dirname, 'src')],
        additionalData: `
          @use "@/styles/designsystem/functions.scss" as *;
          @use "@/styles/designsystem/keyframes.scss" as *;
          @use "@/styles/designsystem/mixins.scss" as *;
          @use "@/styles/designsystem/config.scss" as *;
          @use "@/styles/ui/mixins.scss" as *;
        `,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@hugeicons": path.resolve(
        __dirname,
        "node_modules/hugeicons-react/dist/esm/icons",
      ),
    },
  },
  build: {
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "prokodo-ui",
      fileName: format => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // Avoid bundling peer dependencies
      external: [
        "react",
        "react-dom",
        "react-bem-helper",
        "dayjs",
        "@mui/base",
        "react-markdown",
        "remark-gfm",
        "remark-breaks",
        /^hugeicons-react\/dist\/esm\/icons\/.*\.js$/,
        "@googlemaps/js-api-loader",
        "@lottiefiles/dotlottie-react",
      ],
      input: {
        index: path.resolve(__dirname, "src/index.ts"),
        ...getComponentEntries() // see below
      },
      output: {
        sourcemap: false,
        dir: "dist",
        entryFileNames: chunkInfo =>
          chunkInfo.name === "index" ? "index.[format].js" : "components/[name].js",
        chunkFileNames: "components/[name]-[hash].js",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
})
