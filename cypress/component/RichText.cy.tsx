import { RichTextServer } from "../../src/components/rich-text/RichText.server"

describe("RichText", () => {
  it("renders markdown as HTML", () => {
    cy.mount(<RichTextServer>## Hello World</RichTextServer>)
    cy.get("h2").should("contain", "Hello World")
  })

  it("renders paragraph text", () => {
    cy.mount(<RichTextServer>This is paragraph text.</RichTextServer>)
    cy.contains("This is paragraph text.").should("be.visible")
  })

  it("renders bold text", () => {
    cy.mount(<RichTextServer>**Bold text**</RichTextServer>)
    cy.get("strong").should("contain", "Bold text")
  })

  it("renders a link from markdown", () => {
    cy.mount(<RichTextServer>[Visit us](https://example.com)</RichTextServer>)
    cy.get("a").should("have.attr", "href", "https://example.com")
  })

  it("renders unordered list items", () => {
    cy.mount(
      <RichTextServer>{`- Item one\n- Item two\n- Item three`}</RichTextServer>,
    )
    cy.get("li").should("have.length.at.least", 3)
  })

  it("sanitizes XSS content", () => {
    cy.mount(
      <RichTextServer>
        {"<script>alert('xss')</script>Safe content"}
      </RichTextServer>,
    )
    // Only look inside the mounted component root; framework script tags are expected outside
    cy.get("[data-cy-root] script").should("not.exist")
    cy.contains("Safe content").should("be.visible")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <RichTextServer>
        {`## Heading\n\nSome accessible paragraph text.`}
      </RichTextServer>,
    )
    cy.checkAccessibility()
  })
})
