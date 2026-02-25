import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import ImageServer from "./Image.server"

describe("ImageServer", () => {
  it("renders an img element with alt", () => {
    render(<ImageServer alt="hero" height={100} src="test.jpg" width={100} />)
    const img = screen.getByAltText("hero")
    expect(img).toBeInTheDocument()
  })

  it("renders with no alt", () => {
    render(<ImageServer alt="" height={100} src="test.jpg" width={100} />)
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector("img")).toBeInTheDocument()
  })

  it("renders with caption in a figure", () => {
    render(
      <ImageServer
        alt="img"
        caption="A caption"
        height={100}
        src="test.jpg"
        width={100}
      />,
    )
    expect(screen.getByText("A caption")).toBeInTheDocument()
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector("figure")).toBeInTheDocument()
  })

  it("sets fetchPriority=high when priority=true", () => {
    render(
      <ImageServer
        priority
        alt="img"
        height={100}
        src="test.jpg"
        width={100}
      />,
    )
    // eslint-disable-next-line testing-library/no-node-access
    const img = document.querySelector("img")
    expect(img?.getAttribute("fetchpriority")).toBe("high")
  })

  it("renders with StaticImageData object as src (object src path)", () => {
    render(
      <ImageServer
        alt="static"
        src={{ src: "/static/img.jpg", width: 200, height: 100 }}
      />,
    )
    // eslint-disable-next-line testing-library/no-node-access
    const img = document.querySelector("img")
    expect(img?.getAttribute("src")).toContain("/static/img.jpg")
  })

  it("renders with undefined src when src is non-string, non-object", () => {
    // @ts-expect-error - testing invalid src
    render(<ImageServer alt="no-src" height={100} src={null} width={100} />)
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector("img")).toBeInTheDocument()
  })
})
