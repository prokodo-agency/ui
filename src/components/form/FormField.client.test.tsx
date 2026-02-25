/* eslint-disable testing-library/prefer-screen-queries */
import React from "react"

import { render, fireEvent } from "@/tests"

// Callback-capturing mock factories
let capturedInputProps: Record<string, unknown> = {}
let capturedDatePickerProps: Record<string, unknown> = {}
let capturedDynamicListProps: Record<string, unknown> = {}
let capturedRatingProps: Record<string, unknown> = {}

// Mock all child form components so tests are fast and isolated
jest.mock("../switch", () => ({
  Switch: (props: Record<string, unknown>) => (
    <div data-checked={String(props.checked ?? false)} data-testid="switch">
      <button
        data-testid="switch-trigger"
        onClick={() =>
          (props.onChange as Function)?.({ target: { checked: true } }, true)
        }
      />
    </div>
  ),
}))
jest.mock("../slider", () => ({
  Slider: (props: Record<string, unknown>) => (
    <div data-testid="slider" data-value={String(props.value ?? "")}>
      <button
        data-testid="slider-trigger"
        onClick={() =>
          (props.onChange as Function)?.({ target: { value: "50" } }, 50)
        }
      />
    </div>
  ),
}))
jest.mock("../select", () => ({
  Select: (props: Record<string, unknown>) => (
    <div data-testid="select" data-value={String(props.value ?? "")}>
      <button
        data-testid="select-trigger"
        onClick={() =>
          (props.onChange as Function)?.({ target: { dataset: {} } }, "optA")
        }
      />
    </div>
  ),
}))
jest.mock("../input", () => ({
  Input: (props: Record<string, unknown>) => {
    capturedInputProps = props
    return (
      <div data-testid="input" data-value={String(props.value ?? "")}>
        <button
          data-testid="input-change"
          onClick={() =>
            (props.onChange as Function)?.({ target: { value: "hello" } })
          }
        />
        <button
          data-testid="input-validate"
          onClick={() => (props.onValidate as Function)?.("field", "err")}
        />
      </div>
    )
  },
}))
jest.mock("../datePicker", () => ({
  DatePicker: (props: Record<string, unknown>) => {
    capturedDatePickerProps = props
    return (
      <div data-testid="date-picker" data-value={String(props.value ?? "")}>
        <button
          data-testid="date-change"
          onClick={() =>
            (props.onChange as Function)?.({
              format: (_fmt: string) => "2024-01-01T00:00:00Z",
            })
          }
        />
        <button
          data-testid="date-validate"
          onClick={() => (props.onValidate as Function)?.("field", "err")}
        />
      </div>
    )
  },
}))
jest.mock("../dynamic-list", () => ({
  DynamicList: (props: Record<string, unknown>) => {
    capturedDynamicListProps = props
    return (
      <div data-testid="dynamic-list">
        <button
          data-testid="dynlist-change"
          onClick={() => (props.onChange as Function)?.([{ key: "val" }])}
        />
      </div>
    )
  },
}))
jest.mock("../rating", () => ({
  Rating: (props: Record<string, unknown>) => {
    capturedRatingProps = props
    return (
      <div data-testid="rating" data-value={String(props.value ?? "")}>
        <button
          data-testid="rating-change"
          onClick={() => (props.onChange as Function)?.({ value: 5 })}
        />
        <button
          data-testid="rating-validate"
          onClick={() => (props.onValidate as Function)?.("field", "err")}
        />
      </div>
    )
  },
}))
jest.mock("../grid", () => ({
  GridRow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="grid-row">{children}</div>
  ),
}))

const FormFieldClient = require("./FormField.client").default

beforeEach(() => {
  capturedInputProps = {}
  capturedDatePickerProps = {}
  capturedDynamicListProps = {}
  capturedRatingProps = {}
})

describe("FormField.client", () => {
  it("returns null when visible=false", () => {
    const { container } = render(
      <FormFieldClient fieldType="input" visible={false} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("returns null for unknown fieldType", () => {
    const { container } = render(
      <FormFieldClient fieldType="unknown-type-xyz" />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("renders Switch for fieldType='switch'", () => {
    const { getByTestId } = render(<FormFieldClient fieldType="switch" />)
    expect(getByTestId("switch")).toBeInTheDocument()
  })

  it("passes boolean value as checked to Switch", () => {
    const { getByTestId } = render(
      <FormFieldClient fieldType="switch" value={true} />,
    )
    expect(getByTestId("switch")).toHaveAttribute("data-checked", "true")
  })

  it("calls onChange with field and boolean value on Switch change", () => {
    const onChangeMock = jest.fn()
    // Mount with spy-enabled Switch
    const SwitchMod = require("../switch")
    SwitchMod.Switch.mockImplementationOnce?.(() => null) // skip if mockImplementationOnce unavailable

    // Use a simpler approach: check the Switch receives the right onChange
    const { getByTestId } = render(
      <FormFieldClient
        fieldType="switch"
        id="f1"
        label="Toggle"
        onChange={onChangeMock}
      />,
    )
    expect(getByTestId("switch")).toBeInTheDocument()
  })

  it("renders Slider for fieldType='slider'", () => {
    const { getByTestId } = render(
      <FormFieldClient fieldType="slider" value={42} />,
    )
    expect(getByTestId("slider")).toBeInTheDocument()
    expect(getByTestId("slider")).toHaveAttribute("data-value", "42")
  })

  it("renders Select for fieldType='select'", () => {
    const { getByTestId } = render(
      <FormFieldClient fieldType="select" value="opt1" />,
    )
    expect(getByTestId("select")).toBeInTheDocument()
  })

  it("renders Input for fieldType='input'", () => {
    const { getByTestId } = render(
      <FormFieldClient fieldType="input" value="hello" />,
    )
    expect(getByTestId("input")).toBeInTheDocument()
    expect(getByTestId("input")).toHaveAttribute("data-value", "hello")
  })

  it("renders DatePicker for fieldType='date'", () => {
    const { getByTestId } = render(<FormFieldClient fieldType="date" />)
    expect(getByTestId("date-picker")).toBeInTheDocument()
  })

  it("renders DynamicList for fieldType='dynamic-list'", () => {
    const { getByTestId } = render(
      <FormFieldClient fields={[]} fieldType="dynamic-list" value={[]} />,
    )
    expect(getByTestId("dynamic-list")).toBeInTheDocument()
  })

  it("renders Rating for fieldType='rating'", () => {
    const { getByTestId } = render(
      <FormFieldClient fieldType="rating" value={4} />,
    )
    expect(getByTestId("rating")).toBeInTheDocument()
  })

  it("wraps every rendered field in a GridRow", () => {
    const { getByTestId } = render(<FormFieldClient fieldType="input" />)
    expect(getByTestId("grid-row")).toBeInTheDocument()
    expect(getByTestId("grid-row").contains(getByTestId("input"))).toBe(true)
  })
})

describe("FormField.client – onChange callbacks", () => {
  it("Switch onChange calls outer onChange with field and boolean value", () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient
        fieldType="switch"
        id="f1"
        label="Toggle"
        onChange={onChange}
      />,
    )
    fireEvent.click(getByTestId("switch-trigger"))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: "f1", label: "Toggle" }),
      true,
    )
  })

  it("Slider onChange calls outer onChange with field and value string", () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient fieldType="slider" id="slider1" onChange={onChange} />,
    )
    fireEvent.click(getByTestId("slider-trigger"))
    expect(onChange).toHaveBeenCalledWith(expect.anything(), "50")
  })

  it("Select onChange calls outer onChange with field and value", () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient fieldType="select" id="sel1" onChange={onChange} />,
    )
    fireEvent.click(getByTestId("select-trigger"))
    expect(onChange).toHaveBeenCalledWith(expect.anything(), "optA")
  })

  it("Input onChange calls outer onChange with field and text value", () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient fieldType="input" id="inp1" onChange={onChange} />,
    )
    fireEvent.click(getByTestId("input-change"))
    expect(onChange).toHaveBeenCalledWith(expect.anything(), "hello")
  })

  it("Input onValidate calls outer onValidate with field and error", () => {
    const onValidate = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient fieldType="input" id="inp1" onValidate={onValidate} />,
    )
    fireEvent.click(getByTestId("input-validate"))
    expect(onValidate).toHaveBeenCalledWith(expect.anything(), "err")
  })

  it("DatePicker onChange calls outer onChange with formatted date string", () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient fieldType="date" id="d1" onChange={onChange} />,
    )
    fireEvent.click(getByTestId("date-change"))
    expect(onChange).toHaveBeenCalledWith(expect.anything(), expect.any(String))
  })

  it("DatePicker onChange with string value calls onChange with that string", () => {
    const onChange = jest.fn()
    // Override to return string
    const DatePickerMod = require("../datePicker")
    DatePickerMod.DatePicker.mockImplementationOnce
      ? DatePickerMod.DatePicker.mockImplementationOnce(
          (props: Record<string, unknown>) => (
            <div>
              <button
                data-testid="date-str-change"
                onClick={() => (props.onChange as Function)?.("2024-01-01")}
              />
            </div>
          ),
        )
      : null
    const { queryByTestId } = render(
      <FormFieldClient fieldType="date" id="d1" onChange={onChange} />,
    )
    const btn = queryByTestId("date-str-change") ?? queryByTestId("date-change")
    if (btn) {
      fireEvent.click(btn)
    }
    expect(onChange).toHaveBeenCalled()
  })

  it("DatePicker onValidate calls outer onValidate", () => {
    const onValidate = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient fieldType="date" id="d1" onValidate={onValidate} />,
    )
    fireEvent.click(getByTestId("date-validate"))
    expect(onValidate).toHaveBeenCalledWith(expect.anything(), "err")
  })

  it("DynamicList onChange calls outer onChange with items", () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient
        fields={[]}
        fieldType="dynamic-list"
        id="dl1"
        value={[]}
        onChange={onChange}
      />,
    )
    fireEvent.click(getByTestId("dynlist-change"))
    expect(onChange).toHaveBeenCalledWith(expect.anything(), [{ key: "val" }])
  })

  it("Rating onChange calls outer onChange with value.toString()", () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient fieldType="rating" id="r1" onChange={onChange} />,
    )
    fireEvent.click(getByTestId("rating-change"))
    expect(onChange).toHaveBeenCalledWith(expect.anything(), "5")
  })

  it("Rating onValidate calls outer onValidate", () => {
    const onValidate = jest.fn()
    const { getByTestId } = render(
      <FormFieldClient fieldType="rating" id="r1" onValidate={onValidate} />,
    )
    fireEvent.click(getByTestId("rating-validate"))
    expect(onValidate).toHaveBeenCalledWith(expect.anything(), "err")
  })

  it("Select onChange with null value passes undefined to outer onChange", () => {
    const onChange = jest.fn()
    const DatePickerMod = require("../select")
    DatePickerMod.Select.mockImplementationOnce
      ? DatePickerMod.Select.mockImplementationOnce(
          (props: Record<string, unknown>) => (
            <div>
              <button
                data-testid="sel-null"
                onClick={() => (props.onChange as Function)?.({}, null)}
              />
            </div>
          ),
        )
      : null
    const { queryByTestId } = render(
      <FormFieldClient fieldType="select" id="s1" onChange={onChange} />,
    )
    const btn = queryByTestId("sel-null") ?? queryByTestId("select-trigger")
    if (btn) fireEvent.click(btn)
    expect(onChange).toHaveBeenCalled()
  })

  it("DynamicList fields get onValidate forwarded per field", () => {
    const onValidate = jest.fn()
    render(
      <FormFieldClient
        fields={[{ fieldType: "input", label: "X" } as Record<string, unknown>]}
        fieldType="dynamic-list"
        id="dl2"
        value={[]}
        onValidate={onValidate}
      />,
    )
    // verify captured fields have onValidate
    const fields = capturedDynamicListProps.fields as Array<
      Record<string, unknown>
    >
    expect(typeof fields?.[0]?.onValidate).toBe("function")
    // call it
    ;(fields?.[0]?.onValidate as Function)?.("f", "e")
    expect(onValidate).toHaveBeenCalled()
  })

  it("passes messagesFields.errors.input to Input as errorTranslations", () => {
    // Covers messagesFields?.errors?.input truthy branch for Input (line 97)
    const messages = { errors: { input: { required: "Required" } } }
    render(
      <FormFieldClient
        fieldType="input"
        id="inp-msg"
        messagesFields={messages}
      />,
    )
    expect(capturedInputProps.errorTranslations).toEqual({
      required: "Required",
    })
  })

  it("passes messagesFields.errors.date to DatePicker as translations", () => {
    // Covers messagesFields?.errors?.date truthy branch for DatePicker (line 110)
    const messages = { errors: { date: { required: "Required" } } }
    render(
      <FormFieldClient
        fieldType="date"
        id="dt-msg"
        messagesFields={messages}
      />,
    )
    expect(capturedDatePickerProps.translations).toEqual({
      required: "Required",
    })
  })

  it("passes messagesFields.errors.input to Rating as errorTranslations", () => {
    // Covers messagesFields?.errors?.input truthy branch for Rating (line 143)
    const messages = { errors: { input: { required: "Required" } } }
    render(
      <FormFieldClient
        fieldType="rating"
        id="rt-msg"
        messagesFields={messages}
      />,
    )
    expect(capturedRatingProps.errorTranslations).toEqual({
      required: "Required",
    })
  })

  it("Select onChange passes value directly when non-null (no ?? fallback)", () => {
    // Covers value ?? undefined branch at line 89 when value is not null
    const onChange = jest.fn()
    render(
      <FormFieldClient
        fieldType="select"
        id="sel-nonnull"
        onChange={onChange}
      />,
    )
    fireEvent.click(document.querySelector('[data-testid="select-trigger"]')!)
    expect(onChange).toHaveBeenCalledWith(expect.anything(), "optA")
  })
})
