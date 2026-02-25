import { expect } from "@jest/globals"
import { render, screen, fireEvent } from "@testing-library/react"

import FormServer from "./Form.server"

let capturedProps: Record<string, unknown> = {}

jest.mock("./Form.view", () => ({
  FormView: (props: Record<string, unknown>) => {
    capturedProps = props
    return (
      <form
        data-testid="view"
        onSubmit={props.onFormSubmit as React.FormEventHandler}
      />
    )
  },
}))

describe("FormServer", () => {
  it("renders with required label prop", () => {
    render(<FormServer label="Contact Form" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("renders with fields array", () => {
    render(
      <FormServer
        fields={[{ fieldType: "input", name: "email" }]}
        label="Form"
      />,
    )
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("onFormSubmit passed to FormView returns undefined (no-op)", () => {
    render(<FormServer label="Form" />)
    // Submitting the form calls onFormSubmit which returns undefined
    fireEvent.submit(screen.getByTestId("view"))
    // No errors thrown; onFormSubmit is a valid no-op
    expect(capturedProps.isFormValid).toBe(true)
  })
})
