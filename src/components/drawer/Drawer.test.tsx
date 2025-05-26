jest.mock("@/components/icon/getIconLoader", () => ({
  getIconLoader: () => null
}))

import { expect } from "@jest/globals"

import { render } from "@/tests"

import { Drawer } from "./Drawer"

jest.mock(
  "remark-breaks",
  () =>
    ({ children }) =>
      children,
)
jest.mock(
  "remark-gfm",
  () =>
    ({ children }) =>
      children,
)

describe("The common drawer component", () => {
  it("should render drawer", async () => {
    const { container } = render(
      <Drawer anchor="right" open={true} onClose={jest.fn()} />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
