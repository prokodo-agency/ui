import { render, screen } from "@/tests"

// Mock runtime — default: no custom imageComponent
jest.mock("@/helpers/runtime.client", () => ({
  useUIRuntime: jest.fn(() => ({ imageComponent: undefined })),
}))

const { useUIRuntime } = require("@/helpers/runtime.client") as {
  useUIRuntime: jest.Mock
}

const ImageClient = require("./Image.client").default

describe("Image.client", () => {
  beforeEach(() => {
    useUIRuntime.mockReturnValue({ imageComponent: undefined })
  })

  it("renders a plain <img> when no custom imageComponent", () => {
    render(<ImageClient alt="test" src="https://example.com/img.jpg" />)
    const img = screen.getByRole("img")
    expect(img.tagName).toBe("IMG")
    expect(img).toHaveAttribute("src", "https://example.com/img.jpg")
    expect(img).toHaveAttribute("alt", "test")
  })

  it("uses empty string for alt when not provided", () => {
    const { container } = render(
      <ImageClient src="https://example.com/img.jpg" />,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("img")).toHaveAttribute("alt", "")
  })

  it("wraps in <figure> with <figcaption> when caption is provided", () => {
    const { container } = render(
      <ImageClient
        alt="photo"
        caption="My caption"
        src="https://example.com/img.jpg"
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("figure")).not.toBeNull()
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("figcaption")).toHaveTextContent(
      "My caption",
    )
  })

  it("does NOT wrap in figure when caption is not a string", () => {
    const { container } = render(
      <ImageClient alt="photo" src="https://example.com/img.jpg" />,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("figure")).toBeNull()
  })

  it("sets loading=eager and fetchPriority=high when priority=true", () => {
    render(<ImageClient priority alt="test" src="test.jpg" />)
    const img = screen.getByRole("img")
    expect(img).toHaveAttribute("loading", "eager")
    expect(img).toHaveAttribute("fetchpriority", "high")
  })

  it("extracts src from StaticImageData object", () => {
    const staticSrc = { src: "/static/img.jpg", width: 100, height: 100 }
    render(<ImageClient alt="static" src={staticSrc as never} />)
    expect(screen.getByRole("img")).toHaveAttribute("src", "/static/img.jpg")
  })

  it("uses custom imageComponent from context", () => {
    const CustomImg = jest
      .fn()
      .mockImplementation(({ alt, ...rest }: Record<string, unknown>) => (
        <img
          alt={String(alt ?? "")}
          data-testid="custom-img"
          {...(rest as object)}
        />
      ))
    useUIRuntime.mockReturnValue({ imageComponent: CustomImg })

    render(<ImageClient alt="custom" src="custom.jpg" />)
    const img = screen.getByTestId("custom-img")
    expect(img).toBeInTheDocument()
    expect(CustomImg).toHaveBeenCalled()
  })

  it("strips next/image props when rendering plain img", () => {
    render(
      <ImageClient
        alt="test"
        blurDataURL="data:image/png;base64,abc"
        fill={undefined as never}
        placeholder={"blur" as never}
        priority={false}
        quality={75 as never}
        src="test.jpg"
      />,
    )
    const img = screen.getByRole("img")
    expect(img).not.toHaveAttribute("placeholder")
    expect(img).not.toHaveAttribute("quality")
    expect(img).not.toHaveAttribute("blurdataurl")
  })

  it("handles src that is not a string or StaticImageData (else branch: src=undefined)", () => {
    // Passing a non-string, non-object value for src hits the else branch
    const { container } = render(<ImageClient alt="test" src={42 as never} />)
    // eslint-disable-next-line testing-library/no-container
    const img = container.querySelector("img")
    expect(img).not.toBeNull()
  })
})
