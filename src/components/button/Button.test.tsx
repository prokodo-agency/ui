jest.mock("@/components/icon/iconLoader", () => ({
  getIconLoader: () => null
}))

import { expect } from "@jest/globals"

import { render } from "@/tests"

import { Button } from "./Button"

describe("The Button component", () => {
  it("should render Button", async () => {
    const { container } = render(<Button title="Test title" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("should render disabled Button", async () => {
    const { container } = render(<Button disabled title="Test title" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("should render loading Button", async () => {
    const { container } = render(<Button loading title="Test title" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
