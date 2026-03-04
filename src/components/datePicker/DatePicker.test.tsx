import dayjs from "dayjs"
import { axe } from "jest-axe"

import { fireEvent, render, screen } from "@/tests"

import { DatePickerView } from "./DatePicker.view"

import type { DatePickerDialogBehavior } from "./DatePicker.model"

const noop = () => undefined

const defaultBehavior: DatePickerDialogBehavior = {
  isOpen: false,
  viewingMonth: dayjs("2024-06-01"),
  selectedDate: null,
  onToggle: noop,
  onPrevMonth: noop,
  onNextMonth: noop,
  onDayClick: noop,
  onToday: noop,
  onClear: noop,
  onApply: noop,
  onTimeChange: noop,
  viewMode: "days",
  onViewModeChange: noop,
  onMonthSelect: noop,
  onYearSelect: noop,
}

describe("DatePicker", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a trigger input with the provided label", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          label="Date of birth"
          name="dob"
        />,
      )
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument()
    })

    it("renders placeholder when provided", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          label="Event date"
          name="date"
          placeholder="YYYY-MM-DD"
        />,
      )
      expect(screen.getByPlaceholderText("YYYY-MM-DD")).toBeInTheDocument()
    })

    it("renders the formatted selected date as the input value", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          label="Date"
          name="date"
          selectedDate={dayjs("2024-06-15")}
        />,
      )
      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("2024-06-15")
    })

    it("renders error text when provided", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          errorText="Invalid date format"
          label="Date"
          name="date"
        />,
      )
      expect(screen.getByText("Invalid date format")).toBeInTheDocument()
    })

    it("renders helper text when provided", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          helperText="Accepts YYYY-MM-DD format"
          label="Date"
          name="date"
        />,
      )
      expect(screen.getByText("Accepts YYYY-MM-DD format")).toBeInTheDocument()
    })

    it("calls onToggle when the trigger is clicked", () => {
      const handleToggle = jest.fn()
      render(
        <DatePickerView
          {...defaultBehavior}
          label="Date"
          name="date"
          onToggle={handleToggle}
        />,
      )
      fireEvent.click(screen.getByRole("textbox"))
      expect(handleToggle).toHaveBeenCalledTimes(1)
    })

    it("shows the calendar dialog when isOpen=true", () => {
      render(
        <DatePickerView {...defaultBehavior} isOpen label="Date" name="date" />,
      )
      expect(screen.getByRole("dialog")).toBeInTheDocument()
      expect(
        screen.getByText(defaultBehavior.viewingMonth.format("MMMM")),
      ).toBeInTheDocument()
      expect(
        screen.getByText(defaultBehavior.viewingMonth.format("YYYY")),
      ).toBeInTheDocument()
    })

    it("hides the calendar dialog when isOpen=false", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          isOpen={false}
          label="Date"
          name="date"
        />,
      )
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("date picker has no axe violations", async () => {
      const { container } = render(
        <DatePickerView
          {...defaultBehavior}
          label="Appointment date"
          name="a11y-date"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("date picker with error has no axe violations", async () => {
      const { container } = render(
        <DatePickerView
          {...defaultBehavior}
          errorText="Please enter a valid date"
          label="Date"
          name="a11y-date-err"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("open dialog has no axe violations", async () => {
      const { container } = render(
        <DatePickerView
          {...defaultBehavior}
          isOpen
          withTime
          label="Event time"
          name="a11y-datetime"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  // -------------------------------------------------------------------------
  // Color prop forwarding
  // -------------------------------------------------------------------------
  describe("color prop", () => {
    it("applies a color modifier class to the root element", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          color="success"
          label="Date"
          name="dp-color"
        />,
      )
      expect(
        document.querySelector(".prokodo-DatePicker--success"),
      ).toBeInTheDocument()
    })

    it("dialog inherits color when dialogColor is not explicitly set", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          isOpen
          color="warning"
          label="Event"
          name="dp-inherit"
        />,
      )
      const dialog = screen.getByRole("dialog")
      expect(dialog).toHaveClass("prokodo-DatePicker--warning")
    })

    it("dialog uses explicit dialogColor over color when both are set", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          isOpen
          color="warning"
          dialogColor="error"
          label="Event"
          name="dp-explicit"
        />,
      )
      const dialog = screen.getByRole("dialog")
      expect(dialog).toHaveClass("prokodo-DatePicker--error")
      expect(dialog).not.toHaveClass("prokodo-DatePicker--warning")
    })
  })

  // -------------------------------------------------------------------------
  // Portal rendering
  // -------------------------------------------------------------------------
  describe("portal rendering", () => {
    it("renders the dialog inside a portal when dialogPortalTarget is provided", () => {
      render(
        <DatePickerView
          {...defaultBehavior}
          isOpen
          dialogPortalTarget={document.body}
          label="Portal Date"
          name="dp-portal"
        />,
      )
      expect(screen.getByRole("dialog")).toBeInTheDocument()
    })
  })
})
