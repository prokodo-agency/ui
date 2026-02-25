import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import PaginationServer from "./Pagination.server"

jest.mock("./Pagination.view", () => ({
  PaginationView: ({
    page,
    totalPages,
    readOnly,
  }: {
    page?: number
    totalPages?: number
    readOnly?: boolean
  }) => (
    <div
      data-page={page}
      data-readonly={String(readOnly)}
      data-testid="view"
      data-total={totalPages}
    />
  ),
}))

describe("PaginationServer", () => {
  it("renders with required props", () => {
    render(<PaginationServer page={1} totalPages={10} />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("forces readOnly=true", () => {
    render(<PaginationServer page={1} totalPages={10} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-readonly", "true")
  })
})
