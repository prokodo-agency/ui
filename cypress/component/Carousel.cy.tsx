import { CarouselView } from "../../src/components/carousel/Carousel.view"

describe("Carousel", () => {
  it("renders carousel items", () => {
    cy.mount(
      <CarouselView>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </CarouselView>,
    )
    cy.contains("Slide 1").should("exist")
  })

  it("renders skeleton when no children", () => {
    cy.mount(<CarouselView>{[]}</CarouselView>)
    cy.get("[class*='Skeleton']").should("exist")
  })

  it("renders all provided slides", () => {
    cy.mount(
      <CarouselView>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </CarouselView>,
    )
    cy.get("[class*='Carousel__item'], [class*='item']").should(
      "have.length.at.least",
      3,
    )
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <CarouselView>
        <div>Accessible slide 1</div>
        <div>Accessible slide 2</div>
      </CarouselView>,
    )
    cy.checkAccessibility()
  })
})
