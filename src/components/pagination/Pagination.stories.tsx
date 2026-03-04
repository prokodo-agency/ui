import { Pagination } from "@/components/pagination"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/navigation/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pagination-Komponente im Island-Pattern. Unterstützt Ellipsis, a11y (aria-current) und Pending/Disabled States.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    page: { control: { type: "number", min: 1, step: 1 } },
    totalPages: { control: { type: "number", min: 1, step: 1 } },
    siblingCount: { control: { type: "number", min: 0, max: 3, step: 1 } },
    boundaryCount: { control: { type: "number", min: 0, max: 2, step: 1 } },
    color: {
      options: [
        undefined,
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
      ],
      control: { type: "radio" },
    },
    disabled: { control: "boolean" },
    isPending: { control: "boolean" },
    readOnly: { control: "boolean" },
    translations: { table: { disable: true } },
    onPageChange: { action: "page-changed", table: { disable: true } },
    onPrev: { action: "prev", table: { disable: true } },
    onNext: { action: "next", table: { disable: true } },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    page: 2,
    totalPages: 363,
    siblingCount: 1,
    boundaryCount: 1,
  },
}

export const Primary: Story = {
  args: {
    page: 5,
    totalPages: 30,
    color: "primary",
    siblingCount: 1,
    boundaryCount: 1,
  },
}

export const Secondary: Story = {
  args: {
    page: 5,
    totalPages: 30,
    color: "secondary",
    siblingCount: 1,
    boundaryCount: 1,
  },
}

export const Pending: Story = {
  args: {
    page: 5,
    totalPages: 30,
    isPending: true,
    color: "primary",
  },
}

export const PendingNeutral: Story = {
  args: {
    page: 5,
    totalPages: 30,
    isPending: true,
  },
}

export const Small: Story = {
  args: {
    page: 1,
    totalPages: 5,
  },
}

export const ColorSuccess: Story = {
  args: {
    page: 3,
    totalPages: 10,
    color: "success",
  },
}

export const ColorError: Story = {
  args: {
    page: 3,
    totalPages: 10,
    color: "error",
  },
}
