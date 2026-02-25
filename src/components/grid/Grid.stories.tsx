import { Grid } from "./Grid"
import { GridRow } from "./GridRow"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Grid",
  component: Grid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Flexible CSS Grid container with optional row-based responsive layout via GridRow. Supports fixed or responsive column counts and gap tokens.",
      },
    },
  },
  argTypes: {
    spacing: {
      control: { type: "number", min: 0, max: 10, step: 1 },
      description:
        "Gap spacing multiplier (×8 px). Use gap token instead when available.",
    },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

const boxStyle: React.CSSProperties = {
  background: "var(--color-primary-200)",
  borderRadius: 6,
  padding: "16px",
  textAlign: "center",
  fontFamily: "var(--font-secondary)",
  fontSize: 14,
}

export const Default: Story = {
  args: {
    spacing: 2,
  },
  render: args => (
    <Grid {...args}>
      <GridRow md={4} xs={12}>
        <div style={boxStyle}>Column 1</div>
      </GridRow>
      <GridRow md={4} xs={12}>
        <div style={boxStyle}>Column 2</div>
      </GridRow>
      <GridRow md={4} xs={12}>
        <div style={boxStyle}>Column 3</div>
      </GridRow>
    </Grid>
  ),
}

export const TwoColumns: Story = {
  args: {
    spacing: 3,
  },
  render: args => (
    <Grid {...args}>
      <GridRow md={6} xs={12}>
        <div style={boxStyle}>Left</div>
      </GridRow>
      <GridRow md={6} xs={12}>
        <div style={boxStyle}>Right</div>
      </GridRow>
    </Grid>
  ),
}

export const FourColumns: Story = {
  args: {
    spacing: 2,
  },
  render: args => (
    <Grid {...args}>
      {[1, 2, 3, 4].map(n => (
        <GridRow key={n} lg={3} sm={6} xs={12}>
          <div style={boxStyle}>Item {n}</div>
        </GridRow>
      ))}
    </Grid>
  ),
}

export const CenteredRow: Story = {
  args: {
    spacing: 2,
  },
  render: args => (
    <Grid {...args}>
      <GridRow align="center" md={6} xs={12}>
        <div style={boxStyle}>Centred column (md=6)</div>
      </GridRow>
    </Grid>
  ),
}

export const NoGap: Story = {
  args: {
    spacing: 0,
  },
  render: args => (
    <Grid {...args}>
      {[1, 2, 3].map(n => (
        <GridRow key={n} md={4} xs={12}>
          <div style={{ ...boxStyle, borderRadius: 0 }}>Cell {n}</div>
        </GridRow>
      ))}
    </Grid>
  ),
}
