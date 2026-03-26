import dayjs from "dayjs"
import React from "react"

import { act, render, screen } from "@/tests"

let capturedProps: Record<string, unknown> = {}
const mockView = jest.fn((props: Record<string, unknown>) => {
  capturedProps = props
  return (
    <div
      data-error={props.errorText ?? ""}
      data-testid="datepicker-view"
      data-value={
        props.selectedDate !== undefined
          ? String(props.selectedDate)
          : "undefined"
      }
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

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

beforeEach(() => mockView.mockClear())

describe("DatePicker.client", () => {
  it("renders with no initial value", () => {
    render(<DatePickerClient />)
    expect(capturedProps.selectedDate).toBeNull()
    expect(capturedProps.errorText).toBeUndefined()
  })

  it("initializes with a provided Dayjs value", () => {
    const d = dayjs("2024-06-15")
    render(<DatePickerClient value={d} />)
    expect(
      dayjs(capturedProps.selectedDate as string).format("YYYY-MM-DD"),
    ).toBe("2024-06-15")
  })

  it("initializes with a date string value", () => {
    render(<DatePickerClient value="2024-03-20" />)
    expect(
      dayjs(capturedProps.selectedDate as string).format("YYYY-MM-DD"),
    ).toBe("2024-03-20")
  })

  it("ignores invalid string values (sets date to null)", () => {
    render(<DatePickerClient value="not-a-date" />)
    expect(capturedProps.selectedDate).toBeNull()
  })

  it("defaults format to YYYY-MM-DD", () => {
    render(<DatePickerClient />)
    expect(capturedProps.format).toBe("YYYY-MM-DD")
  })

  it("uses YYYY-MM-DDTHH:mm format when withTime=true", () => {
    render(<DatePickerClient withTime />)
    expect(capturedProps.format).toBe("YYYY-MM-DDTHH:mm")
  })

  it("calls onChange with null when clear is triggered", async () => {
    const onChangeMock = jest.fn()
    render(<DatePickerClient onChange={onChangeMock} />)
    await act(async () => {
      ;(capturedProps.onClear as () => void)?.()
    })
    expect(onChangeMock).toHaveBeenCalledWith(null)
  })

  it("calls onChange with Dayjs when a day is clicked", async () => {
    const onChangeMock = jest.fn()
    render(<DatePickerClient format="YYYY-MM-DD" onChange={onChangeMock} />)
    await act(async () => {
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2024-06-15"),
      )
    })
    expect(onChangeMock).toHaveBeenCalled()
    const [[arg]] = onChangeMock.mock.calls
    // eslint-disable-next-line import/no-named-as-default-member
    expect(dayjs.isDayjs(arg)).toBe(true)
    expect(arg.format("YYYY-MM-DD")).toBe("2024-06-15")
  })

  it("sets error and calls onValidate when required field is cleared", async () => {
    const onChangeMock = jest.fn()
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        required
        name="dob"
        onChange={onChangeMock}
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onClear as () => void)?.()
    })
    expect(capturedProps.errorText).toBeTruthy()
    expect(onValidateMock).toHaveBeenCalledWith("dob", expect.any(String))
    expect(onChangeMock).not.toHaveBeenCalled()
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
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2024-01-01"),
      )
    })
    expect(capturedProps.errorText).toBeTruthy()
    expect(onChangeMock).not.toHaveBeenCalled()
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
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2025-06-15"),
      )
    })
    expect(capturedProps.errorText).toBeTruthy()
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it("syncs controlled value when prop changes", () => {
    const { rerender } = render(<DatePickerClient value="2024-01-01" />)

    expect(
      dayjs(capturedProps.selectedDate as dayjs.Dayjs).format("YYYY-MM-DD"),
    ).toBe("2024-01-01")
    rerender(<DatePickerClient value="2025-06-15" />)

    expect(
      dayjs(capturedProps.selectedDate as dayjs.Dayjs).format("YYYY-MM-DD"),
    ).toBe("2025-06-15")
  })

  it("sets value to null when controlled value changes to null", () => {
    const { rerender } = render(<DatePickerClient value="2024-01-01" />)
    rerender(<DatePickerClient value={null} />)
    expect(capturedProps.selectedDate).toBeNull()
  })

  it("toDayjs returns null for invalid Dayjs object", () => {
    const invalidDayjs = dayjs("not-a-valid-date")
    render(<DatePickerClient value={invalidDayjs} />)
    expect(capturedProps.selectedDate).toBeNull()
  })

  it("clears error when a valid date is selected after error", async () => {
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        minDate={dayjs("2024-06-01")}
        name="d"
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2024-01-01"),
      )
    })
    expect(capturedProps.errorText).toBeTruthy()
    await act(async () => {
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2024-07-15"),
      )
    })
    expect(onValidateMock).toHaveBeenLastCalledWith("d", undefined)
  })

  it("clears date when clear is triggered", async () => {
    const onChangeMock = jest.fn()
    render(<DatePickerClient value="2024-06-15" onChange={onChangeMock} />)
    await act(async () => {
      ;(capturedProps.onClear as () => void)?.()
    })
    expect(onChangeMock).toHaveBeenCalledWith(null)
    expect(capturedProps.selectedDate).toBeNull()
  })

  it("sets error for required field when clear is triggered with withTime=true", async () => {
    const onChangeMock = jest.fn()
    render(
      <DatePickerClient required withTime name="d" onChange={onChangeMock} />,
    )
    await act(async () => {
      ;(capturedProps.onClear as () => void)?.()
    })
    expect(capturedProps.errorText).toBeTruthy()
    expect(onChangeMock).not.toHaveBeenCalled()
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
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2024-01-01"),
      )
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
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        today.subtract(1, "day"),
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
    // With withTime=true, onDayClick only sets draft; onApply commits it
    await act(async () => {
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        today.subtract(1, "hour"),
      )
    })
    await act(async () => {
      ;(capturedProps.onApply as () => void)?.()
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
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2025-06-15"),
      )
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
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        today.add(1, "day"),
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
    // Click tomorrow: with withTime=true, draft = tomorrow.startOf("day") which
    // is always after today regardless of the current hour.
    await act(async () => {
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        today.add(1, "day"),
      )
    })
    await act(async () => {
      ;(capturedProps.onApply as () => void)?.()
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
    // With withTime=true, onDayClick sets draft but does NOT commit yet
    await act(async () => {
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2024-06-15"),
      )
    })
    // Set a non-aligned minute via onTimeChange
    await act(async () => {
      ;(capturedProps.onTimeChange as (val: number, unit: string) => void)?.(
        10,
        "hour",
      )
      ;(capturedProps.onTimeChange as (val: number, unit: string) => void)?.(
        7,
        "minute",
      )
    })
    // Apply -> should snap minute 7 to nearest 15 -> 0
    await act(async () => {
      ;(capturedProps.onApply as () => void)?.()
    })
    expect(onChangeMock).toHaveBeenCalled()
    const [[result]] = onChangeMock.mock.calls
    // eslint-disable-next-line import/no-named-as-default-member
    expect(dayjs.isDayjs(result)).toBe(true)
    // minute 7 snapped to nearest 15 -> 0
    expect(result.minute() % 15).toBe(0)
  })

  it("calls onChange when applying same date (same-unit guard branch)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DatePickerClient
        format="YYYY-MM-DD"
        value="2024-06-15"
        onChange={onChangeMock}
      />,
    )
    // With withTime=false, onDayClick commits the date immediately
    await act(async () => {
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2024-06-15"),
      )
    })
    expect(onChangeMock).toHaveBeenCalled()
  })

  it("clears validation error when a valid date is selected after invalid", async () => {
    const onValidateMock = jest.fn()
    render(
      <DatePickerClient
        format="YYYY-MM-DD"
        minDate={dayjs("2024-06-01")}
        name="d"
        onValidate={onValidateMock}
      />,
    )
    await act(async () => {
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2024-01-01"),
      )
    })
    await act(async () => {
      ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(
        dayjs("2024-07-01"),
      )
    })
    expect(onValidateMock).toHaveBeenLastCalledWith("d", undefined)
  })

  // -------------------------------------------------------------------------
  // View mode / navigation
  // -------------------------------------------------------------------------

  it("handleToggle opens the picker and resets viewMode to days", async () => {
    render(<DatePickerClient value={dayjs("2024-06-15")} />)
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    expect(capturedProps.isOpen).toBe(true)
    expect(capturedProps.viewMode).toBe("days")
  })

  it("handleToggle closes the picker on second call", async () => {
    render(<DatePickerClient />)
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    expect(capturedProps.isOpen).toBe(false)
  })

  it("handleViewModeChange switches viewMode", async () => {
    render(<DatePickerClient />)
    await act(async () => {
      ;(
        capturedProps.onViewModeChange as (
          m: "days" | "months" | "years",
        ) => void
      )?.("months")
    })
    expect(capturedProps.viewMode).toBe("months")
  })

  it("handleMonthSelect sets the month and returns to days view", async () => {
    render(<DatePickerClient />)
    // Switch to months first
    await act(async () => {
      ;(
        capturedProps.onViewModeChange as (
          m: "days" | "months" | "years",
        ) => void
      )?.("months")
    })
    await act(async () => {
      ;(capturedProps.onMonthSelect as (m: number) => void)?.(2) // March
    })
    expect(capturedProps.viewMode).toBe("days")
    expect((capturedProps.viewingMonth as dayjs.Dayjs).month()).toBe(2)
  })

  it("handleYearSelect sets the year and switches to months view", async () => {
    render(<DatePickerClient />)
    await act(async () => {
      ;(capturedProps.onYearSelect as (y: number) => void)?.(2030)
    })
    expect(capturedProps.viewMode).toBe("months")
    expect((capturedProps.viewingMonth as dayjs.Dayjs).year()).toBe(2030)
  })

  it("handlePrevMonth navigates backwards by one month in days mode", async () => {
    render(<DatePickerClient />)
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    const before = (capturedProps.viewingMonth as dayjs.Dayjs).format("YYYY-MM")
    await act(async () => {
      ;(capturedProps.onPrevMonth as () => void)?.()
    })
    const after = (capturedProps.viewingMonth as dayjs.Dayjs).format("YYYY-MM")
    expect(after).not.toBe(before)
  })

  it("handlePrevMonth navigates by one year in months view", async () => {
    render(<DatePickerClient value={dayjs("2025-07-01")} />)
    // Enter months view
    await act(async () => {
      ;(capturedProps.onViewModeChange as (m: "months") => void)?.("months")
    })
    const yearBefore = (capturedProps.viewingMonth as dayjs.Dayjs).year()
    await act(async () => {
      ;(capturedProps.onPrevMonth as () => void)?.()
    })
    expect((capturedProps.viewingMonth as dayjs.Dayjs).year()).toBe(
      yearBefore - 1,
    )
  })

  it("handleNextMonth navigates forward by one year in months view", async () => {
    render(<DatePickerClient value={dayjs("2025-07-01")} />)
    await act(async () => {
      ;(capturedProps.onViewModeChange as (m: "months") => void)?.("months")
    })
    const yearBefore = (capturedProps.viewingMonth as dayjs.Dayjs).year()
    await act(async () => {
      ;(capturedProps.onNextMonth as () => void)?.()
    })
    expect((capturedProps.viewingMonth as dayjs.Dayjs).year()).toBe(
      yearBefore + 1,
    )
  })

  it("handlePrevMonth navigates by 10 years in years view", async () => {
    render(<DatePickerClient value={dayjs("2025-07-01")} />)
    await act(async () => {
      ;(capturedProps.onViewModeChange as (m: "years") => void)?.("years")
    })
    const yearBefore = (capturedProps.viewingMonth as dayjs.Dayjs).year()
    await act(async () => {
      ;(capturedProps.onPrevMonth as () => void)?.()
    })
    expect((capturedProps.viewingMonth as dayjs.Dayjs).year()).toBe(
      yearBefore - 10,
    )
  })

  it("handleNextMonth navigates forward by one month in days view", async () => {
    render(<DatePickerClient value={dayjs("2025-07-01")} />)
    const before = (capturedProps.viewingMonth as dayjs.Dayjs).format("YYYY-MM")
    await act(async () => {
      ;(capturedProps.onNextMonth as () => void)?.()
    })
    const after = (capturedProps.viewingMonth as dayjs.Dayjs).format("YYYY-MM")
    expect(after).not.toBe(before)
  })

  it("handleNextMonth navigates forward by 10 years in years view", async () => {
    render(<DatePickerClient value={dayjs("2025-07-01")} />)
    await act(async () => {
      ;(capturedProps.onViewModeChange as (m: "years") => void)?.("years")
    })
    const yearBefore = (capturedProps.viewingMonth as dayjs.Dayjs).year()
    await act(async () => {
      ;(capturedProps.onNextMonth as () => void)?.()
    })
    expect((capturedProps.viewingMonth as dayjs.Dayjs).year()).toBe(
      yearBefore + 10,
    )
  })

  it("handleToday sets draft to today's date", async () => {
    const today = dayjs().startOf("day").format("YYYY-MM-DD")
    render(<DatePickerClient />)
    await act(async () => {
      ;(capturedProps.onToday as () => void)?.()
    })
    const draft = capturedProps.selectedDate as dayjs.Dayjs | null
    expect(draft?.format("YYYY-MM-DD")).toBe(today)
  })

  // -------------------------------------------------------------------------
  // Swipe / touch gesture handlers
  // -------------------------------------------------------------------------

  it("onDialogTouchStart stores the initial touch position", async () => {
    render(<DatePickerClient />)
    const fakeStart = {
      touches: [{ clientX: 120, clientY: 300 }],
    } as unknown as React.TouchEvent<HTMLDivElement>
    await act(async () => {
      ;(
        capturedProps.onDialogTouchStart as React.TouchEventHandler<HTMLDivElement>
      )?.(fakeStart)
    })
    // No error and the subsequent end event can detect the swipe
    const fakeEnd = {
      changedTouches: [{ clientX: 120, clientY: 310 }], // dy = 10 — not enough to close
    } as unknown as React.TouchEvent<HTMLDivElement>
    await act(async () => {
      ;(
        capturedProps.onDialogTouchEnd as React.TouchEventHandler<HTMLDivElement>
      )?.(fakeEnd)
    })
    // isOpen unchanged (still closed by default)
    expect(capturedProps.isOpen).toBe(false)
  })

  it("onDialogTouchEnd closes picker on downward swipe > 80 px", async () => {
    render(<DatePickerClient />)
    // Open the picker first
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    expect(capturedProps.isOpen).toBe(true)
    // Record touch start
    await act(async () => {
      ;(
        capturedProps.onDialogTouchStart as React.TouchEventHandler<HTMLDivElement>
      )?.({
        touches: [{ clientX: 150, clientY: 100 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    // Swipe down > 80 px → should close
    await act(async () => {
      ;(
        capturedProps.onDialogTouchEnd as React.TouchEventHandler<HTMLDivElement>
      )?.({
        changedTouches: [{ clientX: 150, clientY: 190 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    expect(capturedProps.isOpen).toBe(false)
  })

  it("onDialogTouchEnd navigates to next month on leftward swipe > 50 px in days mode", async () => {
    render(<DatePickerClient value={dayjs("2025-06-15")} />)
    const monthBefore = (capturedProps.viewingMonth as dayjs.Dayjs).month()
    // Record touch start
    await act(async () => {
      ;(
        capturedProps.onDialogTouchStart as React.TouchEventHandler<HTMLDivElement>
      )?.({
        touches: [{ clientX: 200, clientY: 300 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    // Swipe left dx = -60 — navigates to next month
    await act(async () => {
      ;(
        capturedProps.onDialogTouchEnd as React.TouchEventHandler<HTMLDivElement>
      )?.({
        changedTouches: [{ clientX: 140, clientY: 300 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    expect((capturedProps.viewingMonth as dayjs.Dayjs).month()).not.toBe(
      monthBefore,
    )
  })

  it("onDialogTouchEnd navigates to prev month on rightward swipe > 50 px in days mode", async () => {
    render(<DatePickerClient value={dayjs("2025-06-15")} />)
    const monthBefore = (capturedProps.viewingMonth as dayjs.Dayjs).month()
    // Record touch start
    await act(async () => {
      ;(
        capturedProps.onDialogTouchStart as React.TouchEventHandler<HTMLDivElement>
      )?.({
        touches: [{ clientX: 200, clientY: 300 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    // Swipe right dx = +60 — navigates to previous month
    await act(async () => {
      ;(
        capturedProps.onDialogTouchEnd as React.TouchEventHandler<HTMLDivElement>
      )?.({
        changedTouches: [{ clientX: 260, clientY: 300 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    expect((capturedProps.viewingMonth as dayjs.Dayjs).month()).not.toBe(
      monthBefore,
    )
  })

  it("onDialogTouchEnd is a no-op when no touch start was recorded", async () => {
    render(<DatePickerClient />)
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    // Call end WITHOUT calling start — swipeTouchStart.current is null
    await act(async () => {
      ;(
        capturedProps.onDialogTouchEnd as React.TouchEventHandler<HTMLDivElement>
      )?.({
        changedTouches: [{ clientX: 150, clientY: 300 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    expect(capturedProps.isOpen).toBe(true)
  })

  it("registers click-outside listener when picker is open (desktop)", async () => {
    render(<DatePickerClient />)
    // Open the picker — isMobile=false (matchMedia mocked), isOpen=true
    // This causes the useEffect to register a pointerdown listener
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    expect(capturedProps.isOpen).toBe(true)
    // Dispatch pointerdown on document.body — outside the component root div.
    // rootRef.current IS the outer wrapper div, so body is not contained in it
    // → handlePointerDown fires, the condition is true, and the picker closes.
    await act(async () => {
      document.body.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true }),
      )
    })
    expect(capturedProps.isOpen).toBe(false)
  })

  it("pointerdown inside the component root does NOT close the picker", async () => {
    render(<DatePickerClient />)
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    expect(capturedProps.isOpen).toBe(true)
    // Dispatch pointerdown on the mocked-view element which is INSIDE rootRef's div.
    // rootRef.current.contains(target) === true → condition false → no close.
    await act(async () => {
      screen
        .getByTestId("datepicker-view")
        .dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))
    })
    expect(capturedProps.isOpen).toBe(true)
  })

  it("matchMedia change handler updates isMobile state", async () => {
    const changeListeners: Array<(e: { matches: boolean }) => void> = []
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest
          .fn()
          .mockImplementation(
            (event: string, handler: (e: { matches: boolean }) => void) => {
              if (event === "change") changeListeners.push(handler)
            },
          ),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
    render(<DatePickerClient />)
    // dialogPortalTarget is always document.body now (portal used for both mobile and desktop)
    expect(capturedProps.dialogPortalTarget).toBe(document.body)
    // Simulate a matchMedia change event toggling to mobile
    await act(async () => {
      changeListeners.forEach(h => h({ matches: true }))
    })
    // After change, isMobile=true → dialogPortalTarget still document.body
    expect(capturedProps.dialogPortalTarget).toBe(document.body)
    // Restore mock
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  // -------------------------------------------------------------------------
  // Branch coverage for remaining uncovered paths
  // -------------------------------------------------------------------------

  it("onDialogTouchStart is a no-op when touches is empty", async () => {
    render(<DatePickerClient />)
    // t will be undefined; `if (t)` takes the falsy branch
    await act(async () => {
      ;(
        capturedProps.onDialogTouchStart as React.TouchEventHandler<HTMLDivElement>
      )?.({
        touches: [], // empty → t is undefined
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    // Subsequent touchEnd without start is a no-op (no error)
    await act(async () => {
      ;(
        capturedProps.onDialogTouchEnd as React.TouchEventHandler<HTMLDivElement>
      )?.({
        changedTouches: [{ clientX: 150, clientY: 300 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    expect(capturedProps.isOpen).toBe(false)
  })

  it("onDialogTouchEnd returns early when changedTouches is empty", async () => {
    render(<DatePickerClient />)
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    // Record valid start
    await act(async () => {
      ;(
        capturedProps.onDialogTouchStart as React.TouchEventHandler<HTMLDivElement>
      )?.({
        touches: [{ clientX: 150, clientY: 100 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    // Empty changedTouches → t is undefined → early return
    await act(async () => {
      ;(
        capturedProps.onDialogTouchEnd as React.TouchEventHandler<HTMLDivElement>
      )?.({
        changedTouches: [], // empty → if (!t) return
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    // Picker stays open (early return, no close)
    expect(capturedProps.isOpen).toBe(true)
  })

  it("onDialogTouchEnd horizontal swipe in months view does not navigate", async () => {
    render(<DatePickerClient value={dayjs("2025-06-15")} />)
    // Switch to months view
    await act(async () => {
      ;(capturedProps.onViewModeChange as (m: "months") => void)?.("months")
    })
    const monthBefore = (capturedProps.viewingMonth as dayjs.Dayjs).format(
      "YYYY-MM",
    )
    // Swipe left > 50 px but NOT in days mode → else-if condition false
    await act(async () => {
      ;(
        capturedProps.onDialogTouchStart as React.TouchEventHandler<HTMLDivElement>
      )?.({
        touches: [{ clientX: 200, clientY: 300 }],
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    await act(async () => {
      ;(
        capturedProps.onDialogTouchEnd as React.TouchEventHandler<HTMLDivElement>
      )?.({
        changedTouches: [{ clientX: 130, clientY: 300 }], // dx=-70, |dx|>50 but viewMode=months
      } as unknown as React.TouchEvent<HTMLDivElement>)
    })
    // Month should NOT have changed (not in days mode)
    expect((capturedProps.viewingMonth as dayjs.Dayjs).format("YYYY-MM")).toBe(
      monthBefore,
    )
  })

  it("click-outside useEffect skips registering listener when isMobile=true", async () => {
    // Mock matchMedia to return mobile
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
    render(<DatePickerClient />)
    await act(async () => {
      ;(capturedProps.onToggle as () => void)?.()
    })
    expect(capturedProps.isOpen).toBe(true)
    // Dispatch pointerdown — listener was NOT registered (isMobile=true), picker stays open
    await act(async () => {
      document.body.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true }),
      )
    })
    expect(capturedProps.isOpen).toBe(true)
    // Restore mock
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })
})
it("handleDayClick preserves existing draft time when withTime=true and draft is set", async () => {
  render(<DatePickerClient withTime value={dayjs("2024-06-15T14:30:00")} />)
  const newDay = dayjs("2024-06-20")
  await act(async () => {
    ;(capturedProps.onDayClick as (day: dayjs.Dayjs) => void)?.(newDay)
  })
  // Draft should have the new day but preserved time (14:30)
  const draft = capturedProps.selectedDate as dayjs.Dayjs | null
  expect(draft?.hour()).toBe(14)
  expect(draft?.minute()).toBe(30)
})

it("handleApply with withTime=true but draft=null commits null (false branch of snapped check)", async () => {
  const onChange = jest.fn()
  render(<DatePickerClient required withTime name="d" onChange={onChange} />)
  // draft is null (no initial value, no day clicked)
  // calling onApply with snapped=null → `if (withTime && snapped)` is false
  await act(async () => {
    ;(capturedProps.onApply as () => void)?.()
  })
  // Required field + null draft → sets an error, doesn't call onChange with a value
  expect(capturedProps.errorText).toBeDefined()
})

it("handleTimeChange with null draft (no day selected) falls back to today", async () => {
  render(<DatePickerClient withTime />) // no initial value → draft=null
  await act(async () => {
    ;(capturedProps.onTimeChange as (val: number, unit: string) => void)?.(
      10,
      "hour",
    )
  })
  // draft should now be today at 10:00
  const draft = capturedProps.selectedDate as dayjs.Dayjs | null
  expect(draft?.hour()).toBe(10)
})

it("dialogPortalTarget is document.body when isMobile=true", async () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
  render(<DatePickerClient />)
  expect(capturedProps.dialogPortalTarget).toBe(document.body)
  // Restore
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

it("scroll/resize sync updates triggerRect when picker is open on desktop", async () => {
  render(<DatePickerClient name="dp-sync" />)
  // Open the picker on desktop (isMobile=false by default)
  await act(async () => {
    ;(capturedProps.onToggle as () => void)?.()
  })
  expect(capturedProps.isOpen).toBe(true)
  // Fire a scroll event — the sync handler reads getBoundingClientRect
  await act(async () => {
    document.dispatchEvent(new Event("scroll", { bubbles: true }))
  })
  // dialogStyle should now be defined (position fixed with triggerRect coords)
  expect(capturedProps.dialogStyle).toBeDefined()
})
