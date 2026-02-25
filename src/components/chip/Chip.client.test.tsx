/* eslint-disable jsx-a11y/no-static-element-interactions */

import { fireEvent, render, screen } from "@/tests"

const mockView = jest.fn((props: Record<string, unknown>) => {
  const attrs: Record<string, unknown> = {
    "data-testid": "chip-view",
    "data-role": String(props.role ?? ""),
    "data-tab-index": String(props.tabIndex ?? ""),
    "data-has-delete": String(Boolean(props.buttonProps)),
    "data-has-key-handler": String(Boolean(props.onKeyDown)),
  }
  const buttonProps = props.buttonProps as Record<string, unknown> | undefined
  return (
    <div
      {...attrs}
      onClick={props.onClick as () => void}
      onKeyDown={props.onKeyDown as (() => void) | undefined}
    >
      {buttonProps && (
        <button
          data-testid="chip-delete-btn"
          onKeyDown={buttonProps.onKeyDown as (() => void) | undefined}
        />
      )}
    </div>
  )
})

jest.mock("./Chip.view", () => ({ ChipView: mockView }))

const ChipClient = require("./Chip.client").default

beforeEach(() => mockView.mockClear())

describe("Chip.client", () => {
  describe("clickable chip", () => {
    it("sets role=button and tabIndex=0 when onClick provided", () => {
      render(<ChipClient label="Chip" onClick={() => {}} />)
      const view = screen.getByTestId("chip-view")
      expect(view).toHaveAttribute("data-role", "button")
      expect(view).toHaveAttribute("data-tab-index", "0")
    })

    it("attaches onKeyDown handler when clickable", () => {
      render(<ChipClient label="Chip" onClick={() => {}} />)
      expect(screen.getByTestId("chip-view")).toHaveAttribute(
        "data-has-key-handler",
        "true",
      )
    })

    it("fires onClick when Enter key pressed on clickable chip", async () => {
      const onClickMock = jest.fn()
      render(<ChipClient label="Chip" onClick={onClickMock} />)
      const view = screen.getByTestId("chip-view")
      fireEvent.keyDown(view, { key: "Enter" })
      expect(onClickMock).toHaveBeenCalledTimes(1)
    })

    it("fires onClick when Space key pressed on clickable chip", async () => {
      const onClickMock = jest.fn()
      render(<ChipClient label="Chip" onClick={onClickMock} />)
      const view = screen.getByTestId("chip-view")
      fireEvent.keyDown(view, { key: " " })
      expect(onClickMock).toHaveBeenCalledTimes(1)
    })

    it("does not fire onClick on other keys", async () => {
      const onClickMock = jest.fn()
      render(<ChipClient label="Chip" onClick={onClickMock} />)
      fireEvent.keyDown(screen.getByTestId("chip-view"), { key: "Tab" })
      expect(onClickMock).not.toHaveBeenCalled()
    })
  })

  describe("non-clickable chip", () => {
    it("sets tabIndex=-1 and no role when no onClick", () => {
      render(<ChipClient label="Chip" />)
      const view = screen.getByTestId("chip-view")
      expect(view).toHaveAttribute("data-role", "")
      expect(view).toHaveAttribute("data-tab-index", "-1")
    })
  })

  describe("deletable chip", () => {
    it("passes buttonProps when onDelete provided", () => {
      render(<ChipClient label="Chip" onDelete={() => {}} />)
      expect(screen.getByTestId("chip-view")).toHaveAttribute(
        "data-has-delete",
        "true",
      )
    })

    it("does not pass buttonProps when onDelete absent", () => {
      render(<ChipClient label="Chip" />)
      expect(screen.getByTestId("chip-view")).toHaveAttribute(
        "data-has-delete",
        "false",
      )
    })
  })

  describe("onKeyDown passthrough", () => {
    it("attaches key handler when onKeyDown provided without onClick", () => {
      render(<ChipClient label="Chip" onKeyDown={() => {}} />)
      expect(screen.getByTestId("chip-view")).toHaveAttribute(
        "data-has-key-handler",
        "true",
      )
    })
  })

  describe("handleKeyDelete", () => {
    it("calls onDelete when Enter pressed on delete button", () => {
      const onDelete = jest.fn()
      render(<ChipClient label="Chip" onDelete={onDelete} />)
      fireEvent.keyDown(screen.getByTestId("chip-delete-btn"), { key: "Enter" })
      expect(onDelete).toHaveBeenCalled()
    })

    it("calls onDelete when Space pressed on delete button", () => {
      const onDelete = jest.fn()
      render(<ChipClient label="Chip" onDelete={onDelete} />)
      fireEvent.keyDown(screen.getByTestId("chip-delete-btn"), { key: " " })
      expect(onDelete).toHaveBeenCalled()
    })

    it("does not call onDelete on other keys (Tab) on delete button", () => {
      // Covers handleKeyDelete if branch false path at line 26
      const onDelete = jest.fn()
      render(<ChipClient label="Chip" onDelete={onDelete} />)
      fireEvent.keyDown(screen.getByTestId("chip-delete-btn"), { key: "Tab" })
      expect(onDelete).not.toHaveBeenCalled()
    })
  })
})
