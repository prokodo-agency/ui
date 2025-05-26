export const isVite =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof import.meta !== "undefined" && Boolean((import.meta as any).glob)

const pascalToSnake = (input: string): string =>
  input
    .replace(/_icon$/i, "") // remove trailing "Icon" or "_icon"
    .replace(/([a-z])([A-Z0-9])/g, "$1_$2")
    .replace(/([0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()

export const getIconLoader = (
  name: string
): (() => Promise<{ default: React.FC<Record<string, unknown>> }>) | null => {
  const snakeName = pascalToSnake(name)

  if (isVite) {
    const icons = (import.meta as unknown as {
      glob: (
        pattern: string,
        options: { import: "default" }
      ) => Record<string, () => Promise<{ default: React.FC<Record<string, unknown>> }>>
    }).glob("/src/vendor/hugeicons/*.js", { import: "default" })

    const filePath = `/src/vendor/hugeicons/${snakeName}.js`
    return icons[filePath] ?? null
  }

  // Fallback for Storybook or Jest
  return () =>
    import(
      /* @vite-ignore */
      `../../vendor/hugeicons/${snakeName}.js`
    ) as Promise<{ default: React.FC<Record<string, unknown>> }>
}
