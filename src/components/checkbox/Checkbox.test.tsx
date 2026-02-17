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
})
