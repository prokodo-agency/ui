import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { CheckboxGroup } from "./CheckboxGroup"

describe("CheckboxGroup", () => {
  it("renders options", () => {
    render(
      <CheckboxGroup
        name="licenses"
        options={[
          { value: "mit", title: "MIT" },
          { value: "apache", title: "Apache-2.0" },
        ]}
      />,
    )

    expect(screen.getByRole("checkbox", { name: /mit/i })).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /apache-2.0/i }),
    ).toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <CheckboxGroup
        name="licenses"
        options={[
          { value: "mit", title: "MIT" },
          { value: "apache", title: "Apache-2.0" },
        ]}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
