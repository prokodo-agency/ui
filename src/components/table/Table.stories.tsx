import { Table } from "./Table"

import type {
  TableProps,
  TableHeaderCellProps,
  TableRowProps,
} from "./Table.model"
import type { IconProps } from "../icon"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Table> = {
  title: "prokodo/common/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

// Sample header definitions
const sampleHeader: TableHeaderCellProps[] = [
  { label: "Product" },
  { label: "Price" },
  { label: "Quantity" },
  { label: "Total" },
]

// Sample body definitions without icons
const sampleBody: TableRowProps[] = [
  {
    cells: [
      { id: "1-1", label: "Apple" },
      { id: "1-2", label: "$1.00" },
      { id: "1-3", label: "3" },
      { id: "1-4", label: "$3.00" },
    ],
  },
  {
    cells: [
      { id: "2-1", label: "Banana" },
      { id: "2-2", label: "$0.50" },
      { id: "2-3", label: "5" },
      { id: "2-4", label: "$2.50" },
    ],
  },
  {
    cells: [
      { id: "3-1", label: "Cherry" },
      { id: "3-2", label: "$2.00" },
      { id: "3-3", label: "2" },
      { id: "3-4", label: "$4.00" },
    ],
  },
]

// Sample body definitions with an icon in the first column
const sampleBodyWithIcons: TableRowProps[] = [
  {
    cells: [
      {
        id: "1-1",
        label: "Apple",
        icon: {
          name: "StarIcon",
          color: "#FFD700",
          className: "",
        } as IconProps,
      },
      { id: "1-2", label: "$1.00" },
      { id: "1-3", label: "3" },
      { id: "1-4", label: "$3.00" },
    ],
  },
  {
    cells: [
      {
        id: "2-1",
        label: "Banana",
        icon: {
          name: "HeartCheckIcon",
          color: "#0000FF",
          className: "",
        } as IconProps,
      },
      { id: "2-2", label: "$0.50" },
      { id: "2-3", label: "5" },
      { id: "2-4", label: "$2.50" },
    ],
  },
  {
    cells: [
      {
        id: "3-1",
        label: "Cherry",
        icon: {
          name: "ThumbsDownIcon",
          color: "#008000",
          className: "",
        } as IconProps,
      },
      { id: "3-2", label: "$2.00" },
      { id: "3-3", label: "2" },
      { id: "3-4", label: "$4.00" },
    ],
  },
]

export const Default: Story = {
  args: {
    id: "default-table",
    title: "Fruit Prices",
    content: "Below is a simple price list for selected fruits.",
    ariaLabel: "Price table of fruits",
    caption: "Updated as of 2023-12-01",
    header: sampleHeader,
    body: sampleBody,
    type: "single",
  } as TableProps,
}

export const WithIcons: Story = {
  args: {
    id: "table-with-icons",
    title: "Fruit Prices (With Icons)",
    content: "Here each fruit row has a status icon on the left.",
    ariaLabel: "Price table of fruits with status icons",
    caption: "Updated as of 2023-12-01",
    header: sampleHeader,
    body: sampleBodyWithIcons,
    type: "single",
  } as TableProps,
}

export const DoubleType: Story = {
  args: {
    id: "double-table",
    title: "Monthly Sales",
    content: "Sales figures first column is a row header (scope=row).",
    ariaLabel: "Sales table with row headers",
    caption: "Fiscal year Q4 2023",
    header: [
      { label: "" }, // Empty top-left, since first column is a row header
      { label: "January" },
      { label: "February" },
      { label: "March" },
    ],
    body: [
      {
        cells: [
          { label: "North Region" },
          { label: "$10,000" },
          { label: "$12,000" },
          { label: "$9,000" },
        ],
      },
      {
        cells: [
          { label: "South Region" },
          { label: "$8,500" },
          { label: "$9,300" },
          { label: "$11,200" },
        ],
      },
      {
        cells: [
          { label: "West Region" },
          { label: "$9,700" },
          { label: "$10,400" },
          { label: "$8,900" },
        ],
      },
    ],
    type: "double",
  } as TableProps,
}
