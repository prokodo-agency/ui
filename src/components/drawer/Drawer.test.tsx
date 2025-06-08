import { expect } from "@jest/globals"

import { render } from "@/tests"

import { Drawer } from "./Drawer"

describe("The common drawer component", () => {
  it("should render drawer", async () => {
    const { container } = render(
      <Drawer anchor="right" open={true} onChange={jest.fn()} />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
