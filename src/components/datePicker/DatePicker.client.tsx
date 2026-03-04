"use client"

import dayjs, { isDayjs, type Dayjs } from "dayjs"
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type FC,
} from "react"

import { isNull } from "@/helpers/validations"

import { DatePickerView } from "./DatePicker.view"

import type {
  DatePickerProps,
  DatePickerValue,
  DatePickerViewMode,
} from "./DatePicker.model"

function toDayjs(val?: DatePickerValue): Dayjs | null {
  if (isNull(val)) return null
  if (isDayjs(val)) return val.isValid() ? val : null
  const d = dayjs(val)
  return d.isValid() ? d : null
}

function sameByUnit(
  a: Dayjs | null,
  b: Dayjs | null,
  unit: "day" | "minute",
): boolean {
  if (a === null && b === null) return true
  if (a !== null && b !== null) return a.isSame(b, unit)
  return false
}

const DatePickerClient: FC<DatePickerProps> = ({
  name,
  value,
  onChange,
  onValidate,
  format,
  minDate,
  maxDate,
  translations,
  label,
  helperText,
  withTime = false,
  minuteStep = 1,
  required,
  color = "primary",
  ...rest
}) => {
  const unit = withTime ? "minute" : "day"
  const fmt = useMemo(
    () => format ?? (withTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"),
    [format, withTime],
  )

  const [date, setDate] = useState<Dayjs | null>(toDayjs(value))
  const [error, setError] = useState<string | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [viewMode, setViewMode] = useState<DatePickerViewMode>("days")

  // Keep a ref so the swipe handler (which has no deps) can read current viewMode.
  const viewModeRef = useRef<DatePickerViewMode>("days")
  viewModeRef.current = viewMode

  // ── Swipe gestures for the mobile dialog ──────────────────────────
  const swipeTouchStart = useRef<{ x: number; y: number } | null>(null)

  const handleDialogTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const [t] = Array.from(e.touches)
      if (t) swipeTouchStart.current = { x: t.clientX, y: t.clientY }
    },
    [],
  )

  const handleDialogTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const start = swipeTouchStart.current
      swipeTouchStart.current = null
      if (!start) return
      const [t] = Array.from(e.changedTouches)
      if (!t) return
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy > 80) setIsOpen(false)
      } else if (Math.abs(dx) > 50 && viewModeRef.current === "days") {
        // Horizontal swipe navigates months only in days-panel view
        if (dx < 0) setViewingMonth(m => m.add(1, "month"))
        else setViewingMonth(m => m.subtract(1, "month"))
      }
    },
    [],
  )
  const [viewingMonth, setViewingMonth] = useState<Dayjs>(
    () => toDayjs(value) ?? dayjs(),
  )
  const [draft, setDraft] = useState<Dayjs | null>(toDayjs(value))
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const incoming = toDayjs(value)
    if (!sameByUnit(date, incoming, unit)) {
      setDate(incoming)
      setDraft(incoming)
      if (incoming) {
        setViewingMonth(incoming)
        setError(undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, unit])

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    // On mobile the dialog is portaled to document.body and has its own
    // backdrop/close button — skip the click-outside logic entirely.
    if (!isOpen || isMobile) return
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setDraft(date)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [isOpen, isMobile, date])

  const validateDate = useCallback(
    (d: Dayjs | null): string | undefined => {
      if (isNull(d)) {
        if (required) return translations?.required ?? "This field is required."
        return undefined
      }
      if (!isNull(minDate) && d?.isBefore(dayjs(minDate), unit)) {
        return (
          translations?.minDate ??
          (dayjs(minDate).isSame(dayjs(), unit)
            ? withTime
              ? "Date/time cannot be in the past."
              : "Date cannot be in the past."
            : `Must be >= ${dayjs(minDate).format(fmt)}`)
        )
      }
      if (!isNull(maxDate) && d?.isAfter(dayjs(maxDate), unit)) {
        return (
          translations?.maxDate ??
          (dayjs(maxDate).isSame(dayjs(), unit)
            ? withTime
              ? "Date/time cannot be in the future."
              : "Date cannot be in the future."
            : `Must be <= ${dayjs(maxDate).format(fmt)}`)
        )
      }
      return undefined
    },
    [minDate, maxDate, unit, fmt, required, withTime, translations],
  )

  const commit = useCallback(
    (d: Dayjs | null) => {
      const err = validateDate(d)
      setError(err)
      onValidate?.(name, err)
      if (!err) {
        setDate(d)
        onChange?.(d)
      }
    },
    [validateDate, onChange, onValidate, name],
  )

  const handleToggle = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        setViewingMonth(date ?? dayjs())
        setDraft(date)
        setViewMode("days")
      }
      return !prev
    })
  }, [date])

  const handleViewModeChange = useCallback((mode: DatePickerViewMode) => {
    setViewMode(mode)
  }, [])

  const handleMonthSelect = useCallback((month: number) => {
    setViewingMonth(m => m.month(month))
    setViewMode("days")
  }, [])

  const handleYearSelect = useCallback((year: number) => {
    setViewingMonth(m => m.year(year))
    setViewMode("months")
  }, [])

  const handlePrevMonth = useCallback(() => {
    setViewingMonth(m => {
      const mode = viewModeRef.current
      if (mode === "months") return m.subtract(1, "year")
      if (mode === "years") return m.subtract(10, "year")
      return m.subtract(1, "month")
    })
  }, [])

  const handleNextMonth = useCallback(() => {
    setViewingMonth(m => {
      const mode = viewModeRef.current
      if (mode === "months") return m.add(1, "year")
      if (mode === "years") return m.add(10, "year")
      return m.add(1, "month")
    })
  }, [])

  const handleDayClick = useCallback(
    (day: Dayjs) => {
      const withExistingTime =
        withTime && draft
          ? day
              .hour(draft.hour())
              .minute(draft.minute())
              .second(0)
              .millisecond(0)
          : day.startOf("day")

      if (!withTime) {
        commit(withExistingTime)
        setDraft(withExistingTime)
        setIsOpen(false)
      } else {
        setDraft(withExistingTime)
      }
    },
    [withTime, draft, commit],
  )

  const handleToday = useCallback(() => {
    const today = dayjs().startOf("day")
    setViewingMonth(today)
    setDraft(today)
  }, [])

  const handleClear = useCallback(() => {
    setDraft(null)
    commit(null)
    setIsOpen(false)
  }, [commit])

  const handleApply = useCallback(() => {
    let snapped = draft
    if (withTime && snapped) {
      snapped = snapped
        .minute(
          Math.round(snapped.minute() / Math.max(1, minuteStep)) *
            Math.max(1, minuteStep),
        )
        .second(0)
        .millisecond(0)
    }
    commit(snapped)
    if (!validateDate(snapped)) {
      setIsOpen(false)
    }
  }, [draft, withTime, minuteStep, commit, validateDate])

  const handleTimeChange = useCallback(
    (val: number, timeUnit: "hour" | "minute") => {
      setDraft(prev => {
        const base = prev ?? dayjs().startOf("day")
        return timeUnit === "hour" ? base.hour(val) : base.minute(val)
      })
    },
    [],
  )

  return (
    <div
      ref={rootRef}
      style={{ position: "relative", display: "inline-block", width: "100%" }}
    >
      <DatePickerView
        {...rest}
        color={color}
        dialogPortalTarget={isMobile ? document.body : null}
        errorText={error}
        format={fmt}
        helperText={helperText}
        isOpen={isOpen}
        label={label}
        maxDate={maxDate}
        minDate={minDate}
        minuteStep={minuteStep}
        name={name}
        required={required}
        selectedDate={draft}
        viewingMonth={viewingMonth}
        viewMode={viewMode}
        withTime={withTime}
        onApply={handleApply}
        onClear={handleClear}
        onDayClick={handleDayClick}
        onDialogTouchEnd={handleDialogTouchEnd}
        onDialogTouchStart={handleDialogTouchStart}
        onMonthSelect={handleMonthSelect}
        onNextMonth={handleNextMonth}
        onPrevMonth={handlePrevMonth}
        onTimeChange={handleTimeChange}
        onToday={handleToday}
        onToggle={handleToggle}
        onViewModeChange={handleViewModeChange}
        onYearSelect={handleYearSelect}
      />
    </div>
  )
}

export default DatePickerClient
