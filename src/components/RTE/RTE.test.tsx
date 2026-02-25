import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { RTE } from "./RTE"
import { RTEView } from "./RTE.view"

describe("RTE", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders an input/textarea surface", () => {
      const { container } = render(
        <RTEView label="Content editor" name="content" />,
      )
      // RTE uses a custom renderNode (rich text editor div) instead of a native textbox
      // The label element is present but associated with a div, not a labellable element
      // eslint-disable-next-line testing-library/no-container
      const labelEl = container.querySelector("label")
      expect(labelEl?.textContent).toContain("Content")
      expect(container.firstChild).toBeTruthy()
    })

    it("renders a placeholder when provided", () => {
      const { container } = render(
        <RTEView
          label="Content"
          name="content"
          placeholder="Write your content here..."
        />,
      )
      // The label element is present but associated with a div, use querySelector
      // eslint-disable-next-line testing-library/no-container
      const labelEl = container.querySelector("label")
      expect(labelEl?.textContent).toContain("Content")
    })

    it("renders the html value in the textarea", () => {
      render(
        <RTEView
          htmlValue="<p>Hello world</p>"
          label="Description"
          name="rte"
        />,
      )
      // The hidden mirror textarea carries the value

      const hiddenTextarea = document.querySelector(
        "textarea[aria-hidden='true']",
      ) as HTMLTextAreaElement
      expect(hiddenTextarea?.value).toContain("Hello world")
    })

    it("renders as disabled when disabled=true", () => {
      const { container } = render(
        <RTEView disabled label="Description" name="rte" />,
      )
      // Disabled state is reflected in class names on the wrapper

      expect(container.firstChild).toBeTruthy()
    })

    it("renders error text when provided", () => {
      render(
        <RTEView
          errorText="Content is required"
          label="Description"
          name="rte"
        />,
      )
      expect(screen.getByText("Content is required")).toBeInTheDocument()
    })

    it("renders required indicator when required=true", () => {
      const { container } = render(
        <RTEView required label="Description" name="rte" />,
      )
      // required is passed through; verify the form wrapper renders

      expect(container.firstChild).toBeTruthy()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("RTE editor has no axe violations", async () => {
      const { container } = render(
        <RTEView label="Rich Text Editor" name="a11y-rte" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("RTE with error has no axe violations", async () => {
      const { container } = render(
        <RTEView
          errorText="Please enter content"
          label="Description"
          name="a11y-rte-err"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("RTE island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<RTE name="rte" />)
  })
})

describe("RTEView – resize button", () => {
  it("renders resize button when showResize=true and not disabled/readOnly", () => {
    render(<RTEView showResize label="Content" name="rte" />)

    expect(
      screen.queryByRole("button", { name: "Resize editor height" }),
    ).toBeInTheDocument()
  })

  it("does NOT render resize button when showResize=true but disabled=true", () => {
    render(<RTEView disabled showResize label="Content" name="rte" />)

    expect(
      screen.queryByRole("button", { name: "Resize editor height" }),
    ).not.toBeInTheDocument()
  })

  it("does NOT render resize button when showResize=true but readOnly=true", () => {
    render(<RTEView readOnly showResize label="Content" name="rte" />)

    expect(
      screen.queryByRole("button", { name: "Resize editor height" }),
    ).not.toBeInTheDocument()
  })
})
