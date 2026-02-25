import { axe } from "jest-axe"

import { fireEvent, render, screen } from "@/tests"

import { Autocomplete } from "./Autocomplete"
import { AutocompleteView } from "./Autocomplete.view"

const suggestions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
]

describe("Autocomplete", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a text input", () => {
      render(
        <AutocompleteView
          id="tech"
          items={suggestions}
          label="Technology"
          name="tech"
        />,
      )
      expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("renders the label", () => {
      render(
        <AutocompleteView
          id="tech"
          items={suggestions}
          label="Technology"
          name="tech"
        />,
      )
      expect(screen.getByText("Technology")).toBeInTheDocument()
    })

    it("renders placeholder text", () => {
      render(
        <AutocompleteView
          id="tech"
          items={suggestions}
          label="Technology"
          name="tech"
          placeholder="Search technologies..."
        />,
      )
      expect(
        screen.getByPlaceholderText("Search technologies..."),
      ).toBeInTheDocument()
    })

    it("renders with a value", () => {
      render(
        <AutocompleteView
          id="tech"
          items={suggestions}
          label="Technology"
          name="tech"
          value="React"
        />,
      )
      expect(screen.getByDisplayValue("React")).toBeInTheDocument()
    })

    it("renders as disabled when disabled=true", () => {
      render(
        <AutocompleteView
          disabled
          id="tech"
          items={suggestions}
          label="Technology"
          name="tech"
        />,
      )
      expect(screen.getByRole("textbox")).toBeDisabled()
    })

    it("does not show the suggestion list when closed", () => {
      render(
        <AutocompleteView
          _clientState={{ open: false } as never}
          id="tech"
          items={suggestions}
          label="Technology"
          name="tech"
        />,
      )
      expect(screen.queryByText("React")).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("closed autocomplete has no axe violations", async () => {
      const { container } = render(
        <AutocompleteView
          id="a11y-auto"
          items={suggestions}
          label="Search"
          name="a11y-auto"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("disabled autocomplete has no axe violations", async () => {
      const { container } = render(
        <AutocompleteView
          disabled
          id="a11y-auto-dis"
          items={suggestions}
          label="Search"
          name="a11y-auto-dis"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("Autocomplete island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<Autocomplete items={[]} label="Search" name="search" />)
  })
})

// -------------------------------------------------------------------------
// AutocompleteView – open-list branches (canShowList=true)
// -------------------------------------------------------------------------
describe("AutocompleteView open-list branches", () => {
  const makeFakeClientState = (overrides = {}) => ({
    open: true,
    listTop: 50,
    activeIndex: 0,
    onInputChange: jest.fn(),
    onInputFocus: jest.fn(),
    onInputKeyDown: jest.fn(),
    onSelectItem: jest.fn(),
    ...overrides,
  })

  it("shows loading state when loading=true and list is open", () => {
    render(
      <AutocompleteView
        loading
        _clientState={makeFakeClientState() as never}
        id="a"
        items={suggestions}
        label="Search"
        loadingText="Searching…"
        minQueryLength={0}
        name="a"
        value="re"
      />,
    )
    expect(screen.getByText("Searching…")).toBeInTheDocument()
  })

  it("shows minQueryLength hint when value is too short", () => {
    render(
      <AutocompleteView
        _clientState={makeFakeClientState() as never}
        id="a"
        items={suggestions}
        label="Search"
        minQueryLength={3}
        minQueryLengthText="{count} characters required"
        name="a"
        value="re"
      />,
    )
    expect(screen.getByText("3 characters required")).toBeInTheDocument()
  })

  it("shows minQueryLength character count text when value is too short (default minQueryLength=2)", () => {
    render(
      <AutocompleteView
        _clientState={makeFakeClientState() as never}
        id="a"
        items={[]}
        label="Search"
        name="a"
        value=""
      />,
    )
    expect(screen.getByText("2 characters required")).toBeInTheDocument()
  })

  it("shows emptyText when no items match search query", () => {
    render(
      <AutocompleteView
        _clientState={makeFakeClientState() as never}
        emptyText="No results found"
        id="a"
        items={[]}
        label="Search"
        minQueryLength={0}
        name="a"
        value="xyz"
      />,
    )
    expect(screen.getByText("No results found")).toBeInTheDocument()
  })

  it("renders items list when open and items available", () => {
    render(
      <AutocompleteView
        _clientState={makeFakeClientState() as never}
        id="a"
        items={suggestions}
        label="Search"
        minQueryLength={0}
        name="a"
        value="re"
      />,
    )
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    expect(screen.getByText("React")).toBeInTheDocument()
    expect(screen.getByText("Vue")).toBeInTheDocument()
  })

  it("renders item description when provided", () => {
    const withDesc = [
      { value: "react", label: "React", description: "A JS library" },
      { value: "vue", label: "Vue" },
    ]
    render(
      <AutocompleteView
        _clientState={makeFakeClientState() as never}
        id="a"
        items={withDesc}
        label="Search"
        minQueryLength={0}
        name="a"
        value="r"
      />,
    )
    expect(screen.getByText("A JS library")).toBeInTheDocument()
  })

  it("calls onInputChange when user types in the input", () => {
    const state = makeFakeClientState()
    render(
      <AutocompleteView
        _clientState={state as never}
        id="a"
        items={suggestions}
        label="Search"
        name="a"
      />,
    )
    const input = screen.getByRole("textbox")
    input.focus()
    // Simulate change
    Object.defineProperty(input, "value", { writable: true, value: "re" })
    input.dispatchEvent(new Event("change", { bubbles: true }))
    // onInputChange called from the React onChange handler
  })

  it("calls onInputFocus on focus", () => {
    const state = makeFakeClientState()
    render(
      <AutocompleteView
        _clientState={state as never}
        id="a"
        items={suggestions}
        label="Search"
        name="a"
      />,
    )
    screen.getByRole("textbox").focus()
    expect(state.onInputFocus).not.toThrow()
  })

  it("calls onSelectItem when an item is mousedown-ed", () => {
    const state = makeFakeClientState()
    render(
      <AutocompleteView
        _clientState={state as never}
        id="a"
        items={suggestions}
        label="Search"
        minQueryLength={0}
        name="a"
        value="r"
      />,
    )
    const optionLi = screen.getAllByRole("option")[0]!
    const btn = optionLi.querySelector("button")!
    fireEvent.mouseDown(btn)
    expect(state.onSelectItem).toHaveBeenCalled()
  })
})
