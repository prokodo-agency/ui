import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { PostTeaser } from "./PostTeaser"
import { PostTeaserView } from "./PostTeaser.view"

describe("PostTeaser", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a card with the post title", () => {
      render(
        <PostTeaserView
          readMinutes={0}
          title={{ content: "Hello World Post" }}
        />,
      )
      expect(screen.getByText("Hello World Post")).toBeInTheDocument()
    })

    it("renders category when provided", () => {
      const { container } = render(
        <PostTeaserView
          category="Design"
          readMinutes={0}
          title={{ content: "Article" }}
        />,
      )
      // Category is stored in structured data meta tag
      // eslint-disable-next-line testing-library/no-container
      const meta = container.querySelector("meta[itemprop='articleSection']")
      expect(meta?.getAttribute("content")).toBe("Design")
    })

    it("hides category when hideCategory=true", () => {
      render(
        <PostTeaserView
          hideCategory
          category="Design"
          readMinutes={0}
          title={{ content: "Article" }}
        />,
      )
      expect(screen.queryByText("Design")).not.toBeInTheDocument()
    })

    it("renders a redirect label when provided", () => {
      render(
        <PostTeaserView
          readMinutes={0}
          redirect={{ href: "/post/1", label: "Read more" }}
          title={{ content: "Post" }}
        />,
      )
      expect(screen.getByText("Read more")).toBeInTheDocument()
    })

    it("renders an image when provided", () => {
      render(
        <PostTeaserView
          image={{ src: "/img/post.jpg", alt: "Post cover" }}
          readMinutes={0}
          title={{ content: "Visual Article" }}
        />,
      )
      expect(screen.getByAltText("Post cover")).toBeInTheDocument()
    })

    it("renders structured data script for BlogPosting", () => {
      render(
        <PostTeaserView
          structuredData
          category="SEO"
          readMinutes={0}
          title={{ content: "SEO Teaser" }}
        />,
      )

      const scripts = document.querySelectorAll(
        'script[type="application/ld+json"]',
      )
      expect(scripts.length).toBeGreaterThanOrEqual(1)
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("post teaser has no axe violations", async () => {
      const { container } = render(
        <PostTeaserView
          readMinutes={0}
          title={{ content: "Accessible teaser" }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("post teaser with redirect has no axe violations", async () => {
      const { container } = render(
        <PostTeaserView
          readMinutes={0}
          redirect={{ href: "/post/1", label: "Discover more" }}
          title={{ content: "Teaser with link" }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("PostTeaser island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<PostTeaser title={{ content: "Test Teaser" }} />)
  })
})

describe("PostTeaserView – comprehensive prop coverage", () => {
  it("renders category chip and readCount chip inside image wrapper", () => {
    render(
      <PostTeaserView
        category="Tech"
        hideCategory={false}
        image={{ src: "/img/cover.jpg", alt: "Cover" }}
        readCount={99}
        readMinutes={0}
        title={{ content: "Article" }}
      />,
    )
    expect(screen.getByLabelText("Category Tech")).toBeInTheDocument()
    expect(screen.getByLabelText("Read 99 times")).toBeInTheDocument()
    expect(screen.getByText("99")).toBeInTheDocument()
  })

  it("renders content when provided", () => {
    render(
      <PostTeaserView
        content="Teaser body paragraph."
        readMinutes={0}
        title={{ content: "Content Article" }}
      />,
    )
    expect(screen.getByText("Teaser body paragraph.")).toBeInTheDocument()
  })

  it("renders date with readMinutes > 0", () => {
    render(
      <PostTeaserView
        date="2024-06-10"
        locale="en-GB"
        readMinutes={7}
        title={{ content: "Dated Post" }}
      />,
    )
    expect(screen.getByText(/7 min read/)).toBeInTheDocument()
  })

  it("renders date without readMinutes", () => {
    render(
      <PostTeaserView
        date="2024-06-10"
        locale="en-GB"
        readMinutes={0}
        title={{ content: "Dated Post" }}
      />,
    )
    // date is displayed; readMinutes null branch
    expect(screen.getByRole("article")).toBeInTheDocument()
  })

  it("renders wordCount meta when provided", () => {
    const { container } = render(
      <PostTeaserView
        readMinutes={0}
        title={{ content: "Word Count Post" }}
        wordCount={350}
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    const meta = container.querySelector("meta[itemprop='wordCount']")
    expect(meta?.getAttribute("content")).toBe("350")
  })

  it("renders structured data with image and readCount in JSON-LD", () => {
    const { container } = render(
      <PostTeaserView
        structuredData
        image={{ src: "/img/jld.jpg", alt: "JLD" }}
        readCount={10}
        readMinutes={0}
        title={{ content: "SD Post" }}
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()
    const data = JSON.parse(script?.innerHTML ?? "{}")
    expect(data.image).toContain("/img/jld.jpg")
    expect(data.interactionStatistic?.userInteractionCount).toBe(10)
  })

  it("renders structured data with formatted date in JSON-LD", () => {
    const { container } = render(
      <PostTeaserView
        structuredData
        date="2024-06-10"
        locale="en-GB"
        readMinutes={0}
        title={{ content: "Date SD Post" }}
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    const script = container.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.innerHTML ?? "{}")
    expect(data.datePublished).toBeTruthy()
  })

  it("renders without structuredData script when structuredData=false", () => {
    render(
      <PostTeaserView
        readMinutes={0}
        structuredData={false}
        title={{ content: "No SD Post" }}
      />,
    )

    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).toBeNull()
  })

  it("renders with all classes, componentsProps and image with explicit defaults", () => {
    const allClasses = {
      root: "r",
      header: "hd",
      imageWrapper: "iw",
      meta: "m",
      metaCategory: "mc",
      imageContainer: "ic",
      image: "im",
      cardContent: "cc",
      content: "co",
      cardFooter: "cf",
      date: "da",
      link: "lk",
      linkIcon: "li",
      headline: "hl",
    }
    render(
      <PostTeaserView
        structuredData
        category="Art"
        classes={allClasses}
        content="Body text"
        date="2024-01-15"
        hideCategory={false}
        locale="en-GB"
        readCount={5}
        readMinutes={3}
        redirect={{ href: "/post/full", label: "Read more" }}
        wordCount={800}
        componentsProps={{
          headline: { variant: "primary" as const },
          linkIcon: { size: "md" as const },
          card: { variant: "white" as const },
        }}
        image={{
          src: "/img/full.jpg",
          alt: "Full img",
          decoding: "sync",
          loading: "eager" as const,
          sizes: "25vw",
        }}
        title={{
          content: "Full PostTeaser",
          className: "t-cls",
          variant: "primary" as const,
        }}
      />,
    )
    expect(screen.getByText("Full PostTeaser")).toBeInTheDocument()
    expect(screen.getByAltText("Full img")).toBeInTheDocument()
    expect(screen.getByText("Read more")).toBeInTheDocument()
  })
})
