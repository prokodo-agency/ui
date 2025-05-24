import { expect } from "@jest/globals"

import { render } from "@/tests"

import { Button } from "./Button"

describe("The Button component", () => {
  it("should render Button", () => {
    const { container } = render(<Button title="Test title" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("should render disabled Button", () => {
    const { container } = render(<Button disabled title="Test title" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("should render loading Button", () => {
    const { container } = render(<Button loading title="Test title" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
