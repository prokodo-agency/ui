import dayjs from "dayjs"
import React from "react"

import { act, render } from "@/tests"

let capturedProps: Record<string, unknown> = {}
const mockView = jest.fn((props: Record<string, unknown>) => {
  capturedProps = props
  return (
    <div
      data-error={props.errorText ?? ""}
      data-testid="datepicker-view"
      data-value={props.value !== undefined ? String(props.value) : "undefined"}
    >
      <button
        data-testid="trigger-change"
        onClick={() =>
          (props.onChangeInput as (raw: string) => void)?.("trigger")
        }
      />
    </div>
  )
})

jest.mock("./DatePicker.view", () => ({ DatePickerView: mockView }))

const DatePickerClient = require("./DatePicker.client").default

beforeEach(() => mockView.mockClear())

describe("DatePicker.client", () => {
  it("renders with no initial value", () => {
    render(<DatePickerClient />)
    expect(capturedProps.value).toBeNull()
    expect(capturedProps.errorText).toBeUndefined()
  })

  it("initializes with a provided Dayjs value", () => {
    const d = dayjs("2024-06-15")
    render(<DatePickerClient value={d} />)
    expect(dayjs(capturedProps.value as string).format("YYYY-MM-DD")).toBe(
      "2024-06-15",
    )
  })

  it("initializes with a date string value", () => {
    render(<DatePickerClient value="2024-03-20" />)
    expect(dayjs(capturedProps.value as string).format("YYYY-MM-DD")).toBe(
      "2024-03-20",
    )
  })

  it("ignores invalid string values (sets date to null)", () => {
    render(<DatePickerClient value="not-a-date" />)
    expect(capturedProps.value).toBeNull()
  })

  it("defaults format to YYYY-MM-DD", () => {
    render(<DatePickerClient />)
    expect(capturedProps.format).toBe("YYYY-MM-DD")
  })

  it("uses YYYY-MM-DDTHH:mm format when withTime=true", () => {
    render(<DatePickerClient withTime />)
    expect(capturedProps.format).toBe("YYYY-MM-DDTHH:mm")
  })

  it("calls onChange with null when empty string submitted", async () => {
    const onChangeMock = jest.fn()
    render(<DatePickerClient onChange={onChangeMock} />)
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("")
    })
    expect(onChangeMock).toHaveBeenCalledWith(null)
  })

  it("calls onChange with Dayjs on valid date input", async () => {
    const onChangeMock = jest.fn()
    render(<DatePickerClient format="YYYY-MM-DD" onChange={onChangeMock} />)
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("2024-06-15")
    })
    expect(onChangeMock).toHaveBeenCalled()
    const [[arg]] = onChangeMock.mock.calls
    // eslint-disable-next-line import/no-named-as-default-member
    expect(dayjs.isDayjs(arg)).toBe(true)
    expect(arg.format("YYYY-MM-DD")).toBe("2024-06-15")
  })

  it("sets error and calls onValidate on invalid date", async () => {
    const onChangeMock = jest.fn()
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        name="dob"
        onChange={onChangeMock}
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("bad-date")
    })
    expect(capturedProps.errorText).toMatch(/invalid date/i)
    expect(onValidateMock).toHaveBeenCalledWith(
      "dob",
      expect.stringMatching(/invalid/i),
    )
    expect(onChangeMock).toHaveBeenCalledWith(null)
  })

  it("rejects date before minDate", async () => {
    const onChangeMock = jest.fn()
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        minDate={dayjs("2024-06-01")}
        name="d"
        onChange={onChangeMock}
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("2024-01-01")
    })
    expect(capturedProps.errorText).toBeTruthy()
    expect(onChangeMock).toHaveBeenCalledWith(null)
  })

  it("rejects date after maxDate", async () => {
    const onChangeMock = jest.fn()
    render(
      <DatePickerClient
        maxDate={dayjs("2024-01-01")}
        name="d"
        onChange={onChangeMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("2025-06-15")
    })
    expect(capturedProps.errorText).toBeTruthy()
    expect(onChangeMock).toHaveBeenCalledWith(null)
  })

  it("syncs controlled value when prop changes", () => {
    const { rerender } = render(<DatePickerClient value="2024-01-01" />)

    expect(dayjs(capturedProps.value as dayjs.Dayjs).format("YYYY-MM-DD")).toBe(
      "2024-01-01",
    )
    rerender(<DatePickerClient value="2025-06-15" />)

    expect(dayjs(capturedProps.value as dayjs.Dayjs).format("YYYY-MM-DD")).toBe(
      "2025-06-15",
    )
  })

  it("sets value to null when controlled value changes to null", () => {
    const { rerender } = render(<DatePickerClient value="2024-01-01" />)
    rerender(<DatePickerClient value={null} />)
    expect(capturedProps.value).toBeNull()
  })

  it("toDayjs returns null for invalid Dayjs object", () => {
    const invalidDayjs = dayjs("not-a-valid-date")
    render(<DatePickerClient value={invalidDayjs} />)
    expect(capturedProps.value).toBeNull()
  })

  it("clears error when empty string is submitted with existing error", async () => {
    const onValidateMock = jest.fn()
    render(<DatePickerClient name="d" onValidate={onValidateMock} />)
    // First trigger an error
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("bad-date")
    })
    expect(capturedProps.errorText).toBeTruthy()
    // Now submit empty string → should clear error
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("")
    })
    expect(onValidateMock).toHaveBeenLastCalledWith("d", undefined)
  })

  it("clears date when empty string and date was not null", async () => {
    const onChangeMock = jest.fn()
    render(<DatePickerClient value="2024-06-15" onChange={onChangeMock} />)
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("")
    })
    expect(onChangeMock).toHaveBeenCalledWith(null)
    expect(capturedProps.value).toBeNull()
  })

  it("sets error for invalid date/time when withTime=true", async () => {
    const onChangeMock = jest.fn()
    render(<DatePickerClient withTime name="d" onChange={onChangeMock} />)
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("bad-datetime")
    })
    expect(capturedProps.errorText).toMatch(/invalid date\/time/i)
    expect(onChangeMock).toHaveBeenCalledWith(null)
  })

  it("uses custom minDate translation", async () => {
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        minDate={dayjs("2024-06-01")}
        name="d"
        translations={{ minDate: "Custom min date error" }}
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("2024-01-01")
    })
    expect(onValidateMock).toHaveBeenCalledWith("d", "Custom min date error")
  })

  it("uses in-the-past message when minDate is today", async () => {
    const today = dayjs()
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient minDate={today} name="d" onValidate={onValidateMock} />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.(
        today.subtract(1, "day").format("YYYY-MM-DD"),
      )
    })
    expect(onValidateMock).toHaveBeenCalledWith(
      "d",
      expect.stringContaining("past"),
    )
  })

  it("uses in-the-past message withTime when minDate is today", async () => {
    const today = dayjs()
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        withTime
        minDate={today}
        name="d"
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.(
        today.subtract(1, "hour").format("YYYY-MM-DDTHH:mm"),
      )
    })
    expect(onValidateMock).toHaveBeenCalledWith(
      "d",
      expect.stringContaining("past"),
    )
  })

  it("uses custom maxDate translation", async () => {
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        maxDate={dayjs("2024-01-01")}
        name="d"
        translations={{ maxDate: "Custom max date error" }}
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("2025-06-15")
    })
    expect(onValidateMock).toHaveBeenCalledWith("d", "Custom max date error")
  })

  it("uses in-the-future message when maxDate is today", async () => {
    const today = dayjs()
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient maxDate={today} name="d" onValidate={onValidateMock} />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.(
        today.add(1, "day").format("YYYY-MM-DD"),
      )
    })
    expect(onValidateMock).toHaveBeenCalledWith(
      "d",
      expect.stringContaining("future"),
    )
  })

  it("uses in-the-future message withTime when maxDate is today", async () => {
    const today = dayjs()
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        withTime
        maxDate={today}
        name="d"
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.(
        today.add(1, "hour").format("YYYY-MM-DDTHH:mm"),
      )
    })
    expect(onValidateMock).toHaveBeenCalledWith(
      "d",
      expect.stringContaining("future"),
    )
  })

  it("snaps minutes to step when withTime=true", async () => {
    const onChangeMock = jest.fn()
    render(
      <DatePickerClient
        withTime
        minuteStep={15}
        name="d"
        onChange={onChangeMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.(
        "2024-06-15T10:07",
      )
    })
    expect(onChangeMock).toHaveBeenCalled()
    const [[result]] = onChangeMock.mock.calls
    // eslint-disable-next-line import/no-named-as-default-member
    expect(dayjs.isDayjs(result)).toBe(true)
    // minute 7 snapped to nearest 15 → 0
    expect(result.minute() % 15).toBe(0)
  })

  it("does not setDate if snapped date is same unit as current date", async () => {
    const onChangeMock = jest.fn()
    render(
      <DatePickerClient
        format="YYYY-MM-DD"
        value="2024-06-15"
        onChange={onChangeMock}
      />,
    )
    // Submit the same date again → sameByUnit is true → no setDate call, but onChange still fires
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("2024-06-15")
    })
    expect(onChangeMock).toHaveBeenCalled()
  })

  it("clears string error when valid date entered after invalid", async () => {
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        format="YYYY-MM-DD"
        name="d"
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("bad")
    })
    // now valid
    await act(async () => {
      ;(capturedProps.onChangeInput as (raw: string) => void)?.("2024-06-15")
    })
    expect(onValidateMock).toHaveBeenLastCalledWith("d", undefined)
  })
})
