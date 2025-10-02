/* stories/Snackbar.stories.tsx
   ────────────────────────────────────────────────────────── */

import { Snackbar, SnackbarProvider } from "@/components/snackbar"
import { useSnackbar } from "@/components/snackbar/SnackbarProvider.client"

import type { Meta, StoryObj } from "@storybook/react"

/* ---------- Meta ------------------------------------------------- */
const meta = {
  title: "prokodo/feedback/Snackbar",
  component: Snackbar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Transient feedback toast. \
Wrapped in a **`SnackbarProvider`** so each story can also enqueue multiple messages.",
      },
    },
  },
  tags: ["autodocs"],
  /* Wrap ALL stories in the provider */
  decorators: [
    Story => (
      <SnackbarProvider maxSnack={4}>
        <Story />
      </SnackbarProvider>
    ),
  ],
  argTypes: {
    /* ---------- Interactive controls --------------------------- */
    message: { control: "text" },
    open: { control: "boolean" },
    autoHideDuration: { control: { type: "number", min: 0, step: 500 } },
    variant: {
      control: "select",
      options: ["default", "success", "error", "warning", "info"],
    },
    anchorOrigin: { table: { disable: true } },
    action: { table: { disable: true } },
    closeable: { control: "boolean" },
    elevation: { control: { type: "number", min: 1, step: 1 } },

    /* --- Disable non-UX props in the SB UI -------------------- */
    className: { table: { disable: true } },
    onClose: { action: "closed", table: { disable: true } },
  },
} satisfies Meta<typeof Snackbar>

export default meta

/* ---------- Story-alias ---------------------------------------- */
type Story = StoryObj<typeof meta>

/* ---------- Stories (controlled Snackbar) ---------------------- */
export const Default: Story = {
  args: {
    open: true,
    message: "Saved successfully",
  },
}

export const Success: Story = {
  args: {
    open: true,
    message: "Changes applied",
    variant: "success",
    autoHideDuration: 3000,
  },
}

export const ErrorWithCloseIcon: Story = {
  args: {
    open: true,
    message: "Something went wrong",
    variant: "error",
    closeable: true,
  },
}

export const WithAction: Story = {
  args: {
    open: true,
    message: "Item deleted",
    variant: "info",
    action: <button onClick={() => alert("Undo!")}>UNDO</button>,
    closeable: true,
  },
}

export const TopLeft: Story = {
  args: {
    open: true,
    message: "I appear top-left",
    anchorOrigin: { vertical: "top", horizontal: "left" },
  },
}

/* ---------- Provider-level demo (multiple snackbars) ----------- */
function ProviderDemoComponent() {
  const { enqueue } = useSnackbar()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        onClick={() =>
          enqueue({ message: "Default message", variant: "default" })
        }
      >
        Show default
      </button>

      <button
        onClick={() =>
          enqueue({
            message: "Success!",
            variant: "success",
            autoHideDuration: 2500,
          })
        }
      >
        Enqueue success
      </button>

      <button
        onClick={() =>
          enqueue({
            message: "Oops, an error occurred",
            variant: "error",
            closeable: true,
          })
        }
      >
        Enqueue error (closeable)
      </button>
    </div>
  )
}

export const ProviderDemo: Story = {
  args: {
    open: false, // not rendered
    message: "", // not rendered
  },
  render: () => <ProviderDemoComponent />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the `SnackbarProvider` queue: click the buttons to stack up to four snackbars.",
      },
    },
  },
}
