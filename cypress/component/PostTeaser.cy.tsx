import { PostTeaserView } from "../../src/components/post-teaser/PostTeaser.view"

describe("PostTeaser", () => {
  it("renders post title", () => {
    cy.mount(
      <PostTeaserView
        readMinutes={5}
        title={{ content: "Introduction to TypeScript" }}
      />,
    )
    cy.contains("Introduction to TypeScript").should("be.visible")
  })

  it("renders category chip when provided", () => {
    cy.mount(
      <PostTeaserView
        category="Engineering"
        hideCategory={false}
        image={{ src: "https://via.placeholder.com/300x200", alt: "Post" }}
        readMinutes={3}
        title={{ content: "Clean Code Principles" }}
      />,
    )
    cy.contains("Engineering").should("be.visible")
  })

  it("renders redirect link", () => {
    cy.mount(
      <PostTeaserView
        readMinutes={4}
        redirect={{ href: "/blog/clean-code", label: "Read article" }}
        title={{ content: "Clean Code" }}
      />,
    )
    cy.contains("Read article").should("be.visible")
  })

  it("renders post image when provided", () => {
    cy.mount(
      <PostTeaserView
        image={{
          src: "https://via.placeholder.com/300x200",
          alt: "Post image",
          width: 300,
          height: 200,
        }}
        readMinutes={5}
        title={{ content: "Visual Post" }}
      />,
    )
    cy.get("img").should("have.attr", "alt", "Post image")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <PostTeaserView
        category="News"
        readMinutes={2}
        title={{ content: "Accessible Post Teaser" }}
      />,
    )
    cy.checkAccessibility()
  })
})
