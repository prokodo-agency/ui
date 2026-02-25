import { AutocompleteView } from "../../src/components/autocomplete/Autocomplete.view"

describe("Autocomplete", () => {
  it("renders with a label", () => {
    cy.mount(
      <AutocompleteView
        id="search"
        items={[]}
        label="Search"
        name="search"
        value=""
      />,
    )
    cy.contains("Search").should("be.visible")
  })

  it("renders a text input", () => {
    cy.mount(
      <AutocompleteView
        id="auto"
        items={[]}
        label="Country"
        name="country"
        value=""
      />,
    )
    cy.get("input[type='text'], input:not([type])").should("exist")
  })

  it("renders with placeholder text", () => {
    cy.mount(
      <AutocompleteView
        id="auto"
        items={[]}
        label="City"
        name="city"
        placeholder="Type a city..."
        value=""
      />,
    )
    cy.get("input").should("have.attr", "placeholder", "Type a city...")
  })

  it("renders as disabled", () => {
    cy.mount(
      <AutocompleteView
        disabled
        id="auto"
        items={[]}
        label="Disabled"
        name="disabled"
        value=""
      />,
    )
    cy.get("input").should("be.disabled")
  })

  it("suggestion list is closed by default", () => {
    cy.mount(
      <AutocompleteView
        id="auto"
        items={["Apple", "Banana"].map(s => ({ value: s, label: s }))}
        label="Fruit"
        name="fruit"
        value=""
      />,
    )
    cy.get("[role='listbox']").should("not.exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <AutocompleteView
        id="a11y-auto"
        items={[]}
        label="Accessible search"
        name="a11ySearch"
        value=""
      />,
    )
    cy.checkAccessibility()
  })

  it("shows option list when open via _clientState", () => {
    cy.mount(
      <AutocompleteView
        id="auto"
        items={["Apple", "Banana"].map(s => ({ value: s, label: s }))}
        label="Fruit"
        minQueryLength={0}
        name="fruit"
        value=""
        _clientState={{
          open: true,
          activeIndex: -1,
          onInputChange: cy.stub(),
          onInputFocus: cy.stub(),
          onInputKeyDown: cy.stub(),
          onSelectItem: cy.stub(),
        }}
      />,
    )
    cy.get("[role='option']").should("have.length", 2)
    cy.contains("[role='option']", "Apple").should("be.visible")
    cy.contains("[role='option']", "Banana").should("be.visible")
  })

  it("calls onSelectItem when an option is clicked", () => {
    const onSelectItem = cy.stub().as("onSelectItem")
    cy.mount(
      <AutocompleteView
        id="auto"
        items={["Apple", "Banana"].map(s => ({ value: s, label: s }))}
        label="Fruit"
        minQueryLength={0}
        name="fruit"
        value=""
        _clientState={{
          open: true,
          activeIndex: -1,
          onInputChange: cy.stub(),
          onInputFocus: cy.stub(),
          onInputKeyDown: cy.stub(),
          onSelectItem,
        }}
      />,
    )
    cy.contains("[role='option']", "Banana").click()
    cy.get("@onSelectItem").should("have.been.called")
  })
})
