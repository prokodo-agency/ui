import { DatePickerView } from "./DatePicker.view"

import type { DatePickerProps } from "./DatePicker.model"
import type { FC } from "react"

const DatePickerServer: FC<DatePickerProps> = props => (
  <DatePickerView {...props} readOnly onChange={undefined} />
)

export default DatePickerServer
