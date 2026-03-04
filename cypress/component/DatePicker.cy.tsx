import DatePickerClient from "../../src/components/datePicker/DatePicker.client"

describe("DatePicker", () => {
  it("renders with a label", () => {
    cy.mount(<DatePickerClient label="Birth date" name="birthDate" />)
    cy.contains("Birth date").should("be.visible")
  })

  it("renders a text input for date entry", () => {
    cy.mount(<DatePickerClient label="Date" name="date" />)
    cy.get("input[type='text']").should("exist")
  })

  it("renders a text input when withTime=true", () => {
    cy.mount(
      <DatePickerClient label="Event date & time" name="eventDate" withTime />,
    )
    cy.get("input[type='text']").should("exist")
  })

  it("renders with min and max date constraints", () => {
    cy.mount(
      <DatePickerClient
        label="Available date"
        maxDate="2025-12-31"
        minDate="2025-01-01"
        name="availableDate"
      />,
    )
    cy.get("input[type='text']").should("exist")
  })

  it("opens the calendar dialog on input click", () => {
    cy.mount(<DatePickerClient label="Date" name="date" />)
    cy.get("input").click()
    cy.get("[role='dialog']").should("be.visible")
  })

  it("has no accessibility violations", () => {
    cy.mount(<DatePickerClient label="Select a date" name="a11yDate" />)
    cy.checkAccessibility()
  })
})
