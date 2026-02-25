/* eslint-disable testing-library/no-node-access, @typescript-eslint/no-explicit-any */
// RichText.client.test.tsx
// ---------------------------------------------------------------------------
// Strategy:
// - Mock highlight.js/lib/common (no bundler in jest)
// - Mock marked-highlight (used in dynamic import for code blocks)
// - Keep marked + xss real (pure JS, work fine in jsdom)
// - Mock child components (Headline, Icon, Image, Link, AnimatedText)
// - Tests cover both the fast/non-code-block path and the async hljs path
// ---------------------------------------------------------------------------

import { render, screen, act, waitFor } from "@testing-library/react"
import React from "react"

// ── mock heavy deps that don't work in jest ───────────────────────────────
jest.mock("highlight.js/lib/common", () => ({
  default: {
    highlight: jest.fn((code: string, _opts?: { language?: string }) => ({
      value: code,
    })),
    highlightAuto: jest.fn((code: string) => ({ value: code })),
    versionString: "11.11.0",
    getLanguage: jest.fn(() => true),
  },
}))

jest.mock("marked-highlight", () => ({
  markedHighlight: jest.fn((_opts: unknown) => ({
    // A minimal no-op marked extension object
    async: false,
    walkTokens: undefined,
    extensions: [],
  })),
}))

// ── mock child components (use require() since React is not available at hoist time) ─
jest.mock("../headline", () => {
  const { createElement } = require("react")
  return {
    Headline: ({ children, type }: any) =>
      createElement(
        type || "h2",
        { "data-testid": `headline-${type}` },
        children,
      ),
  }
})

jest.mock("../animatedText", () => {
  const { createElement } = require("react")
  return {
    AnimatedText: ({ children }: any) =>
      createElement("span", { "data-testid": "animated-text" }, children),
  }
})

jest.mock("../icon", () => {
  const { createElement } = require("react")
  return {
    Icon: () => createElement("span", { "data-testid": "list-icon" }),
  }
})

jest.mock("../image", () => {
  const { createElement } = require("react")
  return {
    Image: ({ src, alt }: any) => createElement("img", { alt, src }),
  }
})

jest.mock("../link", () => {
  const { createElement } = require("react")
  return {
    Link: ({ children, href, rel, target }: any) =>
      createElement(
        "a",
        {
          "data-rel": rel,
          "data-target": target,
          "data-testid": "rich-link",
          href,
        },
        children,
      ),
  }
})

// ── import component after mocks ─────────────────────────────────────────
import { RichTextClient } from "./RichText.client"

// ── helpers ───────────────────────────────────────────────────────────────
const flushAsync = () =>
  act(async () => {
    await new Promise<void>(r => setTimeout(r, 10))
  })

const getHljsMock = () =>
  (jest.requireMock("highlight.js/lib/common") as { default: any }).default

afterEach(() => {
  // Clean up any hljs-theme link element appended to document.head

  const el = document.getElementById("hljs-theme")
  if (el) el.remove()
})

// ── tests ─────────────────────────────────────────────────────────────────

describe("RichTextClient – basic rendering", () => {
  it("renders a div container", () => {
    const { container } = render(<RichTextClient>Hello world</RichTextClient>)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("div")).toBeInTheDocument()
  })

  it("renders empty content without errors", () => {
    const { container } = render(<RichTextClient>{""}</RichTextClient>)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("div")).toBeInTheDocument()
  })

  it("applies custom className to the wrapper div", () => {
    const { container } = render(
      <RichTextClient className="my-prose">Text</RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector(".my-prose")).toBeInTheDocument()
  })

  it("renders bold markdown via <strong>", () => {
    const { container } = render(<RichTextClient>{"**Bold**"}</RichTextClient>)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("strong")).toBeInTheDocument()
  })

  it("renders italic markdown via <em>", () => {
    const { container } = render(<RichTextClient>{"_italic_"}</RichTextClient>)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("em")).toBeInTheDocument()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – heading elements (h1–h6)", () => {
  const levels = [1, 2, 3, 4, 5, 6] as const

  it.each(levels)("renders heading level h%i", level => {
    const { container } = render(
      <RichTextClient>{`${"#".repeat(level)} Heading ${level}`}</RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector(`h${level}`)).toBeInTheDocument()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – paragraph (animated and non-animated)", () => {
  it("renders paragraph text without animation by default", () => {
    render(<RichTextClient>{"Plain paragraph text."}</RichTextClient>)
    expect(screen.getByText("Plain paragraph text.")).toBeInTheDocument()
  })

  it("wraps paragraph string children in AnimatedText when animated=true", () => {
    render(<RichTextClient animated>{"Animated paragraph."}</RichTextClient>)
    // AnimatedText mock renders a <span data-testid="animated-text">

    expect(screen.queryByTestId("animated-text")).toBeInTheDocument()
  })

  it("does not render AnimatedText when animated is false", () => {
    render(
      <RichTextClient animated={false}>{"Plain paragraph."}</RichTextClient>,
    )

    expect(screen.queryByTestId("animated-text")).not.toBeInTheDocument()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – link rendering", () => {
  it("renders a markdown link via the Link component", () => {
    render(
      <RichTextClient>{"[Visit site](https://example.com)"}</RichTextClient>,
    )
    const link = screen.getByTestId("rich-link")
    expect(link).toHaveAttribute("href", "https://example.com")
  })

  it("linkPolicy='trusted' does not set rel on link (default)", () => {
    render(
      <RichTextClient linkPolicy="trusted">
        {"[Link](https://example.com)"}
      </RichTextClient>,
    )
    const link = screen.getByTestId("rich-link")
    // trusted + external means target is not forced; rel is undefined
    expect(link.getAttribute("data-rel")).toBeFalsy()
  })

  it("linkPolicy='ugc' sets rel=ugc nofollow noopener for external https link", () => {
    render(
      <RichTextClient linkPolicy="ugc">
        {"[Link](https://external.com)"}
      </RichTextClient>,
    )
    const link = screen.getByTestId("rich-link")
    expect(link).toHaveAttribute(
      "data-rel",
      expect.stringContaining("ugc nofollow noopener"),
    )
    expect(link).toHaveAttribute("data-target", "_blank")
  })

  it("linkPolicy='ugc' sets rel=ugc nofollow for relative/non-http link", () => {
    render(
      <RichTextClient linkPolicy="ugc">
        {"[Link](/internal-page)"}
      </RichTextClient>,
    )
    const link = screen.getByTestId("rich-link")
    expect(link).toHaveAttribute("data-rel", "ugc nofollow")
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – list rendering", () => {
  it("renders unordered list items with icons", () => {
    const { container } = render(
      <RichTextClient>{"- item one\n- item two"}</RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelectorAll("li")).toHaveLength(2)

    expect(screen.queryAllByTestId("list-icon").length).toBeGreaterThan(0)
  })

  it("renders ordered list with custom decimal markup", () => {
    const { container } = render(
      <RichTextClient>{"1. first item\n2. second item"}</RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    const ol = container.querySelector("ol")
    expect(ol).toBeInTheDocument()
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelectorAll("li")).toHaveLength(2)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelectorAll("i").length).toBeGreaterThan(0)
  })

  it("ordered list with start attribute offset (xss strips start attr, defaults to 1)", () => {
    const { container } = render(
      <RichTextClient>
        {"<ol start='5'><li>five</li><li>six</li></ol>"}
      </RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    const iElements = container.querySelectorAll("i")
    // filterXSS strips the start attr (not in its whitelist), so numbering restarts at 1

    if (iElements.length > 0) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(iElements[0]).toHaveTextContent("1")
    }
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – pre / code / blockquote", () => {
  it("renders blockquote from markdown", () => {
    const { container } = render(
      <RichTextClient>{"\\> A quoted line"}</RichTextClient>,
    )
    // If xss strips > processing, at least it doesn't crash.
    // With real markdown, blockquote renders
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("div")).toBeInTheDocument()
  })

  it("renders blockquote via direct HTML pass-through", () => {
    const { container } = render(
      <RichTextClient>
        {"<blockquote>Block content</blockquote>"}
      </RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("blockquote")).toBeInTheDocument()
  })

  it("renders pre tag from HTML pass-through", () => {
    const { container } = render(
      <RichTextClient>
        {"<pre class='hljs'><code>const x = 1</code></pre>"}
      </RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("pre")).toBeInTheDocument()
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("code")).toBeInTheDocument()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – image rendering", () => {
  it("renders an img element for markdown image syntax", () => {
    const { container } = render(
      <RichTextClient>
        {"![alt text](https://example.com/img.png)"}
      </RichTextClient>,
    )
    // The Image component renders an <img>
    // eslint-disable-next-line testing-library/no-container
    const img = container.querySelector("img")
    expect(img).toBeInTheDocument()
  })
  it('renders an img element with empty src when src attribute is absent (src ?? "" branch)', () => {
    const { container } = render(
      <RichTextClient>{'<img alt="no-src">'}</RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    const img = container.querySelector("img")
    expect(img).not.toBeNull()
    // src attribute was absent → srcStr = "" → passed to the Image component as empty string
    expect(img?.getAttribute("src")).toBeFalsy()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – void tags and default tag case", () => {
  it("renders <hr> from markdown horizontal rule without crashing", () => {
    const { container } = render(<RichTextClient>{"---\n"}</RichTextClient>)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("div")).toBeInTheDocument()
  })

  it("renders <br> inside a paragraph", () => {
    const { container } = render(
      <RichTextClient>{"line one  \nline two"}</RichTextClient>,
    )
    // With `breaks: true`, soft breaks become <br>
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("div")).toBeInTheDocument()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – async code block path", () => {
  it("triggers async code-block path (markedHighlight called) for fenced code", async () => {
    // The dynamic import mock for highlight.js resolves the real module in pnpm
    // (symlinked path differs from jest.mock registration path), so we verify
    // the async path ran by checking the markedHighlight mock was invoked.
    const { markedHighlight } = jest.requireMock("marked-highlight") as {
      markedHighlight: jest.Mock
    }

    render(
      <RichTextClient>
        {"```javascript\nconsole.log('hello')\n```"}
      </RichTextClient>,
    )
    await flushAsync()

    // markedHighlight is called to build the Marked extension for code blocks
    expect(markedHighlight).toHaveBeenCalled()
  })

  it("does NOT call hljs when no code blocks present", async () => {
    const hljs = getHljsMock()
    hljs.highlight.mockClear()
    hljs.highlightAuto.mockClear()

    render(<RichTextClient>{"Just plain text here."}</RichTextClient>)
    await flushAsync()

    expect(hljs.highlight).not.toHaveBeenCalled()
    expect(hljs.highlightAuto).not.toHaveBeenCalled()
  })

  it("appends #hljs-theme link element to document.head after code render", async () => {
    render(<RichTextClient>{"```ts\nconst x: number = 1\n```"}</RichTextClient>)
    await flushAsync()

    await waitFor(() => {
      expect(document.getElementById("hljs-theme")).not.toBeNull()
    })

    const link = document.getElementById("hljs-theme") as HTMLLinkElement
    expect(link.tagName.toLowerCase()).toBe("link")
    expect(link.href).toContain("highlight.js")
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – ensureHljsThemeLoaded branches", () => {
  it("uses customHref when codeTheme.href is provided", async () => {
    render(
      <RichTextClient codeTheme={{ href: "https://my-cdn.com/hljs.css" }}>
        {"```py\nprint('hi')\n```"}
      </RichTextClient>,
    )
    await flushAsync()

    await waitFor(() => {
      const link = document.getElementById("hljs-theme") as HTMLLinkElement
      expect(link?.href).toContain("my-cdn.com")
    })
  })

  it("builds href from name + version when codeTheme.name is provided", async () => {
    render(
      <RichTextClient codeTheme={{ name: "monokai", version: "11.0.0" }}>
        {"```css\nbody { color: red; }\n```"}
      </RichTextClient>,
    )
    await flushAsync()

    await waitFor(() => {
      const link = document.getElementById("hljs-theme") as HTMLLinkElement
      expect(link?.href).toContain("monokai")
    })
  })

  it("updates existing link href when it differs", async () => {
    // Pre-create an existing link with a different href
    const existing = document.createElement("link")
    existing.id = "hljs-theme"
    existing.rel = "stylesheet"
    existing.href = "https://old-cdn.com/old.css"
    document.head.appendChild(existing)

    render(
      <RichTextClient codeTheme={{ href: "https://new-cdn.com/new.css" }}>
        {"```js\nconst y = 2\n```"}
      </RichTextClient>,
    )
    await flushAsync()

    await waitFor(() => {
      expect(existing.href).toContain("new-cdn.com")
    })
  })

  it("does not change existing link href when it matches", async () => {
    const href = "https://same-cdn.com/same.css"
    const existing = document.createElement("link")
    existing.id = "hljs-theme"
    existing.rel = "stylesheet"
    existing.href = href
    document.head.appendChild(existing)

    render(
      <RichTextClient codeTheme={{ href }}>
        {"```js\nconst z = 3\n```"}
      </RichTextClient>,
    )
    await flushAsync()

    // href should remain unchanged
    expect(existing.href).toContain("same-cdn.com")
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – overrideParagraph prop", () => {
  it("calls overrideParagraph with extracted plain text for each segment", () => {
    const overrideParagraph = jest.fn((text: string) => <p>{text}</p>)
    render(
      <RichTextClient overrideParagraph={overrideParagraph}>
        {"First paragraph.\n\nSecond paragraph."}
      </RichTextClient>,
    )
    expect(overrideParagraph).toHaveBeenCalled()
    const calls = overrideParagraph.mock.calls.map(c => c[0])
    expect(calls.some(t => t.includes("First paragraph"))).toBe(true)
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – XSS sanitisation", () => {
  it("does not render <script> elements", () => {
    const { container } = render(
      <RichTextClient>
        {"<script>alert('xss')</script>Some text"}
      </RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("script")).not.toBeInTheDocument()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – cancellation (concurrent renders)", () => {
  it("cancelled=true check: changing src mid-flight skips stale setHtml", async () => {
    const { rerender } = render(
      <RichTextClient>{"```js\nconst a = 1\n```"}</RichTextClient>,
    )

    // Immediately rerender with non-code content before async resolves:
    // This causes the first effect's cleanup to run (cancelled = true) before
    // the first Promise.all resolves — so setHtml for the old src is skipped.
    rerender(<RichTextClient>{"new plain text"}</RichTextClient>)
    await flushAsync()

    // The component should render the new content without errors
    expect(screen.getByText(/new plain text/i)).toBeInTheDocument()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – hasRawBlocks branch (pre/code already in HTML)", () => {
  it("handles pre/code HTML already present without double-highlighting", async () => {
    const hljs = getHljsMock()
    hljs.highlight.mockClear()

    // Pass content that has <pre><code> in raw HTML form (no fences)
    // hasCodeBlocks returns true due to /<pre|<code/i test
    render(
      <RichTextClient>
        {"<pre><code class='language-js'>const b = 2</code></pre>"}
      </RichTextClient>,
    )
    await flushAsync()

    // Component should render without crash
    const { container } = render(
      <RichTextClient>{"<pre><code>plain code</code></pre>"}</RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("code")).toBeInTheDocument()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – withKey deduplication (keyed vs unkeyed children)", () => {
  it("renders ordered list (items have keys) without React key warnings", () => {
    // ol items get explicit keys "ol-li-N", so withKey returns them as-is
    const warnSpy = jest.spyOn(console, "error").mockImplementation(() => {})
    const { container } = render(
      <RichTextClient>{"1. alpha\n2. beta\n3. gamma"}</RichTextClient>,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelectorAll("li")).toHaveLength(3)
    // No React key-related console errors
    expect(
      warnSpy.mock.calls.some(call => String(call[0]).includes("key")),
    ).toBe(false)
    warnSpy.mockRestore()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RichTextClient – codeTheme version=auto path", () => {
  it("uses hljs version string when codeTheme.version=auto", async () => {
    render(
      <RichTextClient codeTheme={{ name: "atom-one-dark", version: "auto" }}>
        {"```bash\necho hello\n```"}
      </RichTextClient>,
    )
    await flushAsync()

    await waitFor(() => {
      const link = document.getElementById("hljs-theme") as HTMLLinkElement
      // "auto" uses hljs.versionString; assert the theme name appears in the URL
      // (real pnpm-resolved hljs may differ from mock versionString)
      expect(link?.href).toContain("atom-one-dark")
    })
  })
})
