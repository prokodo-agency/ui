import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { SnackbarView } from "./Snackbar.view"
import { SnackbarProvider } from "./SnackbarProvider"

describe("Snackbar", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders the snackbar with a message", () => {
      render(<SnackbarView message="Operation successful" />)
      expect(screen.getByText("Operation successful")).toBeInTheDocument()
    })

    it("has role=status for polite announcements", () => {
      render(<SnackbarView message="Saved!" />)
      expect(screen.getByRole("status")).toBeInTheDocument()
    })

    it("renders close button by default", () => {
      render(<SnackbarView message="Item deleted" />)
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument()
    })

    it("hides close button when closeable=false", () => {
      render(<SnackbarView closeable={false} message="Item deleted" />)
      expect(
        screen.queryByRole("button", { name: /close/i }),
      ).not.toBeInTheDocument()
    })

    it("renders action slot content", () => {
      render(
        <SnackbarView
          action={<button type="button">Undo</button>}
          message="File deleted"
        />,
      )
      expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument()
    })

    it("renders in 'error' variant", () => {
      render(<SnackbarView message="An error occurred" variant="error" />)
      expect(screen.getByRole("status")).toHaveClass("prokodo-Snackbar--error")
    })

    it("renders in 'success' variant", () => {
      render(<SnackbarView message="Saved successfully" variant="success" />)
      expect(screen.getByRole("status")).toHaveClass(
        "prokodo-Snackbar--success",
      )
    })

    it("renders in 'warning' variant", () => {
      render(<SnackbarView message="Low disk space" variant="warning" />)
      expect(screen.getByRole("status")).toHaveClass(
        "prokodo-Snackbar--warning",
      )
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onClose with 'closeIcon' when close button is clicked", async () => {
      const handleClose = jest.fn()
      render(<SnackbarView message="Close me" onClose={handleClose} />)
      await userEvent.click(screen.getByRole("button", { name: /close/i }))
      expect(handleClose).toHaveBeenCalledWith("closeIcon")
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("default snackbar has no axe violations", async () => {
      const { container } = render(
        <SnackbarView message="Your changes have been saved" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("error snackbar has no axe violations", async () => {
      const { container } = render(
        <SnackbarView message="An error occurred" variant="error" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("snackbar without close button has no axe violations", async () => {
      const { container } = render(
        <SnackbarView closeable={false} message="Persistent notification" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("has aria-live='polite' for assistive technologies", () => {
      render(<SnackbarView message="Status update" />)
      expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite")
    })
  })
})

describe("SnackbarProvider island", () => {
  it("renders without crashing via island wrapper", () => {
    render(
      <SnackbarProvider>
        <div>content</div>
      </SnackbarProvider>,
    )
  })
})

describe("SnackbarView close button edge cases", () => {
  it("close button click fires closeButtonProps.onClick when provided", async () => {
    const customOnClick = jest.fn()
    const user = userEvent.setup()
    render(
      <SnackbarView
        closeButtonProps={{ onClick: customOnClick }}
        message="msg"
      />,
    )
    await user.click(screen.getByRole("button", { name: /close/i }))
    expect(customOnClick).toHaveBeenCalled()
  })

  it("close button click without onClose does not throw", async () => {
    const user = userEvent.setup()
    render(<SnackbarView message="msg" />)
    await user.click(screen.getByRole("button", { name: /close/i }))
    expect(screen.getByText("msg")).toBeInTheDocument()
  })
})
