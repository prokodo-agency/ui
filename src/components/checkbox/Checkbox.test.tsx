import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Checkbox } from "./Checkbox"

describe("Checkbox", () => {
  it("renders island checkbox", () => {
    render(
      <Checkbox defaultChecked name="terms" title="Accept terms" value="yes" />,
    )

    expect(
      screen.getByRole("checkbox", { name: /accept terms/i }),
    ).toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <Checkbox defaultChecked name="terms" title="Accept terms" value="yes" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("disabled checkbox has no axe violations", async () => {
    const { container } = render(
      <Checkbox
        disabled
        name="terms"
        title="Accept terms (disabled)"
        value="yes"
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
