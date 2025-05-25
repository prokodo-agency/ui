import { expect } from "@jest/globals"

import { render } from "@/tests"

import { BaseLink } from "./BaseLink"

describe("The BaseLink component", () => {
  it("should render internal links", async () => {
    const { container } = render(<BaseLink href="/">Home</BaseLink>)
    expect(container.firstElementChild).toMatchSnapshot()
  })

  it("should render external links", async () => {
    const { container } = render(
      <BaseLink href="https://example.com">https://example.com</BaseLink>,
    )
    expect(container.firstElementChild).toMatchSnapshot()
  })

  it("should render download links", async () => {
    const { container } = render(
      <BaseLink
        download="sample.pdf"
        href="http://www.africau.edu/images/default/sample.pdf"
      >
        sample.pdf
      </BaseLink>,
    )
    expect(container.firstElementChild).toMatchSnapshot()
  })

  it("should render disabled links", async () => {
    const { container } = render(
      <BaseLink disabled href="https://example.com">
        https://example.com
      </BaseLink>,
    )
    expect(container.firstElementChild).toMatchSnapshot()
  })

  it("should render locale links", async () => {
    const { container } = render(<BaseLink href="/">Home</BaseLink>)
    expect(container.firstElementChild).toMatchSnapshot()
  })

  it("should render mailto links", async () => {
    const { container } = render(
      <BaseLink href="mailto:foo@example.com">foo@example.com</BaseLink>,
    )
    expect(container.firstElementChild).toMatchSnapshot()
  })

  it("should render anchor links", async () => {
    const { container } = render(<BaseLink href="#bottom">Bottom</BaseLink>)
    expect(container.firstElementChild).toMatchSnapshot()
  })
})
