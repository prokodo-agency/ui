import { render, screen } from "@/tests"

import { FormResponse } from "./FormResponse"

describe("FormResponse", () => {
  it("returns null when messages is undefined (no errors)", () => {
    const { container } = render(<FormResponse messages={undefined as never} />)
    // Component returns null when there are no error keys
    expect(container).toBeEmptyDOMElement()
  })

  it("returns null when messages has no errors", () => {
    const { container } = render(
      <FormResponse messages={{ message: "OK", errors: undefined }} />,
    )
    // isArray([]) is false so returns null
    expect(container).toBeEmptyDOMElement()
  })

  it("renders success message alongside errors when both are provided", () => {
    render(
      <FormResponse
        messages={{
          message: "Partial success",
          errors: { email: ["Invalid email"] },
        }}
      />,
    )
    expect(screen.getByText("Partial success")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })

  it("renders error messages when messages.errors is provided", () => {
    render(
      <FormResponse
        messages={{
          message: undefined,
          errors: {
            email: ["Email is required", "Email is invalid"],
            name: ["Name is required"],
          },
        }}
      />,
    )
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })

  it("renders with custom className when errors provided", () => {
    const { container } = render(
      <FormResponse
        className="custom-class"
        messages={{ message: undefined, errors: { email: ["Invalid"] } }}
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector(".custom-class")).toBeTruthy()
  })
})
