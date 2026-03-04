import dayjs from "dayjs"

import { DatePickerView } from "./DatePicker.view"

import type { DatePickerProps } from "./DatePicker.model"
import type { FC } from "react"

/* istanbul ignore next */
const noop = () => undefined

const DatePickerServer: FC<DatePickerProps> = ({
  onChange: _onChange,
  value,
  ...props
}) => {
  const selectedDate = value ? dayjs(value) : null
  return (
    <DatePickerView
      {...props}
      readOnly
      isOpen={false}
      selectedDate={selectedDate}
      viewingMonth={selectedDate ?? dayjs()}
      viewMode="days"
      onApply={noop}
      onClear={noop}
      onDayClick={noop}
      onMonthSelect={noop}
      onNextMonth={noop}
      onPrevMonth={noop}
      onTimeChange={noop}
      onToday={noop}
      onToggle={noop}
      onViewModeChange={noop}
      onYearSelect={noop}
    />
  )
}

export default DatePickerServer
