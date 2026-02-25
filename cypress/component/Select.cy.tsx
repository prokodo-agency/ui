import { Select } from "../../src/components/select"
import SelectClient from "../../src/components/select/Select.client"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
]

describe("Select", () => {
  it("renders with placeholder", () => {
    cy.mount(
      <Select
        id="fruit"
        items={fruits}
        label="Favourite fruit"
        placeholder="Choose a fruit"
      />,
    )
    cy.contains("Choose a fruit").should("be.visible")
  })

  it("renders the label", () => {
    cy.mount(<Select id="fruit" items={fruits} label="Favourite fruit" />)
    cy.contains("Favourite fruit").should("be.visible")
  })

  it("renders selected value", () => {
    cy.mount(<Select id="fruit" items={fruits} label="Fruit" value="banana" />)
    cy.contains("Banana").should("be.visible")
  })

  it("is disabled when disabled=true", () => {
    cy.mount(<Select disabled id="fruit" items={fruits} label="Fruit" />)
    cy.get("button").should("be.disabled")
  })

  it("has no accessibility violations", () => {
    cy.mount(<Select id="a11y-select" items={fruits} label="Select a fruit" />)
    cy.checkAccessibility()
  })

  it("trigger button has aria-controls", () => {
    cy.mount(<Select id="ctrl-select" items={fruits} label="Fruit" />)
    cy.get("button").should("have.attr", "aria-controls", "ctrl-select-listbox")
  })

  it("trigger button has aria-haspopup=listbox", () => {
    cy.mount(<Select id="fruit" items={fruits} label="Fruit" />)
    cy.get("button").should("have.attr", "aria-haspopup", "listbox")
  })

  it("opens the listbox on button click", () => {
    // Use SelectClient directly to avoid island lazy-loading race condition
    cy.mount(<SelectClient id="fruit" items={fruits} label="Fruit" />)
    cy.get("button").click()
    cy.get("[role='listbox']").should("be.visible")
  })

  it("shows all options when open", () => {
    // required=true suppresses the placeholder option so we get exactly 3 items
    cy.mount(<SelectClient id="fruit" items={fruits} label="Fruit" required />)
    cy.get("button").click()
    cy.get("[role='option']").should("have.length", 3)
    cy.contains("[role='option']", "Apple").should("exist")
    cy.contains("[role='option']", "Banana").should("exist")
    cy.contains("[role='option']", "Cherry").should("exist")
  })

  it("calls onChange when an option is clicked", () => {
    const onChange = cy.stub().as("onChange")
    cy.mount(
      <SelectClient
        id="fruit"
        items={fruits}
        label="Fruit"
        onChange={onChange}
      />,
    )
    cy.get("button").click()
    cy.contains("[role='option']", "Cherry").click()
    cy.get("@onChange").should("have.been.called")
  })

  it("closes the listbox after selecting an option", () => {
    cy.mount(<SelectClient id="fruit" items={fruits} label="Fruit" />)
    cy.get("button").click()
    cy.contains("[role='option']", "Apple").click()
    cy.get("[role='listbox']").should("not.exist")
  })

  it("shows errorText when provided", () => {
    cy.mount(
      <Select
        id="fruit"
        items={fruits}
        label="Fruit"
        errorText="Selection is required"
      />,
    )
    cy.contains("Selection is required").should("be.visible")
  })

  it("shows helperText when provided", () => {
    cy.mount(
      <Select
        id="fruit"
        items={fruits}
        label="Fruit"
        helperText="Choose your favourite"
      />,
    )
    cy.contains("Choose your favourite").should("be.visible")
  })

  it("error state has no accessibility violations", () => {
    cy.mount(
      <Select
        id="a11y-err"
        items={fruits}
        label="Select a fruit"
        errorText="Required"
      />,
    )
    cy.checkAccessibility()
  })
})
