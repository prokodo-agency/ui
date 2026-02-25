import { PostItemView } from "../../src/components/post-item/PostItem.view"

describe("PostItem", () => {
  it("renders post title", () => {
    cy.mount(
      <PostItemView
        readMinutes={0}
        title={{ content: "How to Build Scalable APIs" }}
        wordCount={800}
      />,
    )
    cy.contains("How to Build Scalable APIs").should("be.visible")
  })

  it("renders post content excerpt", () => {
    cy.mount(
      <PostItemView
        content="APIs are the backbone of modern web applications..."
        readMinutes={0}
        title={{ content: "API Design Patterns" }}
        wordCount={500}
      />,
    )
    cy.contains("APIs are the backbone").should("be.visible")
  })

  it("renders as an article element", () => {
    cy.mount(
      <PostItemView
        readMinutes={0}
        title={{ content: "Test Article" }}
        wordCount={300}
      />,
    )
    cy.get("article").should("exist")
  })

  it("renders post category", () => {
    cy.mount(
      <PostItemView
        category="Technology"
        readMinutes={0}
        title={{ content: "Tech Trends 2025" }}
        wordCount={600}
      />,
    )
    // Category is rendered as structured-data meta tag, not visible text
    cy.get("meta[itemprop='articleSection']").should(
      "have.attr",
      "content",
      "Technology",
    )
  })

  it("renders read more button when button prop is provided", () => {
    cy.mount(
      <PostItemView
        button={{ title: "Read more", redirect: { href: "/blog/post" } }}
        readMinutes={0}
        title={{ content: "Full Post" }}
        wordCount={1000}
      />,
    )
    cy.contains("Read more").should("be.visible")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <PostItemView
        readMinutes={0}
        title={{ content: "Accessible Blog Post" }}
        wordCount={400}
      />,
    )
    cy.checkAccessibility()
  })
})
