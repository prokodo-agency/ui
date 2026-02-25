/* eslint-disable jsx-a11y/no-static-element-interactions */
import { fireEvent, render, screen } from "@/tests"

const mockView = jest.fn((props: Record<string, unknown>) => (
  <div
    data-is-clickable={String(props.isClickable ?? "")}
    data-role={String(props.role ?? "")}
    data-tab-index={String(props.tabIndex ?? "")}
    data-testid="card-view"
    onClick={props.onClick as (() => void) | undefined}
    onKeyDown={props.onKeyDown as ((e: unknown) => void) | undefined}
  />
))

jest.mock("./Card.view", () => ({ CardView: mockView }))

const CardClient = require("./Card.client").default

beforeEach(() => mockView.mockClear())

describe("Card.client", () => {
  describe("isClickable", () => {
    it("is not clickable by default (no onClick, no redirect)", () => {
      render(<CardClient />)
      expect(screen.getByTestId("card-view")).toHaveAttribute(
        "data-is-clickable",
        "false",
      )
    })

    it("is clickable when onClick provided and not disabled", () => {
      render(<CardClient onClick={() => {}} />)
      expect(screen.getByTestId("card-view")).toHaveAttribute(
        "data-is-clickable",
        "true",
      )
    })

    it("is clickable when redirect.href is a string", () => {
      render(<CardClient redirect={{ href: "/page" }} />)
      expect(screen.getByTestId("card-view")).toHaveAttribute(
        "data-is-clickable",
        "true",
      )
    })

    it("is not clickable when disabled even with onClick", () => {
      render(<CardClient disabled onClick={() => {}} />)
      expect(screen.getByTestId("card-view")).toHaveAttribute(
        "data-is-clickable",
        "false",
      )
    })
  })

  describe("onClick handler", () => {
    it("calls onClick when not disabled", () => {
      const onClickMock = jest.fn()
      render(<CardClient onClick={onClickMock} />)
      fireEvent.click(screen.getByTestId("card-view"))
      expect(onClickMock).toHaveBeenCalledTimes(1)
    })

    it("does not call onClick when disabled", () => {
      const onClickMock = jest.fn()
      render(<CardClient disabled onClick={onClickMock} />)
      // onClick should not be attached to the click handler
      // (the view receives onClick=undefined)
      fireEvent.click(screen.getByTestId("card-view"))
      expect(onClickMock).not.toHaveBeenCalled()
    })
  })

  describe("keyboard handler", () => {
    it("fires onClick on Enter key press when not disabled", () => {
      const onClickMock = jest.fn()
      render(<CardClient onClick={onClickMock} />)
      fireEvent.keyDown(screen.getByTestId("card-view"), { code: "Enter" })
      expect(onClickMock).toHaveBeenCalledTimes(1)
    })

    it("does not fire onClick on Enter when disabled", () => {
      const onClickMock = jest.fn()
      render(<CardClient disabled onClick={onClickMock} />)
      fireEvent.keyDown(screen.getByTestId("card-view"), { code: "Enter" })
      expect(onClickMock).not.toHaveBeenCalled()
    })

    it("does not fire onClick on non-Enter keys", () => {
      const onClickMock = jest.fn()
      render(<CardClient onClick={onClickMock} />)
      fireEvent.keyDown(screen.getByTestId("card-view"), { code: "Space" })
      expect(onClickMock).not.toHaveBeenCalled()
    })

    it("calls onKeyDown passthrough if provided", () => {
      const onKeyDownMock = jest.fn()
      render(<CardClient onKeyDown={onKeyDownMock} />)
      fireEvent.keyDown(screen.getByTestId("card-view"), { code: "Tab" })
      expect(onKeyDownMock).toHaveBeenCalledTimes(1)
    })
  })

  describe("link role", () => {
    it("sets role=link and tabIndex=0 for redirect with href and not disabled", () => {
      render(<CardClient redirect={{ href: "/page" }} />)
      const view = screen.getByTestId("card-view")
      expect(view).toHaveAttribute("data-role", "link")
      expect(view).toHaveAttribute("data-tab-index", "0")
    })

    it("does not set role=link when disabled", () => {
      render(<CardClient disabled redirect={{ href: "/page" }} />)
      expect(screen.getByTestId("card-view")).toHaveAttribute("data-role", "")
    })
  })
})
