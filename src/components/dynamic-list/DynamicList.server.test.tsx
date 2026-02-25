import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import DynamicListServer from "./DynamicList.server"

jest.mock("./DynamicList.view", () => ({
  DynamicListView: (_props: Record<string, unknown>) => (
    <div data-testid="view" />
  ),
}))

describe("DynamicListServer", () => {
  it("renders with required name prop", () => {
    render(
      <DynamicListServer
        name="emails"
        fields={[
          { fieldType: "input" as const, name: "email", label: "Email" },
        ]}
      />,
    )
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
