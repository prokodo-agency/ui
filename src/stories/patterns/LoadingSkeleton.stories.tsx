import { useState } from "react"

import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Chip } from "@/components/chip"
import { Skeleton } from "@/components/skeleton"

import type { Meta, StoryObj } from "@storybook/react-vite"

const MOCK_USERS = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "Viewer" },
]

const meta = {
  title: "prokodo/patterns/LoadingSkeleton",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Loading skeleton and empty state pattern using `Skeleton` and `Card`. " +
          "Toggle between loading, loaded, and empty states to preview all three.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/* ── Skeleton ─────────────────────────────────────────────────── */

function UserListSkeleton() {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading users…"
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: "1rem",
      }}
    >
      {["skeleton-1", "skeleton-2", "skeleton-3"].map(id => (
        <li
          key={id}
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
        >
          <Skeleton height="40px" variant="circular" width="40px" />
          <div style={{ flex: 1, display: "grid", gap: "0.4rem" }}>
            <Skeleton height="1rem" variant="text" width="55%" />
            <Skeleton height="0.875rem" variant="text" width="38%" />
          </div>
          <Skeleton height="1.75rem" variant="rectangular" width="72px" />
        </li>
      ))}
    </ul>
  )
}

/* ── Loaded list ──────────────────────────────────────────────── */

function UserList() {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: "1rem",
      }}
    >
      {MOCK_USERS.map(u => (
        <li
          key={u.id}
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
        >
          <div
            aria-hidden
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--pk-color-primary, #1976d2)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 700,
              flexShrink: 0,
              fontSize: "1rem",
            }}
          >
            {u.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{u.name}</div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--ifm-color-emphasis-600, #666)",
              }}
            >
              {u.email}
            </div>
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "0.25rem 0.5rem",
              background: "var(--ifm-color-emphasis-200, #eee)",
              borderRadius: "4px",
            }}
          >
            {u.role}
          </span>
        </li>
      ))}
    </ul>
  )
}

/* ── Empty state ─────────────────────────────────────────────── */

function EmptyState() {
  return (
    <div style={{ textAlign: "center" }}>
      <Card>
        <div style={{ padding: "3rem" }}>
          <h2 style={{ marginTop: 0 }}>No users yet</h2>
          <p
            style={{
              color: "var(--ifm-color-emphasis-600, #666)",
              marginBottom: "1.5rem",
            }}
          >
            Invite a team member to get started.
          </p>
          <Button color="primary" title="Invite user" variant="contained" />
        </div>
      </Card>
    </div>
  )
}

/* ── Composed demo ───────────────────────────────────────────── */

type ViewState = "loading" | "loaded" | "empty"

function LoadingSkeletonDemo() {
  const [state, setState] = useState<ViewState>("loading")

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <Chip
          color="primary"
          label="Loading"
          variant={state === "loading" ? "filled" : "outlined"}
          onClick={() => setState("loading")}
        />
        <Chip
          color="primary"
          label="Loaded"
          variant={state === "loaded" ? "filled" : "outlined"}
          onClick={() => setState("loaded")}
        />
        <Chip
          color="primary"
          label="Empty"
          variant={state === "empty" ? "filled" : "outlined"}
          onClick={() => setState("empty")}
        />
      </div>

      {state === "loading" && <UserListSkeleton />}
      {state === "loaded" && <UserList />}
      {state === "empty" && <EmptyState />}
    </div>
  )
}

export const Default: Story = {
  render: () => <LoadingSkeletonDemo />,
}

export const SkeletonOnly: Story = {
  render: () => (
    <div style={{ maxWidth: "500px" }}>
      <UserListSkeleton />
    </div>
  ),
}

export const EmptyStateOnly: Story = {
  render: () => (
    <div style={{ maxWidth: "480px" }}>
      <EmptyState />
    </div>
  ),
}
