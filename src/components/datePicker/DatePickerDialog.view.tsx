import { Icon } from "@/components/icon"
import { create } from "@/helpers/bem"

import styles from "./DatePicker.module.scss"
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

import type { DatePickerDialogProps } from "./DatePicker.model"
import type { JSX } from "react"

export type { DatePickerDialogProps } from "./DatePicker.model"

// -----------------------------------------------------------------
// Component
// -----------------------------------------------------------------

const bem = create(styles, "DatePicker")

export function DatePickerDialog({
  name,
  label,
  withTime = false,
  minuteStep = 1,
  selectedDate,
  viewingMonth,
  minDate,
  maxDate,
  prevIcon = "ArrowLeft01Icon",
  nextIcon = "ArrowRight01Icon",
  prevAriaLabel = "Previous month",
  nextAriaLabel = "Next month",
  weekdays = WEEKDAYS,
  monthFormat: _monthFormat,
  dayAriaFormat = "D MMMM YYYY",
  todayLabel = "Today",
  clearLabel = "Clear",
  applyLabel = "Apply",
  timeLabel = "Time",
  closeIcon = "Cancel01Icon",
  closeLabel = "Close",
  dialogColor,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  onToday,
  onClear,
  onApply,
  onTimeChange,
  onClose,
  onDialogTouchStart,
  onDialogTouchEnd,
  viewMode = "days",
  onViewModeChange,
  onMonthSelect,
  onYearSelect,
  style,
}: DatePickerDialogProps): JSX.Element {
  const calendarDays = buildCalendarGrid(viewingMonth, minDate, maxDate)
  const hours = buildHours()
  const minutes = buildMinutes(minuteStep)

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        className={bem("dialog__backdrop")}
        onClick={onClose}
      />

      <div
        aria-label={`Choose ${label}`}
        aria-modal="true"
        id={`${name}-dialog`}
        role="dialog"
        style={style}
        className={[
          bem("dialog"),
          dialogColor ? bem(undefined, { [dialogColor]: true }) : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onTouchEnd={onDialogTouchEnd}
        onTouchStart={onDialogTouchStart}
      >
        {/* Header: prev / month label / next */}
        <div className={bem("dialog__header")}>
          <button
            aria-label={prevAriaLabel}
            className={bem("nav__btn", { prev: true })}
            type="button"
            onClick={onPrevMonth}
          >
            <Icon name={prevIcon} size="sm" />
          </button>

          <span className={bem("month__label")}>
            {viewMode === "days" && (
              <>
                <button
                  className={bem("header-btn")}
                  type="button"
                  onClick={() => onViewModeChange?.("months")}
                >
                  {viewingMonth.format("MMMM")}
                </button>
                <button
                  className={bem("header-btn")}
                  type="button"
                  onClick={() => onViewModeChange?.("years")}
                >
                  {viewingMonth.format("YYYY")}
                </button>
              </>
            )}
            {viewMode === "months" && (
              <button
                className={bem("header-btn")}
                type="button"
                onClick={() => onViewModeChange?.("years")}
              >
                {viewingMonth.format("YYYY")}
              </button>
            )}
            {viewMode === "years" &&
              (() => {
                const startYear = Math.floor(viewingMonth.year() / 10) * 10
                return (
                  <span className={bem("header-range")}>
                    {startYear}–{startYear + 11}
                  </span>
                )
              })()}
          </span>

          <button
            aria-label={nextAriaLabel}
            className={bem("nav__btn", { next: true })}
            type="button"
            onClick={onNextMonth}
          >
            <Icon name={nextIcon} size="sm" />
          </button>

          {/* Close button — visible on mobile only */}
          <button
            aria-label={closeLabel}
            className={bem("dialog__close")}
            type="button"
            onClick={onClose}
          >
            <Icon name={closeIcon} size="sm" />
          </button>
        </div>

        {/* Weekday strip — only in day view */}
        {viewMode === "days" && (
          <div aria-hidden="true" className={bem("weekdays")}>
            {weekdays.map(wd => (
              <span key={wd} className={bem("weekday")}>
                {wd}
              </span>
            ))}
          </div>
        )}

        {/* Day grid */}
        {viewMode === "days" && (
          <div className={bem("days")} role="grid">
            {Array.from(
              { length: Math.ceil(calendarDays.length / 7) },
              (_, weekIdx) => (
                <div key={weekIdx} role="row">
                  {calendarDays
                    .slice(weekIdx * 7, weekIdx * 7 + 7)
                    .map(cell => {
                      const isSelected = Boolean(
                        selectedDate &&
                          cell.isCurrentMonth &&
                          cell.date.isSame(selectedDate, "day"),
                      )
                      return (
                        <button
                          key={cell.date.format("YYYY-MM-DD")}
                          aria-label={cell.date.format(dayAriaFormat)}
                          aria-selected={isSelected}
                          disabled={cell.isDisabled}
                          role="gridcell"
                          type="button"
                          className={bem("day", {
                            today: cell.isToday,
                            selected: isSelected,
                            outside: !cell.isCurrentMonth,
                            disabled: cell.isDisabled,
                          })}
                          tabIndex={
                            cell.isCurrentMonth && !cell.isDisabled ? 0 : -1
                          }
                          onClick={() => {
                            /* istanbul ignore else */
                            if (!cell.isDisabled && cell.isCurrentMonth) {
                              onDayClick(cell.date)
                            }
                          }}
                        >
                          {cell.date.date()}
                        </button>
                      )
                    })}
                </div>
              ),
            )}
          </div>
        )}

        {/* Month picker */}
        {viewMode === "months" && (
          <div className={bem("picker-grid")}>
            {MONTHS_SHORT.map((monthName, idx) => {
              const disabled = isMonthDisabled(
                idx,
                viewingMonth.year(),
                minDate,
                maxDate,
              )
              const isSelected =
                selectedDate?.month() === idx &&
                selectedDate?.year() === viewingMonth.year()
              const isCurrent =
                new Date().getMonth() === idx &&
                new Date().getFullYear() === viewingMonth.year()
              return (
                <button
                  key={monthName}
                  aria-disabled={disabled}
                  disabled={disabled}
                  type="button"
                  className={bem("picker-cell", {
                    selected: isSelected,
                    today: isCurrent,
                    disabled,
                  })}
                  onClick={() => !disabled && onMonthSelect?.(idx)}
                >
                  {monthName}
                </button>
              )
            })}
          </div>
        )}

        {/* Year picker */}
        {viewMode === "years" &&
          (() => {
            const startYear = Math.floor(viewingMonth.year() / 10) * 10
            const years = Array.from({ length: 12 }, (_, i) => startYear + i)
            return (
              <div className={bem("picker-grid")}>
                {years.map(y => {
                  const disabled = isYearDisabled(y, minDate, maxDate)
                  const isSelected = selectedDate?.year() === y
                  const isCurrent = new Date().getFullYear() === y
                  return (
                    <button
                      key={y}
                      aria-disabled={disabled}
                      disabled={disabled}
                      type="button"
                      className={bem("picker-cell", {
                        selected: isSelected,
                        today: isCurrent,
                        disabled,
                      })}
                      onClick={() => !disabled && onYearSelect?.(y)}
                    >
                      {y}
                    </button>
                  )
                })}
              </div>
            )
          })()}

        {/* Time row (optional) */}
        {withTime && (
          <div className={bem("time__row")}>
            <span className={bem("time__label")}>{timeLabel}</span>

            <select
              aria-label="Hour"
              className={bem("time__select")}
              value={selectedDate?.hour() ?? 0}
              onChange={e => onTimeChange(parseInt(e.target.value, 10), "hour")}
            >
              {hours.map(h => (
                <option key={h} value={h}>
                  {pad2(h)}
                </option>
              ))}
            </select>

            <span aria-hidden="true" className={bem("time__sep")}>
              :
            </span>

            <select
              aria-label="Minute"
              className={bem("time__select")}
              value={
                selectedDate
                  ? Math.round(
                      selectedDate.minute() / Math.max(1, minuteStep),
                    ) * Math.max(1, minuteStep)
                  : 0
              }
              onChange={e =>
                onTimeChange(parseInt(e.target.value, 10), "minute")
              }
            >
              {minutes.map(m => (
                <option key={m} value={m}>
                  {pad2(m)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Footer */}
        <div className={bem("footer")}>
          <button
            className={bem("footer__btn", { ghost: true })}
            type="button"
            onClick={onToday}
          >
            {todayLabel}
          </button>

          <button
            className={bem("footer__btn", { ghost: true })}
            type="button"
            onClick={onClear}
          >
            {clearLabel}
          </button>

          <button
            className={bem("footer__btn", { filled: true })}
            type="button"
            onClick={onApply}
          >
            {applyLabel}
          </button>
        </div>
      </div>
    </>
  )
}
