import type { SidebarsConfig } from "@docusaurus/plugin-content-docs"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const components: Array<{
  name: string
  slug: string
  category: string
}> = require("../docs/_data/components.json")

// Fixed category render order
const CATEGORY_ORDER = [
  "form",
  "layout",
  "navigation",
  "content",
  "feedback",
  "media",
  "utility",
] as const

type Category = (typeof CATEGORY_ORDER)[number]

// Group components by category, sorted A-Z within each group
const byCategory: Record<Category, typeof components> = Object.fromEntries(
  CATEGORY_ORDER.map(cat => [
    cat,
    components
      .filter(c => c.category === cat)
      .sort((a, b) => a.name.localeCompare(b.name)),
  ]),
) as Record<Category, typeof components>

const componentCategories = CATEGORY_ORDER.filter(
  cat => byCategory[cat].length > 0,
).map(cat => ({
  type: "category" as const,
  label: cat.charAt(0).toUpperCase() + cat.slice(1),
  collapsed: false,
  items: byCategory[cat].map(c => `components/${c.slug}`),
}))

const sidebars: SidebarsConfig = {
  uiSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "👋 Introduction",
    },
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "getting-started/installation",
        "getting-started/quick-start",
        "getting-started/theming",
      ],
    },
    {
      type: "doc",
      id: "learn",
      label: "Learn",
    },
    {
      type: "category",
      label: "Patterns",
      collapsed: true,
      items: [
        "patterns/dashboard-layout",
        "patterns/react-data-table-pagination-sorting-filtering",
        "patterns/settings-page-ui",
        "patterns/login-otp-form",
        "patterns/blog-card-grid",
        "patterns/loading-skeleton-empty-states",
      ],
    },
    {
      type: "category",
      label: "Components",
      collapsed: false,
      items: ["components/overview", ...componentCategories],
    },
    {
      type: "doc",
      id: "design-tokens",
      label: "🎨 Design Tokens",
    },
    {
      type: "doc",
      id: "aic-pattern",
      label: "⚡ AIC Pattern",
    },
    {
      type: "doc",
      id: "migration",
      label: "🔄 Migration",
    },
    {
      type: "doc",
      id: "versions",
      label: "🏷 Versions",
    },
    {
      type: "doc",
      id: "changelog",
      label: "📋 Changelog",
    },
  ],
}

export default sidebars
