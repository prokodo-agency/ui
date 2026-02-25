import { render, screen } from "@/tests"

jest.mock("./Pagination.view", () => ({
  PaginationView: (props: Record<string, unknown>) => (
    <div data-page={String(props.page ?? "")} data-testid="pagination-view" />
  ),
}))

const PaginationClient = require("./Pagination.client").default

describe("Pagination.client", () => {
  it("renders PaginationView", () => {
    render(<PaginationClient page={1} totalPages={5} onPageChange={() => {}} />)
    expect(screen.getByTestId("pagination-view")).toBeInTheDocument()
  })

  it("passes page prop through", () => {
    render(
      <PaginationClient page={3} totalPages={10} onPageChange={() => {}} />,
    )
    expect(screen.getByTestId("pagination-view")).toHaveAttribute(
      "data-page",
      "3",
    )
  })
})
