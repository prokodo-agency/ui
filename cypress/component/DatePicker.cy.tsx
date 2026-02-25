import { DatePickerView } from "../../src/components/datePicker/DatePicker.view"

describe("DatePicker", () => {
  it("renders with a label", () => {
    cy.mount(<DatePickerView label="Birth date" name="birthDate" />)
    cy.contains("Birth date").should("be.visible")
  })

  it("renders a date input", () => {
    cy.mount(<DatePickerView label="Date" name="date" />)
    cy.get("input[type='date']").should("exist")
  })

  it("renders a datetime-local input when withTime=true", () => {
    cy.mount(
      <DatePickerView label="Event date & time" name="eventDate" withTime />,
    )
    cy.get("input[type='datetime-local']").should("exist")
  })

  it("renders with min and max date constraints", () => {
    cy.mount(
      <DatePickerView
        label="Available date"
        maxDate="2025-12-31"
        minDate="2025-01-01"
        name="availableDate"
      />,
    )
    cy.get("input[type='date']")
      .should("have.attr", "min", "2025-01-01")
      .and("have.attr", "max", "2025-12-31")
  })

  it("renders error text", () => {
    cy.mount(
      <DatePickerView
        errorText="Please select a valid date"
        label="Date"
        name="date"
      />,
    )
    cy.contains("Please select a valid date").should("be.visible")
  })

  it("has no accessibility violations", () => {
    cy.mount(<DatePickerView label="Select a date" name="a11yDate" />)
    cy.checkAccessibility()
  })
})
