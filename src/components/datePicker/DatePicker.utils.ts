import dayjs, { type Dayjs } from "dayjs"

import { isNull } from "@/helpers/validations"

import type { CalendarDay, DatePickerValue } from "./DatePicker.model"

// -----------------------------------------------------------------
// Constants
// -----------------------------------------------------------------

export const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const

export const MONTHS_SHORT = [
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
] as const

// -----------------------------------------------------------------
// Calendar grid
// -----------------------------------------------------------------

export function buildCalendarGrid(
  viewingMonth: Dayjs,
  minDate?: DatePickerValue,
  maxDate?: DatePickerValue,
): CalendarDay[] {
  const today = dayjs()
  const firstOfMonth = viewingMonth.startOf("month")
  const totalDays = viewingMonth.daysInMonth()
  const startOffset = (firstOfMonth.day() + 6) % 7
  const min = !isNull(minDate) ? dayjs(minDate).startOf("day") : null
  const max = !isNull(maxDate) ? dayjs(maxDate).startOf("day") : null
  const cells: CalendarDay[] = []

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({
      date: firstOfMonth.subtract(i + 1, "day"),
      isCurrentMonth: false,
      isToday: false,
      isDisabled: true,
    })
  }

  for (let d = 1; d <= totalDays; d++) {
    const date = firstOfMonth.date(d)
    const start = date.startOf("day")
    cells.push({
      date,
      isCurrentMonth: true,
      isToday: date.isSame(today, "day"),
      isDisabled:
        (min !== null && start.isBefore(min)) ||
        (max !== null && start.isAfter(max)),
    })
  }

  const trailing = (7 - (cells.length % 7)) % 7
  const lastOfMonth = firstOfMonth.endOf("month")
  for (let i = 1; i <= trailing; i++) {
    cells.push({
      date: lastOfMonth.add(i, "day"),
      isCurrentMonth: false,
      isToday: false,
      isDisabled: true,
    })
  }

  return cells
}

// -----------------------------------------------------------------
// Time helpers
// -----------------------------------------------------------------

export function buildHours(): number[] {
  return Array.from({ length: 24 }, (_, i) => i)
}

export function buildMinutes(step: number): number[] {
  const s = Math.max(1, step)
  const out: number[] = []
  for (let m = 0; m < 60; m += s) out.push(m)
  return out
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

// -----------------------------------------------------------------
// Month / year range helpers (respects minDate / maxDate)
// -----------------------------------------------------------------

/**
 * Returns true if the entire month is outside the allowed date range.
 * @param month - 0-based month index
 * @param year  - full year
 */
export function isMonthDisabled(
  month: number,
  year: number,
  minDate?: DatePickerValue,
  maxDate?: DatePickerValue,
): boolean {
  const firstDay = dayjs(new Date(year, month, 1))
  const lastDay = firstDay.endOf("month")
  const min = !isNull(minDate) ? dayjs(minDate).startOf("day") : null
  const max = !isNull(maxDate) ? dayjs(maxDate).startOf("day") : null
  if (min && lastDay.isBefore(min, "day")) return true
  if (max && firstDay.isAfter(max, "day")) return true
  return false
}

/**
 * Returns true if the entire year is outside the allowed date range.
 */
export function isYearDisabled(
  year: number,
  minDate?: DatePickerValue,
  maxDate?: DatePickerValue,
): boolean {
  const firstDay = dayjs(new Date(year, 0, 1))
  const lastDay = dayjs(new Date(year, 11, 31))
  const min = !isNull(minDate) ? dayjs(minDate).startOf("day") : null
  const max = !isNull(maxDate) ? dayjs(maxDate).startOf("day") : null
  if (min && lastDay.isBefore(min, "day")) return true
  if (max && firstDay.isAfter(max, "day")) return true
  return false
}
