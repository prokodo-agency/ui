import { useState } from "react"

import { Grid, GridRow } from "@/components/grid"
import { Headline } from "@/components/headline"
import { Pagination } from "@/components/pagination"
import { PostTeaser } from "@/components/post-teaser"

import type { Meta, StoryObj } from "@storybook/react-vite"

const POSTS = [
  {
    slug: "app-router-intro",
    title: "Getting started with Next.js App Router",
    excerpt:
      "A practical introduction to the App Router, React Server Components, and the new layouts model.",
    category: "Architecture",
    date: "2025-11-01",
  },
  {
    slug: "core-web-vitals",
    title: "Optimising Core Web Vitals in Next.js",
    excerpt:
      "Techniques for improving LCP, INP, and CLS — from image loading strategies to streaming SSR.",
    category: "Performance",
    date: "2025-10-15",
  },
  {
    slug: "seo-metadata-api",
    title: "Metadata API & hreflang for multi-locale apps",
    excerpt:
      "Set up canonical URLs, Open Graph tags, and hreflang for international Next.js projects.",
    category: "SEO",
    date: "2025-09-30",
  },
  {
    slug: "server-actions",
    title: "Server Actions & useActionState in Next.js 15",
    excerpt:
      "How to handle form submissions, mutations, and optimistic updates with Server Actions.",
    category: "Forms",
    date: "2025-09-01",
  },
  {
    slug: "caching-strategies",
    title: "Caching strategies with fetch and ISR",
    excerpt:
      "Deep dive into Next.js caching layers — request memoisation, Data Cache, and on-demand revalidation.",
    category: "Performance",
    date: "2025-08-20",
  },
  {
    slug: "middleware-guide",
    title: "Middleware patterns for authentication & i18n",
    excerpt:
      "Use Next.js Middleware to protect routes, redirect based on locale, and inject request headers.",
    category: "Architecture",
    date: "2025-07-15",
  },
]

const PAGE_SIZE = 3

const meta = {
  title: "prokodo/patterns/BlogCardGrid",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Blog card grid pattern with responsive layout and pagination. " +
          "Uses `Grid`, `PostTeaser`, and `Pagination`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function BlogGridDemo() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(POSTS.length / PAGE_SIZE)
  const paged = POSTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div
      style={{
        maxWidth: "960px",
        width: "100%",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <Headline style={{ marginTop: 0 }} type="h1">
        Blog
      </Headline>
      <Grid spacing={2}>
        {paged.map(post => (
          <GridRow key={post.slug} lg={4} sm={6} xs={12}>
            <PostTeaser
              category={post.category}
              content={post.excerpt}
              date={post.date}
              locale="en"
              redirect={{ href: `#${post.slug}`, label: "Read" }}
              title={{ content: post.title }}
            />
          </GridRow>
        ))}
      </Grid>
      {totalPages > 1 && (
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <BlogGridDemo />,
}

export const SingleCard: Story = {
  parameters: {
    layout: "centered",
  },
  render: () => (
    <div style={{ maxWidth: "360px" }}>
      <PostTeaser
        category="Architecture"
        content="A practical introduction to the App Router, React Server Components, and the new layouts model."
        date="2025-11-01"
        locale="en"
        redirect={{ href: "#app-router-intro", label: "Read" }}
        title={{ content: "Getting started with Next.js App Router" }}
      />
    </div>
  ),
}
