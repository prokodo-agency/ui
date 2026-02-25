import { Image } from "../../src/components/image"

describe("Image", () => {
  it("renders an image with alt text", () => {
    cy.mount(
      <Image
        alt="A beautiful landscape"
        height={300}
        src="https://via.placeholder.com/400x300"
        width={400}
      />,
    )
    cy.get("img").should("have.attr", "alt", "A beautiful landscape")
  })

  it("renders with the provided src", () => {
    cy.mount(
      <Image
        alt="Test image"
        height={200}
        src="https://via.placeholder.com/300x200"
        width={300}
      />,
    )
    cy.get("img").should("have.attr", "src").and("include", "placeholder")
  })

  it("renders with a caption", () => {
    cy.mount(
      <Image
        alt="Captioned image"
        caption="Photo by John Doe"
        height={200}
        src="https://via.placeholder.com/300x200"
        width={300}
      />,
    )
    cy.contains("Photo by John Doe").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <Image
        alt="Accessible image"
        height={200}
        src="https://via.placeholder.com/300x200"
        width={300}
      />,
    )
    cy.checkAccessibility()
  })
})
