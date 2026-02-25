import { PostWidgetCarouselView } from "../../src/components/post-widget-carousel/PostWidgetCarousel.view"

const carouselItems = [
  {
    title: { content: "Carousel Post One" },
    redirect: { href: "/blog/carousel-1" },
  },
  {
    title: { content: "Carousel Post Two" },
    redirect: { href: "/blog/carousel-2" },
  },
  {
    title: { content: "Carousel Post Three" },
    redirect: { href: "/blog/carousel-3" },
  },
]

describe("PostWidgetCarousel", () => {
  it("renders carousel title", () => {
    cy.mount(
      <PostWidgetCarouselView
        items={carouselItems}
        title={{ content: "Featured Articles" }}
      />,
    )
    cy.contains("Featured Articles").should("be.visible")
  })

  it("renders carousel items", () => {
    cy.mount(
      <PostWidgetCarouselView
        items={carouselItems}
        title={{ content: "Blog Carousel" }}
      />,
    )
    cy.contains("Carousel Post One").should("exist")
  })

  it("renders as a section element", () => {
    cy.mount(
      <PostWidgetCarouselView
        items={carouselItems}
        title={{ content: "Posts" }}
      />,
    )
    cy.get("section").should("exist")
  })

  it("renders item links", () => {
    cy.mount(
      <PostWidgetCarouselView
        items={carouselItems}
        title={{ content: "Posts" }}
      />,
    )
    cy.get("a[href='/blog/carousel-1']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <PostWidgetCarouselView
        items={carouselItems}
        title={{ content: "Accessible Carousel" }}
      />,
    )
    cy.checkAccessibility()
  })
})
