import { ImageText } from "../../src/components/image-text"

describe("ImageText", () => {
  it("renders with title", () => {
    cy.mount(
      <ImageText
        content="Our team builds innovative solutions."
        title="About Us"
      />,
    )
    cy.contains("About Us").should("be.visible")
  })

  it("renders with content text", () => {
    cy.mount(
      <ImageText
        content="We focus on quality and performance."
        title="Our Mission"
      />,
    )
    cy.contains("quality and performance").should("be.visible")
  })

  it("renders with an image", () => {
    cy.mount(
      <ImageText
        content="Visual content alongside text."
        image={{
          src: "https://via.placeholder.com/400x300",
          alt: "Team photo",
          width: 400,
          height: 300,
        }}
        title="Our Team"
      />,
    )
    cy.get("img").should("have.attr", "alt", "Team photo")
  })

  it("renders with a subtitle", () => {
    cy.mount(
      <ImageText
        content="Content body text."
        subTitle="Subtitle text"
        title="Main Title"
      />,
    )
    cy.contains("Subtitle text").should("be.visible")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <ImageText
        content="Accessible content section."
        title="Accessible Section"
      />,
    )
    cy.checkAccessibility()
  })
})
