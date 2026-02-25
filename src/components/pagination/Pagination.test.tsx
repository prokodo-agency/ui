import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Pagination } from "./Pagination"
import { PaginationView } from "./Pagination.view"

describe("Pagination", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders nothing when totalPages <= 1", () => {
      const { container } = render(<Pagination page={1} totalPages={1} />)
      expect(container).toBeEmptyDOMElement()
    })

    it("renders a nav element when totalPages > 1", () => {
      render(<Pagination page={1} totalPages={5} />)
      expect(screen.getByRole("navigation")).toBeInTheDocument()
    })

    it("renders with default aria-label 'Pagination'", () => {
      render(<Pagination page={1} totalPages={5} />)
      expect(
        screen.getByRole("navigation", { name: "Pagination" }),
      ).toBeInTheDocument()
    })

    it("renders a custom translated aria-label", () => {
      render(
        <Pagination
          page={1}
          totalPages={5}
          translations={{ pagination: "Seitennavigation" }}
        />,
      )
      expect(
        screen.getByRole("navigation", { name: "Seitennavigation" }),
      ).toBeInTheDocument()
    })

    it("renders Previous and Next page buttons", () => {
      render(<Pagination page={2} totalPages={5} />)
      expect(
        screen.getByRole("button", { name: /previous page/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /next page/i }),
      ).toBeInTheDocument()
    })

    it("disables the previous button on first page", () => {
      render(<Pagination page={1} totalPages={5} />)
      expect(
        screen.getByRole("button", { name: /previous page/i }),
      ).toBeDisabled()
    })

    it("disables the next button on last page", () => {
      render(<Pagination page={5} totalPages={5} />)
      expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled()
    })

    it("disables all controls when disabled=true", () => {
      render(<Pagination disabled page={3} totalPages={5} />)
      const buttons = screen.getAllByRole("button")
      buttons.forEach(btn => expect(btn).toBeDisabled())
    })

    it("marks active page button", () => {
      render(<Pagination page={2} totalPages={5} />)
      const page2Btn = screen.getByRole("button", { name: /page 2/i })
      expect(page2Btn).toHaveAttribute("aria-current", "page")
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onNext when next button is clicked", async () => {
      const handleNext = jest.fn()
      const { user } = render(
        // Use PaginationView directly to bypass server readOnly restriction
        <PaginationView page={2} totalPages={5} onNext={handleNext} />,
      )
      await user.click(screen.getByRole("button", { name: /next page/i }))
      expect(handleNext).toHaveBeenCalledTimes(1)
    })

    it("calls onPrev when prev button is clicked", async () => {
      const handlePrev = jest.fn()
      const { user } = render(
        <PaginationView page={2} totalPages={5} onPrev={handlePrev} />,
      )
      await user.click(screen.getByRole("button", { name: /previous page/i }))
      expect(handlePrev).toHaveBeenCalledTimes(1)
    })

    it("calls onPageChange with page number when a page button is clicked", async () => {
      const handlePageChange = jest.fn()
      const { user } = render(
        <PaginationView
          page={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />,
      )
      await user.click(screen.getByRole("button", { name: /page 3/i }))
      expect(handlePageChange).toHaveBeenCalledWith(3)
    })

    it("uses onPageChange as fallback for prev when onPrev not provided", async () => {
      const handlePageChange = jest.fn()
      const { user } = render(
        <PaginationView
          page={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />,
      )
      await user.click(screen.getByRole("button", { name: /previous page/i }))
      expect(handlePageChange).toHaveBeenCalledWith(2)
    })

    it("uses onPageChange as fallback for next when onNext not provided", async () => {
      const handlePageChange = jest.fn()
      const { user } = render(
        <PaginationView
          page={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />,
      )
      await user.click(screen.getByRole("button", { name: /next page/i }))
      expect(handlePageChange).toHaveBeenCalledWith(4)
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("pagination has no axe violations", async () => {
      const { container } = render(<Pagination page={2} totalPages={10} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("first page state has no axe violations", async () => {
      const { container } = render(<Pagination page={1} totalPages={5} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("last page state has no axe violations", async () => {
      const { container } = render(<Pagination page={5} totalPages={5} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
