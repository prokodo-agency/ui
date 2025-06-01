/* components/select/Select.stories.tsx
   ───────────────────────────────────── */

import { Select } from "@/components/select";

import type { SelectItem } from "./Select.model";
import type { Meta, StoryObj } from "@storybook/react";

/* ---------- sample data ------------------------------------------------ */
const demoItems: SelectItem[] = [
  { value: "alpha",   label: "Alpha" },
  { value: "beta",    label: "Beta" },
  { value: "gamma",   label: "Gamma" },
  { value: "delta",   label: "Delta" },
];

/* ---------- meta ------------------------------------------------------- */
const meta = {
  title: "prokodo/form/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: { description: { component: "Accessible, SSR-safe native `<select>`." } },
  },
  tags: ["autodocs"],
  argTypes: {
    multiple:  { control: "boolean" },
    required:  { control: "boolean" },
    value:     { table: { disable: true } },   // managed by knob playground
    items:     { table: { disable: true } },
    /* hide internal styling/helpers */
    className:          { table: { disable: true } },
    fieldClassName:     { table: { disable: true } },
    selectClassName:    { table: { disable: true } },
    iconVisible:        { table: { disable: true } },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- stories ---------------------------------------------------- */
export const Default: Story = {
  args: {
    id: "select-demo-1",
    label: "Choose a value",
    items: demoItems,
    placeholder: "-- Please choose --",
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    id: "select-demo-2",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    id: "select-demo-3",
    errorText: "This field is required.",
  },
};

export const Multiple: Story = {
  args: {
    ...Default.args,
    id: "select-demo-4",
    multiple: true,
    placeholder: "-- Select one or more --",
  },
};
