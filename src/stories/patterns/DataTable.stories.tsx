import { useState } from "react"

import { Input } from "@/components/input"
import { Pagination } from "@/components/pagination"
import { Select } from "@/components/select"
import { Table } from "@/components/table"

import type { Meta, StoryObj } from "@storybook/react-vite"

const ALL_USERS = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "Viewer" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "Editor" },
  { id: "5", name: "Eve Davis", email: "eve@example.com", role: "Viewer" },
  { id: "6", name: "Frank Wilson", email: "frank@example.com", role: "Admin" },
  { id: "7", name: "Grace Lee", email: "grace@example.com", role: "Viewer" },
]

const meta = {
  title: "prokodo/patterns/DataTable",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Data table pattern with search filter, rows-per-page selector, and pagination. " +
          "Uses `Table`, `Pagination`, `Input`, and `Select`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function DataTableDemo() {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(3)

  const filtered = ALL_USERS.filter(
    u =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  )
  const totalPages = Math.ceil(filtered.length / pageSize)
  const currentPage = Math.min(page, totalPages || 1)
  const paged = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "700px" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <Input
            label="Search"
            name="search"
            placeholder="Filter by name or email…"
            value={query}
            onChange={e =>
              setQuery((e as React.ChangeEvent<HTMLInputElement>).target.value)
            }
          />
        </div>
        <div style={{ minWidth: "140px" }}>
          <Select
            id="page-size-select"
            label="Rows per page"
            value={String(pageSize)}
            items={[
              { value: "3", label: "3 / page" },
              { value: "5", label: "5 / page" },
              { value: "7", label: "7 / page" },
            ]}
            onChange={(_, v) => {
              setPageSize(Number(v as string))
              setPage(1)
            }}
          />
        </div>
      </div>

      <Table
        ariaLabel="Users"
        caption="User list"
        header={[{ label: "Name" }, { label: "Email" }, { label: "Role" }]}
        body={paged.map(u => ({
          cells: [{ label: u.name }, { label: u.email }, { label: u.role }],
        }))}
      />

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={p => setPage(p)}
          />
        </div>
      )}

      {filtered.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "var(--ifm-color-emphasis-600)",
          }}
        >
          No users match &ldquo;{query}&rdquo;.
        </p>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <DataTableDemo />,
}
