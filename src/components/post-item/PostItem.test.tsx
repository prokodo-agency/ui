import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { PostItem } from "./PostItem"
import { PostItemView } from "./PostItem.view"

describe("PostItem", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders an article element", () => {
      render(<PostItemView readMinutes={0} title={{ content: "Test Post" }} />)
      expect(screen.getByRole("article")).toBeInTheDocument()
    })

    it("renders the post title", () => {
      render(
        <PostItemView readMinutes={0} title={{ content: "My Blog Post" }} />,
      )
      expect(screen.getByText("My Blog Post")).toBeInTheDocument()
    })

    it("renders category when provided", () => {
      const { container } = render(
        <PostItemView
          category="Technology"
          readMinutes={0}
          title={{ content: "Article" }}
        />,
      )
      // category is rendered as <meta content="Technology" itemprop="articleSection">
      // eslint-disable-next-line testing-library/no-container
      const meta = container.querySelector("meta[itemprop='articleSection']")
      expect(meta?.getAttribute("content")).toBe("Technology")
    })

    it("renders structured data itemtype", () => {
      render(
        <PostItemView
          structuredData
          readMinutes={0}
          title={{ content: "SEO Post" }}
        />,
      )
      const article = screen.getByRole("article")
      expect(article).toHaveAttribute(
        "itemType",
        expect.stringContaining("BlogPosting"),
      )
    })

    it("renders read button when provided", () => {
      render(
        <PostItemView
          button={{ title: "Read more" }}
          readMinutes={0}
          title={{ content: "Post" }}
        />,
      )
      expect(
        screen.getByRole("button", { name: /read more/i }),
      ).toBeInTheDocument()
    })

    it("renders post image when provided", () => {
      // PostItem image prop is a string URL (not an object); it renders in a Card background
      const { container } = render(
        <PostItemView
          image="/blog/image.jpg"
          readMinutes={0}
          title={{ content: "Image Post" }}
        />,
      )
      // image renders as Card background, not an <img> with alt text
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector("aside")).toBeTruthy()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("post item has no axe violations", async () => {
      const { container } = render(
        <PostItemView readMinutes={0} title={{ content: "Accessible post" }} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("post item with image has no axe violations", async () => {
      const { container } = render(
        <PostItemView
          image="/img/photo.jpg"
          readMinutes={0}
          title={{ content: "Post with image" }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("PostItem island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<PostItem title={{ content: "My Post" }} />)
  })
})

describe("PostItemView – comprehensive prop coverage", () => {
  it("renders author, date, readMinutes, readCount, content, wordCount", () => {
    render(
      <PostItemView
        author={{ name: "Jane Doe" }}
        content="This is the article body."
        date="2024-01-15"
        locale="en-GB"
        readCount={42}
        readMinutes={5}
        title={{ content: "Full Post" }}
        wordCount={500}
      />,
    )
    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    expect(screen.getByText(/5 min read/)).toBeInTheDocument()
    expect(screen.getByText(/42/)).toBeInTheDocument()
    expect(screen.getByText("This is the article body.")).toBeInTheDocument()
  })

  it("renders with animate=false (plain div wrapper)", () => {
    render(
      <PostItemView
        animate={false}
        readMinutes={0}
        title={{ content: "No Animate" }}
      />,
    )
    expect(screen.getByRole("article")).toBeInTheDocument()
  })

  it("renders structured data with author + image in JSON-LD", () => {
    const { container } = render(
      <PostItemView
        author={{ name: "Author Name" }}
        image="/blog/photo.jpg"
        readMinutes={0}
        structuredData={true}
        title={{ content: "JSON-LD Post" }}
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()
    const data = JSON.parse(script?.innerHTML ?? "{}")
    expect(data.author?.name).toBe("Author Name")
    expect(data.image).toContain("/blog/photo.jpg")
  })

  it("does not render structured data when structuredData=false", () => {
    const { container } = render(
      <PostItemView
        readMinutes={0}
        structuredData={false}
        title={{ content: "No Schema" }}
      />,
    )
    expect(
      // eslint-disable-next-line testing-library/no-container
      container.querySelector('script[type="application/ld+json"]'),
    ).toBeNull()
  })

  it("renders with title having size/type/className, button, classes, and componentsProps fully specified", () => {
    const allClasses = {
      root: "root-c",
      grid: "grid-c",
      main: "main-c",
      animation: "anim-c",
      headline: "hl-c",
      info: "info-c",
      date: "date-c",
      readingTime: "rt-c",
      readCount: "rc-c",
      contentParagraph: "cp-c",
      button: "btn-c",
      buttonContent: "bc-c",
      media: "media-c",
      imageWrapper: "iw-c",
      imageContentWrapper: "icw-c",
    }
    render(
      <PostItemView
        structuredData
        animate={false}
        author={{ name: "Jane Doe", avatar: { src: "/avatar.jpg" } }}
        category="Science"
        classes={allClasses}
        content="Detailed article body."
        date="2024-03-01"
        image="/img/full-post.jpg"
        locale="en-GB"
        readCount={10}
        readMinutes={8}
        wordCount={1200}
        button={{
          title: "Click me",
          redirect: { href: "/action" },
          variant: "contained" as const,
          contentClassName: "btn-cnt",
          className: "btn-cls",
        }}
        componentsProps={{
          headline: {
            size: "xl" as const,
            className: "cp-hl",
            variant: "primary" as const,
          },
          author: { className: "auth-c" },
          button: {
            variant: "outlined" as const,
            className: "cp-btn",
            contentClassName: "cp-btncnt",
          },
          card: { variant: "white" as const },
        }}
        title={{
          content: "Full Post",
          size: "lg" as const,
          type: "h1" as const,
          className: "title-cls",
        }}
      />,
    )
    expect(screen.getByText("Full Post")).toBeInTheDocument()
    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    expect(screen.getByText("Click me")).toBeInTheDocument()
    expect(screen.getByText("Detailed article body.")).toBeInTheDocument()
  })
})
