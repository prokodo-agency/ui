import { Button } from "./Button"

import type { ButtonColor } from "./Button.model"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { CSSProperties, ReactNode } from "react"

const colors: ButtonColor[] = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "inherit",
]
const variants = ["contained", "outlined", "text"] as const

const matrixStyle: CSSProperties = {
  display: "grid",
  gap: "28px",
  width: "min(1180px, calc(100vw - 48px))",
  padding: "32px",
  overflowX: "auto",
  borderRadius: "24px",
  background: "var(--pk-color-bg)",
  color: "var(--pk-color-fg)",
}

const rowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "100px repeat(4, minmax(150px, 1fr))",
  alignItems: "center",
  gap: "14px",
}

const columnLabelStyle: CSSProperties = {
  font: "600 12px/1.2 system-ui, sans-serif",
  letterSpacing: "0.04em",
  opacity: 0.65,
  textTransform: "uppercase",
}

function MatrixCell({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>{children}</div>
  )
}

function ButtonMatrix() {
  return (
    <div style={matrixStyle}>
      <div style={rowStyle}>
        <span />
        <span style={columnLabelStyle}>Label</span>
        <span style={columnLabelStyle}>Icon start</span>
        <span style={columnLabelStyle}>Icon end</span>
        <span style={columnLabelStyle}>Icon only</span>
      </div>

      {variants.map(variant => (
        <section key={variant} style={{ display: "grid", gap: "14px" }}>
          <strong
            style={{
              font: "700 16px/1.2 system-ui, sans-serif",
              textTransform: "capitalize",
            }}
          >
            {variant}
          </strong>

          {colors.map(color => (
            <div key={`${variant}-${color}`} style={rowStyle}>
              <span style={columnLabelStyle}>{color}</span>
              <MatrixCell>
                <Button color={color} title="Analysieren" variant={variant} />
              </MatrixCell>
              <MatrixCell>
                <Button
                  color={color}
                  iconProps={{ name: "SparklesIcon" }}
                  title="Optimieren"
                  variant={variant}
                />
              </MatrixCell>
              <MatrixCell>
                <Button
                  color={color}
                  iconPosition="end"
                  iconProps={{ name: "ArrowRight01Icon" }}
                  title="Weiter"
                  variant={variant}
                />
              </MatrixCell>
              <MatrixCell>
                <Button
                  aria-label={`${color} ${variant} icon button`}
                  color={color}
                  iconProps={{ name: "ArrowRight01Icon" }}
                  variant={variant}
                />
              </MatrixCell>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: "prokodo/content/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      options: colors,
      control: { type: "select" },
    },
    variant: {
      options: variants,
      control: { type: "radio" },
    },
    iconPosition: {
      options: ["start", "end"],
      control: { type: "radio" },
    },
    loading: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Button",
    variant: "contained",
    color: "primary",
  },
}

export const IconOnly: Story = {
  args: {
    "aria-label": "Button",
    variant: "contained",
    color: "primary",
    iconProps: {
      name: "ArrowRight01Icon",
    },
  },
}

export const WithIconAtEnd: Story = {
  args: {
    title: "Weiter",
    variant: "contained",
    color: "primary",
    iconPosition: "end",
    iconProps: {
      name: "ArrowRight01Icon",
    },
  },
}

export const AllCombinations: Story = {
  args: { title: "Button" },
  render: () => <ButtonMatrix />,
}

export const InteractionStates: Story = {
  args: { title: "Button" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
      <Button color="primary" title="Default" />
      <Button disabled color="primary" title="Disabled" />
      <Button loading color="primary" title="Loading" />
      <Button
        aria-label="Icon only"
        color="primary"
        iconProps={{ name: "SparklesIcon" }}
      />
    </div>
  ),
}

export const WithLink: Story = {
  args: {
    title: "Button",
    variant: "contained",
    color: "primary",
    redirect: {
      href: "#",
      target: "_blank",
    },
    iconProps: {
      name: "ArrowRight01Icon",
    },
  },
}

export const WithImage: Story = {
  args: {
    title: "Button with Image",
    variant: "outlined",
    color: "primary",
    image: {
      src: "/assets/images/github_logo.webp",
      alt: "Github icon",
    },
  },
}

export const WithLoading: Story = {
  args: {
    title: "Loading",
    variant: "contained",
    color: "primary",
    loading: true,
  },
}

export const WithLoadingOutlined: Story = {
  args: {
    title: "Loading outlined",
    variant: "outlined",
    color: "primary",
    loading: true,
  },
}

export const WithLoadingText: Story = {
  args: {
    title: "Loading text",
    variant: "text",
    color: "primary",
    loading: true,
  },
}
