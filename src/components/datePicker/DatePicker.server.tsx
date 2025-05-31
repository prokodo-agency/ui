import type { FC } from "react"
import { DatePickerView } from "./DatePicker.view"
import type { DatePickerProps } from "./DatePicker.model"

const DatePickerServer: FC<DatePickerProps> = (props) => {
  return <DatePickerView {...props} onChange={undefined} />
}

export default DatePickerServer
