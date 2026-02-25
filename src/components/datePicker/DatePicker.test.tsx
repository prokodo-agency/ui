import { axe } from "jest-axe"

import { fireEvent, render, screen } from "@/tests"

import { DatePickerView } from "./DatePicker.view"

describe("DatePicker", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a date input", () => {
      render(<DatePickerView label="Date of birth" name="dob" />)
      // type="date" inputs don't have a textbox role; query by label text instead
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument()
    })

    it("renders with the provided label", () => {
      render(<DatePickerView label="Start date" name="date" />)
      // Label text is split into highlighted + rest spans; query by partial label match
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    })

    it("renders as a datetime-local input when withTime=true", () => {
      render(<DatePickerView withTime label="Date and time" name="dt" />)
      const input = screen.getByLabelText("Date and time") as HTMLInputElement
      expect(input.type).toBe("datetime-local")
    })

    it("renders placeholder when provided", () => {
      render(
        <DatePickerView
          label="Event date"
          name="date"
          placeholder="YYYY-MM-DD"
        />,
      )
      expect(screen.getByPlaceholderText("YYYY-MM-DD")).toBeInTheDocument()
    })

    it("renders with the formatted value", () => {
      render(<DatePickerView label="Date" name="date" value="2024-06-15" />)
      // Input should have formatted value; query by label since type="date" has no textbox role
      const input = screen.getByLabelText(/date/i) as HTMLInputElement
      expect(input.value).toBeTruthy()
    })

    it("renders error text when provided", () => {
      render(
        <DatePickerView
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
          helperText="Accepts YYYY-MM-DD format"
          label="Date"
          name="date"
        />,
      )
      expect(screen.getByText("Accepts YYYY-MM-DD format")).toBeInTheDocument()
    })

    it("renders with minDate and maxDate props", () => {
      render(
        <DatePickerView
          label="Date"
          maxDate="2024-12-31"
          minDate="2024-01-01"
          name="date"
        />,
      )
      const input = screen.getByLabelText(/date/i) as HTMLInputElement
      expect(input).toHaveAttribute("min", "2024-01-01")
      expect(input).toHaveAttribute("max", "2024-12-31")
    })

    it("calls onChangeInput when input event fires", () => {
      const handleChange = jest.fn()
      render(
        <DatePickerView
          label="Date"
          name="date"
          onChangeInput={handleChange}
        />,
      )
      const input = screen.getByLabelText(/date/i)
      fireEvent.input(input, { target: { value: "2024-06-15" } })
      expect(handleChange).toHaveBeenCalledWith("2024-06-15")
    })

    it("calls onChangeInput when change event fires", () => {
      const handleChange = jest.fn()
      render(
        <DatePickerView
          label="Date"
          name="date"
          onChangeInput={handleChange}
        />,
      )
      const input = screen.getByLabelText(/date/i)
      fireEvent.change(input, { target: { value: "2024-07-20" } })
      expect(handleChange).toHaveBeenCalledWith("2024-07-20")
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("date picker has no axe violations", async () => {
      const { container } = render(
        <DatePickerView label="Appointment date" name="a11y-date" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("date picker with error has no axe violations", async () => {
      const { container } = render(
        <DatePickerView
          errorText="Please enter a valid date"
          label="Date"
          name="a11y-date-err"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("datetime-local picker has no axe violations", async () => {
      const { container } = render(
        <DatePickerView withTime label="Event time" name="a11y-datetime" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
