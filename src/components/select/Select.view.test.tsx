import { render } from "@/tests"

import { SelectView } from "./Select.view"

const ITEMS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
]

describe("SelectView – value fallback coverage", () => {
  it("passes empty string fallback when value is undefined (single)", () => {
    let capturedValue: unknown
    render(
      <SelectView
        id="sel"
        items={ITEMS}
        label="Fruit"
        _clientState={
          {
            open: false,
            buttonRef: { current: null },
            listRef: { current: null },
            onButtonClick: jest.fn(),
            onButtonKey: jest.fn(),
            onOptionClick: jest.fn(),
            renderListbox: (args: { value: unknown }) => {
              capturedValue = args.value
              return null
            },
          } as never
        }
      />,
    )
    expect(capturedValue).toBe("")
  })

  it("passes empty array fallback when value is undefined and multiple=true", () => {
    let capturedValue: unknown
    render(
      <SelectView
        multiple
        id="sel-multi"
        items={ITEMS}
        label="Fruits"
        _clientState={
          {
            open: false,
            buttonRef: { current: null },
            listRef: { current: null },
            onButtonClick: jest.fn(),
            onButtonKey: jest.fn(),
            onOptionClick: jest.fn(),
            renderListbox: (args: { value: unknown }) => {
              capturedValue = args.value
              return null
            },
          } as never
        }
      />,
    )
    expect(capturedValue).toEqual([])
  })
})
