import { createPortal } from "react-dom"

import { InputView } from "@/components/input/Input.view"
import { create } from "@/helpers/bem"

import styles from "./DatePicker.module.scss"
import { DatePickerDialog } from "./DatePickerDialog.view"

import type {
  DatePickerDialogBehavior,
  DatePickerProps,
} from "./DatePicker.model"
import type { JSX, TouchEventHandler } from "react"

export type { DatePickerDialogBehavior } from "./DatePicker.model"

const bem = create(styles, "DatePicker")

export function DatePickerView({
  name,
  label,
  helperText,
  errorText,
  format,
  placeholder,
  minDate,
  maxDate,
  withTime = false,
  minuteStep = 1,
  color = "primary",
  required,
  prevIcon,
  nextIcon,
  prevAriaLabel,
  nextAriaLabel,
  weekdays,
  monthFormat,
  dayAriaFormat,
  todayLabel,
  clearLabel,
  applyLabel,
  timeLabel,
  closeIcon,
  closeLabel,
  dialogColor,
  isOpen,
  /** When provided, the calendar dialog is portaled into this element (e.g. document.body on mobile). */
  dialogPortalTarget,
  viewingMonth,
  selectedDate,
  onToggle,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  onToday,
  onClear,
  onApply,
  onTimeChange,
  onDialogTouchStart,
  onDialogTouchEnd,
  viewMode,
  onViewModeChange,
  onMonthSelect,
  onYearSelect,
}: Omit<DatePickerProps, "onChange" | "value"> &
  DatePickerDialogBehavior & {
    /** Portal target for the calendar dialog (e.g. document.body on mobile). */
    dialogPortalTarget?: Element | null
    onDialogTouchStart?: TouchEventHandler<HTMLDivElement>
    onDialogTouchEnd?: TouchEventHandler<HTMLDivElement>
  }): JSX.Element {
  const effectiveFormat =
    format ?? (withTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD")

  const displayValue = selectedDate?.format(effectiveFormat) ?? ""

  return (
    <div className={bem(undefined, { [color]: true })}>
      <InputView
        readOnly
        color={color}
        errorText={errorText}
        helperText={helperText}
        isFocused={isOpen}
        label={label}
        name={name}
        placeholder={placeholder}
        required={required}
        trailingIcon="Calendar01Icon"
        trailingIconLabel={isOpen ? "Close calendar" : "Open calendar"}
        type="text"
        value={displayValue}
        trailingIconButtonProps={{
          "aria-haspopup": "dialog",
          "aria-expanded": isOpen,
          "aria-controls": isOpen ? `${name}-dialog` : undefined,
        }}
        onClick={onToggle}
        onTrailingIconClick={onToggle}
      />
      {isOpen &&
        (() => {
          const dialog = (
            <DatePickerDialog
              applyLabel={applyLabel}
              clearLabel={clearLabel}
              closeIcon={closeIcon}
              closeLabel={closeLabel}
              dayAriaFormat={dayAriaFormat}
              dialogColor={dialogColor ?? color}
              label={label}
              maxDate={maxDate}
              minDate={minDate}
              minuteStep={minuteStep}
              monthFormat={monthFormat}
              name={name}
              nextAriaLabel={nextAriaLabel}
              nextIcon={nextIcon}
              prevAriaLabel={prevAriaLabel}
              prevIcon={prevIcon}
              selectedDate={selectedDate}
              timeLabel={timeLabel}
              todayLabel={todayLabel}
              viewingMonth={viewingMonth}
              viewMode={viewMode}
              weekdays={weekdays}
              withTime={withTime}
              onApply={onApply}
              onClear={onClear}
              onClose={onToggle}
              onDayClick={onDayClick}
              onDialogTouchEnd={onDialogTouchEnd}
              onDialogTouchStart={onDialogTouchStart}
              onMonthSelect={onMonthSelect}
              onNextMonth={onNextMonth}
              onPrevMonth={onPrevMonth}
              onTimeChange={onTimeChange}
              onToday={onToday}
              onViewModeChange={onViewModeChange}
              onYearSelect={onYearSelect}
            />
          )
          return dialogPortalTarget
            ? createPortal(dialog, dialogPortalTarget)
            : dialog
        })()}
    </div>
  )
}
