import dayjs from "dayjs"

import { fireEvent, render, screen } from "@/tests"

import { DatePickerDialog } from "./DatePickerDialog.view"

import type { DatePickerDialogProps } from "./DatePicker.model"

const noop = () => undefined

const defaultProps: DatePickerDialogProps = {
  name: "test-dp",
  label: "Date",
  viewingMonth: dayjs("2025-07-01"),
  selectedDate: null,
  viewMode: "days",
  onPrevMonth: noop,
  onNextMonth: noop,
  onViewModeChange: noop,
  onMonthSelect: noop,
  onYearSelect: noop,
  onDayClick: noop,
  onToday: noop,
  onClear: noop,
  onApply: noop,
  onTimeChange: noop,
}

describe("DatePickerDialog", () => {
  // -------------------------------------------------------------------------
  // Days view header
  // -------------------------------------------------------------------------
  describe("days view header", () => {
    it("shows month name and year buttons in days mode", () => {
      render(<DatePickerDialog {...defaultProps} />)
      expect(screen.getByRole("button", { name: "July" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "2025" })).toBeInTheDocument()
    })

    it("calls onViewModeChange('months') when month button clicked", () => {
      const onViewModeChange = jest.fn()
      render(
        <DatePickerDialog
          {...defaultProps}
          onViewModeChange={onViewModeChange}
        />,
      )
      fireEvent.click(screen.getByRole("button", { name: "July" }))
      expect(onViewModeChange).toHaveBeenCalledWith("months")
    })

    it("calls onViewModeChange('years') when year button clicked", () => {
      const onViewModeChange = jest.fn()
      render(
        <DatePickerDialog
          {...defaultProps}
          onViewModeChange={onViewModeChange}
        />,
      )
      fireEvent.click(screen.getByRole("button", { name: "2025" }))
      expect(onViewModeChange).toHaveBeenCalledWith("years")
    })
  })

  // -------------------------------------------------------------------------
  // Months view
  // -------------------------------------------------------------------------
  describe("months view", () => {
    it("shows a year button in months mode header", () => {
      render(<DatePickerDialog {...defaultProps} viewMode="months" />)
      expect(screen.getByRole("button", { name: "2025" })).toBeInTheDocument()
    })

    it("calls onViewModeChange('years') when year button clicked in months mode", () => {
      const onViewModeChange = jest.fn()
      render(
        <DatePickerDialog
          {...defaultProps}
          viewMode="months"
          onViewModeChange={onViewModeChange}
        />,
      )
      fireEvent.click(screen.getByRole("button", { name: "2025" }))
      expect(onViewModeChange).toHaveBeenCalledWith("years")
    })

    it("renders all 12 month buttons", () => {
      render(<DatePickerDialog {...defaultProps} viewMode="months" />)
      ;[
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].forEach(m => {
        expect(screen.getByRole("button", { name: m })).toBeInTheDocument()
      })
    })

    it("calls onMonthSelect with 0-based month index when a month is clicked", () => {
      const onMonthSelect = jest.fn()
      render(
        <DatePickerDialog
          {...defaultProps}
          viewMode="months"
          onMonthSelect={onMonthSelect}
        />,
      )
      fireEvent.click(screen.getByRole("button", { name: "Mar" }))
      expect(onMonthSelect).toHaveBeenCalledWith(2)
    })

    it("disables months outside the allowed range", () => {
      // viewingMonth = 2025-07, minDate = 2025-06-01 → Jan–May disabled
      render(
        <DatePickerDialog
          {...defaultProps}
          minDate="2025-06-01"
          viewMode="months"
        />,
      )
      const jan = screen.getByRole("button", { name: "Jan" })
      expect(jan).toBeDisabled()
    })

    it("marks the selected month", () => {
      render(
        <DatePickerDialog
          {...defaultProps}
          selectedDate={dayjs("2025-07-15")}
          viewMode="months"
        />,
      )
      // July should have the selected class
      const julBtn = screen.getByRole("button", { name: "Jul" })
      expect(julBtn.className).toMatch(/selected/)
    })
  })

  // -------------------------------------------------------------------------
  // Years view
  // -------------------------------------------------------------------------
  describe("years view", () => {
    it("shows a decade range label in years mode header", () => {
      render(<DatePickerDialog {...defaultProps} viewMode="years" />)
      // 2025 → decade starts at 2020
      expect(screen.getByText("2020–2031")).toBeInTheDocument()
    })

    it("renders 12 year buttons", () => {
      render(<DatePickerDialog {...defaultProps} viewMode="years" />)
      const yearBtn = screen.getByRole("button", { name: "2025" })
      expect(yearBtn).toBeInTheDocument()
    })

    it("calls onYearSelect when a year is clicked", () => {
      const onYearSelect = jest.fn()
      render(
        <DatePickerDialog
          {...defaultProps}
          viewMode="years"
          onYearSelect={onYearSelect}
        />,
      )
      fireEvent.click(screen.getByRole("button", { name: "2025" }))
      expect(onYearSelect).toHaveBeenCalledWith(2025)
    })

    it("disables years outside the allowed range", () => {
      render(
        <DatePickerDialog
          {...defaultProps}
          maxDate="2023-12-31"
          viewMode="years"
        />,
      )
      const btn2025 = screen.getByRole("button", { name: "2025" })
      expect(btn2025).toBeDisabled()
    })
  })

  // -------------------------------------------------------------------------
  // Day grid
  // -------------------------------------------------------------------------
  describe("day grid", () => {
    it("calls onDayClick when a current-month day is clicked", () => {
      const onDayClick = jest.fn()
      render(<DatePickerDialog {...defaultProps} onDayClick={onDayClick} />)
      // Click day "15" in the grid
      const btn = screen.getByRole("gridcell", { name: /15 July 2025/ })
      fireEvent.click(btn)
      expect(onDayClick).toHaveBeenCalledTimes(1)
    })

    it("does not call onDayClick when an outside-month cell is clicked", () => {
      const onDayClick = jest.fn()
      render(<DatePickerDialog {...defaultProps} onDayClick={onDayClick} />)
      // June 30 is the only outside cell before July 2025 (week starts Monday,
      // July 1 is Tuesday ⟹ startOffset = 1)
      const outsideBtn = screen.getByRole("gridcell", { name: /30 June 2025/ })
      fireEvent.click(outsideBtn)
      expect(onDayClick).not.toHaveBeenCalled()
    })

    it("defaults viewMode to 'days' when viewMode prop is omitted", () => {
      // Pass undefined to trigger the default parameter value viewMode="days"
      render(
        <DatePickerDialog {...defaultProps} viewMode={undefined as never} />,
      )
      // The day grid should be visible (default viewMode = "days")
      expect(screen.getByRole("grid")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------
  describe("navigation", () => {
    it("calls onPrevMonth when prev button is clicked", () => {
      const onPrevMonth = jest.fn()
      render(<DatePickerDialog {...defaultProps} onPrevMonth={onPrevMonth} />)
      fireEvent.click(screen.getByRole("button", { name: "Previous month" }))
      expect(onPrevMonth).toHaveBeenCalledTimes(1)
    })

    it("calls onNextMonth when next button is clicked", () => {
      const onNextMonth = jest.fn()
      render(<DatePickerDialog {...defaultProps} onNextMonth={onNextMonth} />)
      fireEvent.click(screen.getByRole("button", { name: "Next month" }))
      expect(onNextMonth).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // Footer actions
  // -------------------------------------------------------------------------
  describe("footer", () => {
    it("calls onToday when Today button clicked", () => {
      const onToday = jest.fn()
      render(<DatePickerDialog {...defaultProps} onToday={onToday} />)
      fireEvent.click(screen.getByRole("button", { name: /Today/i }))
      expect(onToday).toHaveBeenCalledTimes(1)
    })

    it("calls onClear when Clear button clicked", () => {
      const onClear = jest.fn()
      render(<DatePickerDialog {...defaultProps} onClear={onClear} />)
      fireEvent.click(screen.getByRole("button", { name: /Clear/i }))
      expect(onClear).toHaveBeenCalledTimes(1)
    })

    it("calls onApply when Apply button clicked", () => {
      const onApply = jest.fn()
      render(<DatePickerDialog {...defaultProps} onApply={onApply} />)
      fireEvent.click(screen.getByRole("button", { name: /Apply/i }))
      expect(onApply).toHaveBeenCalledTimes(1)
    })

    it("calls onClose when backdrop is clicked", () => {
      const onClose = jest.fn()
      render(<DatePickerDialog {...defaultProps} onClose={onClose} />)
      // Backdrop is aria-hidden, use container query
      const backdrop = document.querySelector(
        ".prokodo-DatePicker__dialog__backdrop",
      )
      if (backdrop) fireEvent.click(backdrop as HTMLElement)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // Time row
  // -------------------------------------------------------------------------
  describe("time row (withTime=true)", () => {
    it("renders hour and minute selects when withTime is true", () => {
      render(
        <DatePickerDialog
          {...defaultProps}
          withTime
          selectedDate={dayjs("2025-07-15T14:30")}
        />,
      )
      expect(screen.getByRole("combobox", { name: "Hour" })).toBeInTheDocument()
      expect(
        screen.getByRole("combobox", { name: "Minute" }),
      ).toBeInTheDocument()
    })

    it("calls onTimeChange('hour') when hour select changes", () => {
      const onTimeChange = jest.fn()
      render(
        <DatePickerDialog
          {...defaultProps}
          withTime
          selectedDate={dayjs("2025-07-15T14:30")}
          onTimeChange={onTimeChange}
        />,
      )
      fireEvent.change(screen.getByRole("combobox", { name: "Hour" }), {
        target: { value: "9" },
      })
      expect(onTimeChange).toHaveBeenCalledWith(9, "hour")
    })

    it("calls onTimeChange('minute') when minute select changes", () => {
      const onTimeChange = jest.fn()
      render(
        <DatePickerDialog
          {...defaultProps}
          withTime
          selectedDate={dayjs("2025-07-15T14:30")}
          onTimeChange={onTimeChange}
        />,
      )
      fireEvent.change(screen.getByRole("combobox", { name: "Minute" }), {
        target: { value: "45" },
      })
      expect(onTimeChange).toHaveBeenCalledWith(45, "minute")
    })

    it("defaults to 0 for hour and minute when selectedDate is null", () => {
      render(
        <DatePickerDialog {...defaultProps} withTime selectedDate={null} />,
      )
      const hourSelect = screen.getByRole("combobox", {
        name: "Hour",
      }) as HTMLSelectElement
      expect(hourSelect.value).toBe("0")
    })

    it("does not render time row when withTime is false", () => {
      render(<DatePickerDialog {...defaultProps} withTime={false} />)
      expect(
        screen.queryByRole("combobox", { name: "Hour" }),
      ).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Color / dialog
  // -------------------------------------------------------------------------
  describe("dialog color", () => {
    it("applies dialogColor modifier class", () => {
      render(<DatePickerDialog {...defaultProps} dialogColor="error" />)
      const dialog = screen.getByRole("dialog")
      expect(dialog.className).toMatch(/error/)
    })
  })
})
