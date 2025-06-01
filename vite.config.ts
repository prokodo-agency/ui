import fs from "node:fs"
import path from "node:path"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"
import checker from "vite-plugin-checker"
import pkg from "./package.json"

function getComponentEntries() {
  const baseDir = path.resolve(__dirname, "src/components");
  const entries: Record<string, string> = {};
  fs.readdirSync(baseDir).forEach((name) => {
    const indexFile = path.join(baseDir, name, "index.ts");
    if (fs.existsSync(indexFile)) {
      const key = `components/${name}/index`;
      entries[key] = indexFile;
    }
  });
  return entries;
}

export default async () => {
  const { visualizer } = await import("rollup-plugin-visualizer");

  return defineConfig({
    define: {
      __PACKAGE_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [
      react(),
      visualizer({
        gzipSize: true,
        brotliSize: true, // if you want brotli as well
        open: !process.env.CI || process.env.CI === "false",
        filename: "stats.html",
      }),
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
      },
    },
    esbuild: {
      keepNames: true,
      minifySyntax: false,
    },
    build: {
      minify: false,
      sourcemap: false,
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "prokodo-ui",
        fileName: format => `index.${format}.js`,
        formats: ["es"],
      },
      rollupOptions: {
        // Avoid bundling peer dependencies
        external: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "react-bem-helper",
          "dayjs",
          "react-markdown",
          "remark-gfm",
          "remark-breaks",
          "@googlemaps/js-api-loader",
          "@lottiefiles/dotlottie-react",
        ],
        treeshake: {
          moduleSideEffects: false,
        },
        input: {
          index: path.resolve(__dirname, "src/index.ts"),
          ...getComponentEntries()
        },
        output: {
          sourcemap: false,
          dir: "dist",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          banner: chunk => {
            // Füge Direktive nur bei Dateien an, deren Pfad ".client." oder ".lazy." enthält
            return /(\.client\.|\.lazy\.)/.test(chunk.facadeModuleId ?? '')
              ? '"use client";'
              : '';
          },
        },
      },
    },
 });
};
