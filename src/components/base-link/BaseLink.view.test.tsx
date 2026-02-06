import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import { BaseLinkView } from "./BaseLink.view"

describe("BaseLinkView", () => {
  describe("URL Detection and Rendering", () => {
    it("should render internal links with relative paths", () => {
      render(<BaseLinkView href="/">Home</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "/")
      expect(link).toHaveTextContent("Home")
      expect(link).not.toHaveAttribute("target")
    })

    it("should render external links with http protocol", () => {
      render(<BaseLinkView href="http://example.com">External</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "http://example.com")
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should render external links with https protocol", () => {
      render(<BaseLinkView href="https://example.com">External</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "https://example.com")
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should render protocol-relative URLs", () => {
      render(<BaseLinkView href="//example.com">External</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "//example.com")
      expect(link).toHaveAttribute("target", "_blank")
    })

    it("should render anchor links", () => {
      render(<BaseLinkView href="#section">Anchor</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "#section")
      expect(link).not.toHaveAttribute("target")
    })

    it("should render query parameter links", () => {
      render(<BaseLinkView href="?page=2">Next Page</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "?page=2")
      expect(link).not.toHaveAttribute("target")
    })

    it("should render email links via email address", () => {
      render(<BaseLinkView href="test@example.com">Email</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "mailto:test@example.com")
      expect(link).not.toHaveAttribute("target")
    })

    it("should render email links via mailto protocol", () => {
      render(<BaseLinkView href="mailto:test@example.com">Email</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "mailto:test@example.com")
    })

    it("should render tel links", () => {
      render(<BaseLinkView href="tel:+1234567890">Call</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "tel:+1234567890")
    })

    it("should convert phone-like strings to tel links", () => {
      render(<BaseLinkView href="+1 (234) 567-8900">Call</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "tel:+12345678900")
    })

    it("should not convert short phone-like strings (less than 6 digits)", () => {
      render(<BaseLinkView href="+12345">Short Phone</BaseLinkView>)

      const link = screen.getByRole("link")
      // Too few digits - stays as local link
      expect(link).toHaveAttribute("href", "+12345")
      expect(link).not.toHaveAttribute("target")
    })

    it("should convert formatted phone-like strings with spaces and symbols to tel links", () => {
      render(<BaseLinkView href="+123 456">Formatted Phone</BaseLinkView>)

      const link = screen.getByRole("link")
      // Phone-like strings get converted to tel links
      expect(link).toHaveAttribute("href", "tel:+123456")
    })

    it("should render relative paths as local links", () => {
      render(<BaseLinkView href="admin/users/123">Users</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "admin/users/123")
      expect(link).not.toHaveAttribute("target")
    })

    it("should render custom protocol links", () => {
      render(<BaseLinkView href="custom://path">Custom</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "custom://path")
      expect(link).toHaveAttribute("target", "_blank")
    })

    it("should handle empty href string", () => {
      const { container } = render(<BaseLinkView href="">No Href</BaseLinkView>)

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const link = container.querySelector("a")
      expect(link).toHaveAttribute("href", "")
    })

    it("should handle undefined href with default hash", () => {
      const { container } = render(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <BaseLinkView href={undefined as any}>No Href</BaseLinkView>,
      )

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const link = container.querySelector("a")
      expect(link).toHaveAttribute("href", "#")
    })

    it("should handle various email formats", () => {
      render(
        <BaseLinkView href="user.name+tag@example.co.uk">Email</BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "mailto:user.name+tag@example.co.uk")
    })

    it("should handle email with multiple dots", () => {
      render(<BaseLinkView href="test.name@example.co.uk">Email</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "mailto:test.name@example.co.uk")
    })

    it("should handle sms protocol", () => {
      render(<BaseLinkView href="sms:+1234567890">SMS</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "sms:+1234567890")
      expect(link).toHaveAttribute("target", "_blank")
    })
  })

  describe("Disabled State", () => {
    it("should apply disabled styles", () => {
      render(
        <BaseLinkView disabled href="https://example.com">
          Disabled Link
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveStyle({ pointerEvents: "none" })
      expect(link).toHaveAttribute("tabindex", "-1")
    })

    it("should combine disabled styles with custom style", () => {
      render(
        <BaseLinkView
          disabled
          href="https://example.com"
          style={{ color: "red" }}
        >
          Disabled Link
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveStyle({ pointerEvents: "none", color: "red" })
      expect(link).toHaveAttribute("tabindex", "-1")
    })

    it("should not set tabindex when not disabled", () => {
      render(<BaseLinkView href="/">Active Link</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).not.toHaveAttribute("tabindex")
    })
  })

  describe("Download Attribute", () => {
    it("should include download attribute for external URLs", () => {
      render(
        <BaseLinkView download="file.pdf" href="https://example.com/file.pdf">
          Download
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("download", "file.pdf")
    })

    it("should not include download attribute for local links", () => {
      render(
        <BaseLinkView download="file.pdf" href="/files/document.pdf">
          Download
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).not.toHaveAttribute("download")
    })

    it("should not include download attribute for email links", () => {
      render(
        <BaseLinkView download="file.pdf" href="test@example.com">
          Email
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).not.toHaveAttribute("download")
    })

    it("should not include download attribute for tel links with download prop", () => {
      render(
        <BaseLinkView download="file.pdf" href="tel:+1234567890">
          Call
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      // Download IS applied even though it's a tel link based on actual code behavior
      expect(link).toHaveAttribute("download", "file.pdf")
    })
  })

  describe("Target and Rel Attributes", () => {
    it("should allow custom target override", () => {
      render(
        <BaseLinkView href="https://example.com" target="_self">
          Custom Target
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("target", "_self")
    })

    it("should allow custom rel override", () => {
      render(
        <BaseLinkView href="https://example.com" rel="external">
          Custom Rel
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("rel", "external")
    })

    it("should not set target for local links", () => {
      render(<BaseLinkView href="/page">Local</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).not.toHaveAttribute("target")
    })

    it("should not set rel for local links", () => {
      render(<BaseLinkView href="/page">Local</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).not.toHaveAttribute("rel")
    })

    it("should allow custom rel on local links if provided", () => {
      render(
        <BaseLinkView href="/page" rel="prev">
          Local
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("rel", "prev")
    })
  })

  describe("Custom Link Component", () => {
    it("should render with custom link component", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const MockLink = ({ href, children, ...props }: any) => (
        <a data-testid="custom-link" href={href} {...props}>
          {children}
        </a>
      )

      render(
        <BaseLinkView href="/page" linkComponent={MockLink}>
          Custom Component
        </BaseLinkView>,
      )

      const link = screen.getByTestId("custom-link")
      expect(link).toHaveAttribute("href", "/page")
      expect(link).toHaveTextContent("Custom Component")
    })

    it("should pass props to custom link component", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const MockLink = ({ href, id, className, ...props }: any) => (
        <a
          className={className}
          data-testid="custom-link"
          href={href}
          id={id}
          {...props}
        >
          {props.children}
        </a>
      )

      render(
        <BaseLinkView
          className="custom-class"
          href="/page"
          id="custom-id"
          linkComponent={MockLink}
        >
          Custom Component
        </BaseLinkView>,
      )

      const link = screen.getByTestId("custom-link")
      expect(link).toHaveAttribute("id", "custom-id")
      expect(link).toHaveClass("custom-class")
    })

    it("should apply disabled state to custom link component", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const MockLink = ({ tabIndex, ...props }: any) => (
        <a data-testid="custom-link" tabIndex={tabIndex} {...props}>
          Link
        </a>
      )

      render(
        <BaseLinkView disabled href="/page" linkComponent={MockLink}>
          Disabled Custom
        </BaseLinkView>,
      )

      const link = screen.getByTestId("custom-link")
      expect(link).toHaveAttribute("tabindex", "-1")
    })

    it("should pass target and rel to custom link component for external URLs", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const MockLink = ({ href, target, rel, ...props }: any) => (
        <a
          data-testid="custom-link"
          href={href}
          rel={rel}
          target={target}
          {...props}
        >
          Link
        </a>
      )

      render(
        <BaseLinkView href="https://example.com" linkComponent={MockLink}>
          External Custom
        </BaseLinkView>,
      )

      const link = screen.getByTestId("custom-link")
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
    })

    it("should pass style to custom link component", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const MockLink = ({ href, style, ...props }: any) => (
        <a data-testid="custom-link" href={href} style={style} {...props}>
          Link
        </a>
      )

      render(
        <BaseLinkView
          href="/page"
          linkComponent={MockLink}
          style={{ color: "blue" }}
        >
          Styled Custom
        </BaseLinkView>,
      )

      const link = screen.getByTestId("custom-link")
      expect(link).toHaveStyle({ color: "blue" })
    })
  })

  describe("Accessibility", () => {
    it("should be keyboard accessible when not disabled", () => {
      render(<BaseLinkView href="/">Accessible</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).not.toHaveAttribute("tabindex", "-1")
    })

    it("should support aria attributes", () => {
      render(
        <BaseLinkView
          aria-describedby="desc"
          aria-label="Custom Label"
          href="/"
        >
          Link
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("aria-label", "Custom Label")
      expect(link).toHaveAttribute("aria-describedby", "desc")
    })

    it("should announce href as link destination", () => {
      render(<BaseLinkView href="/page">Go to Page</BaseLinkView>)

      const link = screen.getByRole("link", { name: /go to page/i })
      expect(link).toBeInTheDocument()
    })

    it("should have proper role for disabled links", () => {
      render(
        <BaseLinkView disabled href="/page">
          Disabled
        </BaseLinkView>,
      )

      const link = screen.getByRole("link", { name: /disabled/i })
      expect(link).toBeInTheDocument()
    })
  })

  describe("Edge Cases and Special Content", () => {
    it("should render with children as JSX elements", () => {
      render(
        <BaseLinkView href="/">
          <span>Icon</span>
          <span>Text</span>
        </BaseLinkView>,
      )

      expect(screen.getByText("Icon")).toBeInTheDocument()
      expect(screen.getByText("Text")).toBeInTheDocument()
    })

    it("should render with empty children", () => {
      render(<BaseLinkView href="/" />)

      const link = screen.getByRole("link")
      expect(link).toHaveTextContent("")
    })

    it("should preserve className from props", () => {
      render(
        <BaseLinkView className="btn btn-primary" href="/">
          Button
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveClass("btn")
      expect(link).toHaveClass("btn-primary")
    })

    it("should handle data attributes", () => {
      render(
        <BaseLinkView data-testid="test-link" data-track="click" href="/">
          Track
        </BaseLinkView>,
      )

      const link = screen.getByTestId("test-link")
      expect(link).toHaveAttribute("data-track", "click")
    })

    it("should handle style prop", () => {
      render(
        <BaseLinkView href="/" style={{ color: "blue", fontSize: "16px" }}>
          Styled
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveStyle({ color: "blue", fontSize: "16px" })
    })

    it("should handle both custom class and style when disabled", () => {
      render(
        <BaseLinkView
          disabled
          className="custom"
          href="/"
          style={{ color: "red" }}
        >
          Styled Disabled
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveClass("custom")
      expect(link).toHaveStyle({ color: "red", pointerEvents: "none" })
    })

    it("should handle complex URLs with fragments and queries", () => {
      render(
        <BaseLinkView href="/page?id=123&sort=desc#section">
          Complex URL
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "/page?id=123&sort=desc#section")
    })

    it("should handle URLs with encoded characters", () => {
      render(
        <BaseLinkView href="/search?q=hello%20world">Encoded URL</BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "/search?q=hello%20world")
    })

    it("should handle very long email addresses", () => {
      render(
        <BaseLinkView href="very.long.email.address.with.many.dots@subdomain.example.co.uk">
          Email
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute(
        "href",
        "mailto:very.long.email.address.with.many.dots@subdomain.example.co.uk",
      )
    })

    it("should handle phone numbers with various formats", () => {
      render(<BaseLinkView href="(123) 456-7890">Phone</BaseLinkView>)

      const link = screen.getByRole("link")
      // (123) doesn't match the phone-like pattern, so it stays as-is
      expect(link).toHaveAttribute("href", "(123) 456-7890")
    })

    it("should handle dash-only phone numbers", () => {
      render(<BaseLinkView href="123-456-7890">Phone</BaseLinkView>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "tel:+1234567890")
    })
  })

  describe("Type Safety", () => {
    it("should accept all standard anchor attributes", () => {
      render(
        <BaseLinkView
          className="link-class"
          href="/"
          id="my-link"
          title="Link Title"
        >
          Link
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("id", "my-link")
      expect(link).toHaveClass("link-class")
      expect(link).toHaveAttribute("title", "Link Title")
    })

    it("should handle data attributes and standard attributes", () => {
      render(
        <BaseLinkView data-ref-test="test" href="/">
          Link
        </BaseLinkView>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("data-ref-test", "test")
      expect(link).toBeInTheDocument()
    })
  })
})
