import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import FormFieldServer from "./FormField.server"

// Mock the view layers of each sub-component so we can assert rendering
// without loading Quill or other browser-only deps. The island components
// (Input, Select, Switch, Slider, DatePicker) are handled by the global
// createIsland → Server mock, but their views still need to be mocked.
jest.mock("../input/Input.view", () => ({
  InputView: ({ name }: { name?: string }) => (
    <div data-name={name} data-testid="input-view" />
  ),
}))
jest.mock("../select/Select.view", () => ({
  SelectView: ({ id }: { id?: string }) => (
    <div data-id={id} data-testid="select-view" />
  ),
}))
jest.mock("../switch/Switch.view", () => ({
  SwitchView: ({ name }: { name?: string }) => (
    <div data-name={name} data-testid="switch-view" />
  ),
}))
jest.mock("../slider/Slider.view", () => ({
  SliderView: ({ id }: { id?: string }) => (
    <div data-id={id} data-testid="slider-view" />
  ),
}))
jest.mock("../datePicker/DatePicker.view", () => ({
  DatePickerView: ({ name }: { name?: string }) => (
    <div data-name={name} data-testid="datepicker-view" />
  ),
}))

describe("FormFieldServer", () => {
  it("renders input field type", () => {
    render(<FormFieldServer fieldType="input" name="email" />)
    expect(screen.getByTestId("input-view")).toBeInTheDocument()
  })

  it("renders select field type", () => {
    // `items` is a FormFieldSelect-only prop; Omit<FormField union, "onChange"> doesn't distribute,
    // so select-specific props are absent from the shared FormFieldProps type.
    // Cast to Parameters to bypass the type gap while testing runtime behaviour.
    render(
      <FormFieldServer
        {...({
          fieldType: "select",
          id: "c",
          items: [],
          label: "Country",
          name: "country",
        } as unknown as Parameters<typeof FormFieldServer>[0])}
      />,
    )
    expect(screen.getByTestId("select-view")).toBeInTheDocument()
  })

  it("renders switch field type", () => {
    render(<FormFieldServer fieldType="switch" name="enabled" />)
    expect(screen.getByTestId("switch-view")).toBeInTheDocument()
  })

  it("renders slider field type", () => {
    render(<FormFieldServer fieldType="slider" id="vol" name="volume" />)
    expect(screen.getByTestId("slider-view")).toBeInTheDocument()
  })

  it("renders date field type", () => {
    render(<FormFieldServer fieldType="date" label="DOB" name="dob" />)
    expect(screen.getByTestId("datepicker-view")).toBeInTheDocument()
  })

  it("returns null for unknown/default field type", () => {
    const { container } = render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <FormFieldServer fieldType={"unknown" as any} name="x" />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("returns null when visible is false", () => {
    const { container } = render(
      <FormFieldServer fieldType="input" name="x" visible={false} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("renders input field type with messagesFields.errors.input (covers optional chain)", () => {
    render(
      <FormFieldServer
        fieldType="input"
        messagesFields={{ errors: { input: { required: "Required" } } }}
        name="email"
      />,
    )
    expect(screen.getByTestId("input-view")).toBeInTheDocument()
  })

  it("renders date field type with messagesFields.errors.date (covers optional chain)", () => {
    render(
      <FormFieldServer
        fieldType="date"
        label="DOB"
        messagesFields={{ errors: { date: { required: "Required" } } }}
        name="dob"
      />,
    )
    expect(screen.getByTestId("datepicker-view")).toBeInTheDocument()
  })
})
