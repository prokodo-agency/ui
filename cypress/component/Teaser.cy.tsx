import { Teaser } from "../../src/components/teaser"

describe("Teaser", () => {
  it("renders with a title", () => {
    cy.mount(
      <Teaser
        content="We build amazing digital experiences."
        title={{ content: "Our Services" }}
      />,
    )
    cy.contains("Our Services").should("be.visible")
  })

  it("renders with content", () => {
    cy.mount(
      <Teaser
        content="Innovative solutions for modern businesses."
        title={{ content: "Innovation" }}
      />,
    )
    cy.contains("Innovative solutions").should("be.visible")
  })

  it("renders with an image", () => {
    cy.mount(
      <Teaser
        content="Visual teaser"
        image={{
          src: "https://via.placeholder.com/400x200",
          alt: "Teaser image",
          width: 400,
          height: 200,
        }}
        title={{ content: "Visual Content" }}
      />,
    )
    cy.get("img").should("have.attr", "alt", "Teaser image")
  })

  it("renders with a redirect button", () => {
    cy.mount(
      <Teaser
        content="Read more about us."
        redirect={{ href: "/about", label: "Read more" }}
        title={{ content: "About" }}
      />,
    )
    cy.contains("Read more").should("be.visible")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <Teaser
        content="Accessible teaser content."
        title={{ content: "Accessible Teaser" }}
      />,
    )
    cy.checkAccessibility()
  })
})
