/* eslint-disable testing-library/no-node-access */
import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import { RichTextServer } from "./RichText.server"

describe("RichTextServer", () => {
  it("renders markdown content as HTML", () => {
    const { container } = render(<RichTextServer>{"# Hello"}</RichTextServer>)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("h1")).toBeInTheDocument()
  })

  it("renders without crashing with simple text", () => {
    render(<RichTextServer>{"Plain text"}</RichTextServer>)
    expect(screen.getByText("Plain text")).toBeInTheDocument()
  })

  it("renders without crashing when children is undefined", () => {
    // Covers children ?? "" fallback branch at line 34
    const { container } = render(<RichTextServer>{undefined}</RichTextServer>)
    expect(container).toBeInTheDocument()
  })
})
