import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { PostWidget } from "./PostWidget"
import { PostWidgetView } from "./PostWidget.view"

const widgetItems = [
  {
    title: { content: "First Post" },
    redirect: { href: "/post/1" },
    category: "Tech",
  },
  {
    title: { content: "Second Post" },
    redirect: { href: "/post/2" },
    category: "Design",
  },
]

describe("PostWidget", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a section element", () => {
      const { container } = render(
        <PostWidgetView title={{ content: "Latest Posts" }} />,
      )
      // <section> without aria-label has no landmark role; query directly
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector("section")).toBeTruthy()
    })

    it("renders the widget title", () => {
      render(<PostWidgetView title={{ content: "Latest Posts" }} />)
      expect(screen.getByText("Latest Posts")).toBeInTheDocument()
    })

    it("renders list items from items prop", () => {
      render(
        <PostWidgetView
          items={widgetItems}
          title={{ content: "Recent articles" }}
        />,
      )
      expect(screen.getByText("First Post")).toBeInTheDocument()
      expect(screen.getByText("Second Post")).toBeInTheDocument()
    })

    it("renders no items when items is empty", () => {
      render(<PostWidgetView items={[]} title={{ content: "Empty widget" }} />)
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument()
    })

    it("renders structured data markup", () => {
      const { container } = render(
        <PostWidgetView
          structuredData
          items={widgetItems}
          title={{ content: "Blog posts" }}
        />,
      )
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
    it("post widget has no axe violations", async () => {
      const { container } = render(
        <PostWidgetView
          items={widgetItems}
          title={{ content: "Accessible widget" }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("empty post widget has no axe violations", async () => {
      const { container } = render(
        <PostWidgetView items={[]} title={{ content: "Empty" }} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("PostWidget island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<PostWidget />)
  })
})

describe("PostWidgetView – comprehensive prop coverage", () => {
  it("renders items with image, date, and category", () => {
    render(
      <PostWidgetView
        title={{ content: "Widget with Image" }}
        items={[
          {
            title: { content: "Image Post" },
            redirect: { href: "/post/img" },
            image: { src: "/img/pw.jpg", alt: "PW cover" },
            date: "2024-03-20",
            locale: "en-GB",
            category: "Science",
          },
        ]}
      />,
    )
    expect(screen.getByAltText("PW cover")).toBeInTheDocument()
    expect(screen.getByText("Image Post")).toBeInTheDocument()
  })

  it("renders formatted date inside list item", () => {
    render(
      <PostWidgetView
        title={{ content: "Widget" }}
        items={[
          {
            title: { content: "Dated Post" },
            redirect: { href: "/post/date" },
            date: "2024-05-15",
            locale: "en-GB",
          },
        ]}
      />,
    )
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0)
  })

  it("renders structured data JSON-LD with image and date in items", () => {
    const { container } = render(
      <PostWidgetView
        structuredData
        title={{ content: "SD Widget" }}
        items={[
          {
            title: { content: "SD Item" },
            redirect: { href: "/post/sd" },
            image: { src: "/img/sd.jpg", alt: "SD" },
            date: "2024-04-10",
            locale: "en-GB",
            category: "Health",
          },
        ]}
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()
    const data = JSON.parse(script?.innerHTML ?? "{}")
    expect(data["@type"]).toBe("ItemList")
    expect(data.itemListElement[0].item.image).toContain("/img/sd.jpg")
    expect(data.itemListElement[0].item.datePublished).toBeTruthy()
  })

  it("renders without title prop", () => {
    const { container } = render(
      <PostWidgetView
        items={[
          { title: { content: "No Title Widget" }, redirect: { href: "/p" } },
        ]}
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("section")).toBeTruthy()
  })

  it("renders with fullWidth prop", () => {
    const { container } = render(
      <PostWidgetView
        fullWidth
        items={[{ title: { content: "Wide Post" }, redirect: { href: "/p" } }]}
        title={{ content: "Full Width" }}
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("section")).toBeTruthy()
  })

  it("renders with structuredData=false omits JSON-LD script", () => {
    render(
      <PostWidgetView
        items={[{ title: { content: "No SD Post" }, redirect: { href: "/p" } }]}
        structuredData={false}
        title={{ content: "No SD" }}
      />,
    )

    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).toBeNull()
  })

  it("renders items with no image, no date, no category (false branches)", () => {
    render(
      <PostWidgetView
        items={[
          { title: { content: "Bare Post" }, redirect: { href: "/p/bare" } },
        ]}
      />,
    )
    expect(screen.getByText("Bare Post")).toBeInTheDocument()
  })

  it("renders with all classes and componentsProps fully provided", () => {
    const allClasses = {
      root: "root-c",
      cardContainer: "card-cnt-c",
      card: "card-c",
      list: "list-c",
      listItem: "list-item-c",
      content: "content-c",
      image: "image-c",
      imageContainer: "image-cnt-c",
      imageLink: "image-link-c",
      headline: "headline-c",
      date: "date-c",
      title: "title-c",
    }
    const itemClasses = {
      li: "li-c",
      article: "article-c",
      header: "header-c",
      content: "content-c",
      imageLink: "img-link-c",
      image: "img-c",
      headline: "hl-c",
      date: "date-c",
    }
    render(
      <PostWidgetView
        classes={allClasses}
        title={{ content: "Classed Widget", className: "title-cls" }}
        componentsProps={{
          image: { decoding: "sync", loading: "eager", sizes: "50vw" },
          link: { target: "_blank" },
          title: { size: "lg" as const },
        }}
        items={[
          {
            title: { content: "Classed Post", className: "t-cls" },
            redirect: { href: "/post/classed", className: "r-cls" },
            image: {
              src: "/img/c.jpg",
              alt: "Classed img",
              decoding: "async",
              loading: "lazy" as const,
              sizes: "25vw",
            },
            date: "2024-01-01",
            locale: "en-GB",
            category: "Art",
            classes: itemClasses,
            componentsProps: {
              image: {
                decoding: "sync",
                loading: "eager" as const,
                sizes: "10vw",
              },
              headline: { size: "sm" as const },
              link: { target: "_blank" },
            },
          },
        ]}
      />,
    )
    expect(screen.getByText("Classed Post")).toBeInTheDocument()
    expect(screen.getByAltText("Classed img")).toBeInTheDocument()
  })
})
