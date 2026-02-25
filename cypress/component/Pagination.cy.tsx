import { Pagination } from "../../src/components/pagination"

describe("Pagination", () => {
  it("renders navigation with page buttons", () => {
    cy.mount(<Pagination page={2} totalPages={5} />)
    cy.get("nav[aria-label='Pagination']").should("exist")
    cy.get("[aria-current='page']").should("contain.text", "2")
  })

  it("disables prev button on first page", () => {
    cy.mount(<Pagination page={1} totalPages={5} />)
    cy.get("[aria-label='Previous page']").should("be.disabled")
  })

  it("disables next button on last page", () => {
    cy.mount(<Pagination page={5} totalPages={5} />)
    cy.get("[aria-label='Next page']").should("be.disabled")
  })

  it("calls onNext when next clicked", () => {
    const onNext = cy.stub().as("onNext")
    cy.mount(<Pagination page={2} totalPages={5} onNext={onNext} />)
    cy.get("[aria-label='Next page']").click()
    cy.get("@onNext").should("have.been.calledOnce")
  })

  it("calls onPageChange with page number when page button clicked", () => {
    const onPageChange = cy.stub().as("onPageChange")
    cy.mount(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />)
    cy.get("[aria-label='Go to page 3']").click()
    cy.get("@onPageChange").should("have.been.calledWith", 3)
  })

  it("has no accessibility violations", () => {
    cy.mount(<Pagination page={3} totalPages={10} />)
    cy.checkAccessibility()
  })

  it("calls onPrev when previous button is clicked", () => {
    const onPrev = cy.stub().as("onPrev")
    cy.mount(<Pagination page={3} totalPages={5} onPrev={onPrev} />)
    cy.get("[aria-label='Previous page']").click()
    cy.get("@onPrev").should("have.been.calledOnce")
  })

  it("shows current page as aria-current=page", () => {
    cy.mount(<Pagination page={4} totalPages={10} />)
    cy.get("[aria-current='page']").should("contain.text", "4")
  })

  it("first page: prev disabled, next enabled", () => {
    cy.mount(
      <Pagination
        page={1}
        totalPages={5}
        onNext={cy.stub()}
        onPrev={cy.stub()}
      />,
    )
    cy.get("[aria-label='Previous page']").should("be.disabled")
    cy.get("[aria-label='Next page']").should("not.be.disabled")
  })

  it("last page: next disabled, prev enabled", () => {
    cy.mount(
      <Pagination
        page={5}
        totalPages={5}
        onNext={cy.stub()}
        onPrev={cy.stub()}
      />,
    )
    cy.get("[aria-label='Next page']").should("be.disabled")
    cy.get("[aria-label='Previous page']").should("not.be.disabled")
  })
})
