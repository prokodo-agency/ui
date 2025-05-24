import { expect } from "@jest/globals"

import { render } from "@/tests"
import { mockRouter } from "@/tests/mocks/router"

import { BaseLink } from "./BaseLink"

const locales = ["de", "en"]

describe("The common BaseLink component", () => {
  for (const locale of locales) {
    describe(`using locale '${locale}'`, () => {
      beforeEach(() => {
        mockRouter({
          back: jest.fn(),
          forward: jest.fn(),
          push: jest.fn(),
          replace: jest.fn(),
          refresh: jest.fn(),
          prefetch: jest.fn(),
        })
      })

      it("should render internal links", () => {
        const { container } = render(<BaseLink href="/">Home</BaseLink>)
        expect(container.firstElementChild).toMatchSnapshot()
      })

      it("should render external links", () => {
        const { container } = render(
          <BaseLink href="https://example.com">https://example.com</BaseLink>,
        )
        expect(container.firstElementChild).toMatchSnapshot()
      })

      it("should render download links", () => {
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

      it("should render disabled links", () => {
        const { container } = render(
          <BaseLink disabled href="https://example.com">
            https://example.com
          </BaseLink>,
        )
        expect(container.firstElementChild).toMatchSnapshot()
      })

      it("should render locale links", () => {
        const { container } = render(
          <BaseLink href="/" locale={locale}>
            Home
          </BaseLink>,
        )
        expect(container.firstElementChild).toMatchSnapshot()
      })

      it("should render mailto links", () => {
        const { container } = render(
          <BaseLink href="mailto:foo@example.com">foo@example.com</BaseLink>,
        )
        expect(container.firstElementChild).toMatchSnapshot()
      })

      it("should render anchor links", () => {
        const { container } = render(<BaseLink href="#bottom">Bottom</BaseLink>)
        expect(container.firstElementChild).toMatchSnapshot()
      })
    })
  }
})
