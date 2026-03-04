import dayjs from "dayjs"

import {
  buildCalendarGrid,
  buildHours,
  buildMinutes,
  isMonthDisabled,
  isYearDisabled,
  MONTHS_SHORT,
  pad2,
  WEEKDAYS,
} from "./DatePicker.utils"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe("DatePicker utils", () => {
  describe("WEEKDAYS", () => {
    it("has 7 entries starting with Mo", () => {
      expect(WEEKDAYS).toHaveLength(7)
      expect(WEEKDAYS[0]).toBe("Mo")
      expect(WEEKDAYS[6]).toBe("Su")
    })
  })

  describe("MONTHS_SHORT", () => {
    it("has 12 entries", () => {
      expect(MONTHS_SHORT).toHaveLength(12)
      expect(MONTHS_SHORT[0]).toBe("Jan")
      expect(MONTHS_SHORT[11]).toBe("Dec")
    })
  })

  // -------------------------------------------------------------------------
  // buildCalendarGrid
  // -------------------------------------------------------------------------

  describe("buildCalendarGrid", () => {
    it("builds a grid for a month where trailing cells are needed", () => {
      // July 2024: starts Monday (offset=0), 31 days → 31 cells, trailing=4
      const grid = buildCalendarGrid(dayjs("2024-07-01"))
      // 31 days + 4 trailing = 35 total, a multiple of 7
      expect(grid.length % 7).toBe(0)
      expect(grid.length).toBeGreaterThanOrEqual(31)

      // Trailing cells are not current month and are disabled
      const trailing = grid.slice(-4)
      trailing.forEach(cell => {
        expect(cell.isCurrentMonth).toBe(false)
        expect(cell.isDisabled).toBe(true)
      })
    })

    it("builds a grid for a month with no trailing cells", () => {
      // June 2024: starts Saturday (offset=5), 30 days → 35 cells, trailing=0
      const grid = buildCalendarGrid(dayjs("2024-06-01"))
      expect(grid.length % 7).toBe(0)
      // All cells in a 5-row grid
      grid
        .filter(c => c.isCurrentMonth)
        .forEach(cell => {
          expect(cell.isDisabled).toBe(false)
        })
    })

    it("marks today correctly", () => {
      const today = dayjs()
      const grid = buildCalendarGrid(today.startOf("month"))
      const todayCell = grid.find(c => c.isCurrentMonth && c.isToday)
      expect(todayCell).toBeDefined()
    })

    it("disables cells before minDate", () => {
      const month = dayjs("2025-03-01")
      const min = "2025-03-10"
      const grid = buildCalendarGrid(month, min)
      const beforeMin = grid.filter(c => c.isCurrentMonth && c.date.date() < 10)
      beforeMin.forEach(c => expect(c.isDisabled).toBe(true))
    })

    it("disables cells after maxDate", () => {
      const month = dayjs("2025-03-01")
      const max = "2025-03-20"
      const grid = buildCalendarGrid(month, undefined, max)
      const afterMax = grid.filter(c => c.isCurrentMonth && c.date.date() > 20)
      afterMax.forEach(c => expect(c.isDisabled).toBe(true))
    })

    it("uses Dayjs value for minDate", () => {
      const month = dayjs("2025-05-01")
      const min = dayjs("2025-05-15")
      const grid = buildCalendarGrid(month, min)
      const before = grid.filter(c => c.isCurrentMonth && c.date.date() < 15)
      before.forEach(c => expect(c.isDisabled).toBe(true))
    })

    it("produces only complete rows (multiple of 7)", () => {
      ;["2024-01-01", "2024-02-01", "2024-03-01", "2024-12-01"].forEach(m => {
        const grid = buildCalendarGrid(dayjs(m))
        expect(grid.length % 7).toBe(0)
      })
    })
  })

  // -------------------------------------------------------------------------
  // buildHours / buildMinutes / pad2
  // -------------------------------------------------------------------------

  describe("buildHours", () => {
    it("returns 0–23", () => {
      const hrs = buildHours()
      expect(hrs).toHaveLength(24)
      expect(hrs[0]).toBe(0)
      expect(hrs[23]).toBe(23)
    })
  })

  describe("buildMinutes", () => {
    it("returns 0–59 in steps of 1 by default", () => {
      const mins = buildMinutes(1)
      expect(mins).toHaveLength(60)
    })

    it("applies a custom step", () => {
      const mins = buildMinutes(15)
      expect(mins).toEqual([0, 15, 30, 45])
    })

    it("clamps step to at least 1", () => {
      const mins = buildMinutes(0)
      expect(mins).toHaveLength(60)
    })
  })

  describe("pad2", () => {
    it("pads single digits", () => {
      expect(pad2(5)).toBe("05")
      expect(pad2(0)).toBe("00")
    })

    it("does not pad two-digit numbers", () => {
      expect(pad2(10)).toBe("10")
      expect(pad2(59)).toBe("59")
    })
  })

  // -------------------------------------------------------------------------
  // isMonthDisabled
  // -------------------------------------------------------------------------

  describe("isMonthDisabled", () => {
    it("returns false when no min/max", () => {
      expect(isMonthDisabled(5, 2025)).toBe(false)
    })

    it("returns true when the entire month is before minDate", () => {
      // Jan 2025 ends on 2025-01-31; minDate is 2025-02-01 → disabled
      expect(isMonthDisabled(0, 2025, "2025-02-01")).toBe(true)
    })

    it("returns false when minDate is within the month", () => {
      expect(isMonthDisabled(0, 2025, "2025-01-15")).toBe(false)
    })

    it("returns true when the entire month is after maxDate", () => {
      // Mar 2025 starts on 2025-03-01; maxDate is 2025-02-28 → disabled
      expect(isMonthDisabled(2, 2025, undefined, "2025-02-28")).toBe(true)
    })

    it("returns false when maxDate is within the month", () => {
      expect(isMonthDisabled(2, 2025, undefined, "2025-03-15")).toBe(false)
    })

    it("accepts Dayjs values for minDate and maxDate", () => {
      expect(
        isMonthDisabled(0, 2025, dayjs("2025-02-01"), dayjs("2025-03-01")),
      ).toBe(true)
    })
  })

  // -------------------------------------------------------------------------
  // isYearDisabled
  // -------------------------------------------------------------------------

  describe("isYearDisabled", () => {
    it("returns false when no min/max", () => {
      expect(isYearDisabled(2025)).toBe(false)
    })

    it("returns true when the entire year is before minDate", () => {
      // 2024 ends 2024-12-31; minDate is 2025-01-01 → disabled
      expect(isYearDisabled(2024, "2025-01-01")).toBe(true)
    })

    it("returns false when minDate is within the year", () => {
      expect(isYearDisabled(2025, "2025-06-15")).toBe(false)
    })

    it("returns true when the entire year is after maxDate", () => {
      // 2026 starts 2026-01-01; maxDate is 2025-12-31 → disabled
      expect(isYearDisabled(2026, undefined, "2025-12-31")).toBe(true)
    })

    it("returns false when maxDate is within the year", () => {
      expect(isYearDisabled(2025, undefined, "2025-06-15")).toBe(false)
    })

    it("accepts Dayjs values", () => {
      expect(
        isYearDisabled(2024, dayjs("2025-01-01"), dayjs("2026-01-01")),
      ).toBe(true)
    })
  })
})
