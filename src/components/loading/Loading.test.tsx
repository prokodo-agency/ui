import { expect } from "@jest/globals"

import { render } from "@/tests"

import { Loading } from "./Loading"

describe("The Loading component", () => {
  it(`should render Loading`, async () => {
    const { container } = render(<Loading size="xl" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
