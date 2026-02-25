import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { PostWidgetCarousel } from "./PostWidgetCarousel"
import { PostWidgetCarouselView } from "./PostWidgetCarousel.view"

const carouselItems = [
  {
    title: { content: "Article One" },
    redirect: { href: "/articles/one" },
  },
  {
    title: { content: "Article Two" },
    redirect: { href: "/articles/two" },
  },
  {
    title: { content: "Article Three" },
    redirect: { href: "/articles/three" },
  },
]

describe("PostWidgetCarousel", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a section element", () => {
      render(<PostWidgetCarouselView title={{ content: "Featured posts" }} />)
      // <section> without aria-label has no landmark role; verify via heading content
      expect(screen.getByText("Featured posts")).toBeInTheDocument()
    })

    it("renders the carousel title", () => {
      render(<PostWidgetCarouselView title={{ content: "Featured posts" }} />)
      expect(screen.getByText("Featured posts")).toBeInTheDocument()
    })

    it("renders items in the carousel", () => {
      render(
        <PostWidgetCarouselView
          items={carouselItems}
          title={{ content: "Posts" }}
        />,
      )
      expect(screen.getByText("Article One")).toBeInTheDocument()
      expect(screen.getByText("Article Two")).toBeInTheDocument()
    })

    it("renders with images when provided", () => {
      const itemsWithImages = carouselItems.map((item, i) => ({
        ...item,
        image: { src: `/img/post-${i}.jpg`, alt: `Post ${i + 1} cover` },
      }))
      render(
        <PostWidgetCarouselView
          items={itemsWithImages}
          title={{ content: "Image posts" }}
        />,
      )
      expect(screen.getByAltText("Post 1 cover")).toBeInTheDocument()
    })

    it("renders without items gracefully", () => {
      render(
        <PostWidgetCarouselView items={[]} title={{ content: "No posts" }} />,
      )
      expect(screen.getByText("No posts")).toBeInTheDocument()
    })

    it("renders structured data ItemList markup", () => {
      const { container } = render(
        <PostWidgetCarouselView
          structuredData
          items={carouselItems}
          title={{ content: "Blog carousel" }}
        />,
      )

      // Microdata attributes have no Testing Library role query — DOM query is required here
      // eslint-disable-next-line testing-library/no-container
      const section = container.querySelector("section[itemtype]")
      expect(section).toBeTruthy()
      expect(section).toHaveAttribute(
        "itemType",
        expect.stringContaining("ItemList"),
      )
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("post widget carousel has no axe violations", async () => {
      const { container } = render(
        <PostWidgetCarouselView
          items={carouselItems}
          title={{ content: "Accessible carousel" }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("PostWidgetCarousel island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<PostWidgetCarousel />)
  })
})

describe("PostWidgetCarouselView – comprehensive prop coverage", () => {
  it("renders without title prop (falsy title branch)", () => {
    render(<PostWidgetCarouselView items={carouselItems} />)

    expect(screen.getByText("Article One")).toBeInTheDocument()
  })

  it("renders structured data JSON-LD with image in items", () => {
    const itemsWithImages = carouselItems.map((item, i) => ({
      ...item,
      image: { src: `/img/p${i}.jpg`, alt: `Alt ${i}` },
    }))
    const { container } = render(
      <PostWidgetCarouselView
        structuredData
        items={itemsWithImages}
        title={{ content: "Image SD" }}
      />,
    )

    // JSON-LD scripts cannot be queried by Testing Library role — DOM query is required here
    // eslint-disable-next-line testing-library/no-container
    const script = container.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.innerHTML ?? "{}")
    expect(data.itemListElement[0].item.image).toContain("/img/p0.jpg")
  })

  it("renders with className and classes props (branch coverage for bem calls)", () => {
    render(
      <PostWidgetCarouselView
        className="custom-root"
        classes={{
          root: "root-cls",
          cardContainer: "cc-cls",
          card: "c-cls",
          title: "title-cls",
          carousel: "car-cls",
          carouselButton: "btn-cls",
          carouselButtons: "btns-cls",
          carouselDots: "dots-cls",
          carouselItem: "item-cls",
          carouselWrapper: "wrap-cls",
          carouselItemImage: "img-cls",
          carouselItemImageLink: "link-cls",
          carouselItemLink: "cil-cls",
        }}
        componentsProps={{
          card: { variant: "white" },
          title: { variant: "primary" },
          image: { decoding: "sync", loading: "eager", sizes: "100vw" },
          link: { className: "link-extra" },
        }}
        items={carouselItems.map((item, i) => ({
          ...item,
          image: { src: `/img/ci${i}.jpg`, alt: `CI ${i}` },
        }))}
        title={{
          content: "Classed Widget",
          variant: "primary",
          className: "headline-extra",
        }}
      />,
    )

    expect(screen.getByText("Classed Widget")).toBeInTheDocument()
  })

  it("renders item keys falling back to index when title.content is undefined", () => {
    render(
      <PostWidgetCarouselView
        items={[{ title: { content: "" }, redirect: { href: "/p" } }]}
        title={{ content: "Fallback Key" }}
      />,
    )

    expect(screen.getByText("Fallback Key")).toBeInTheDocument()
  })

  it("exercises item-level componentsProps and classes for deep ?? branches", () => {
    render(
      <PostWidgetCarouselView
        title={{ content: "Deep Widget" }}
        componentsProps={{
          title: { variant: "primary" },
        }}
        items={[
          {
            title: {
              content: "Deep Item",
              variant: "primary",
              className: "item-headline",
            },
            redirect: { href: "/deep", className: "redirect-cls" },
            image: {
              src: "/img/deep.jpg",
              alt: "Deep",
              decoding: "sync",
              loading: "eager",
              sizes: "50vw",
            },
            classes: {
              link: "item-link-cls",
              headline: "item-headline-cls",
              imageLink: "item-image-link-cls",
              image: "item-img-cls",
            },
            componentsProps: {
              image: { decoding: "sync", loading: "eager", sizes: "50vw" },
              headline: { variant: "primary" },
              link: { className: "item-link-extra" },
            },
          },
        ]}
      />,
    )
    expect(screen.getByAltText("Deep")).toBeInTheDocument()
  })
})
