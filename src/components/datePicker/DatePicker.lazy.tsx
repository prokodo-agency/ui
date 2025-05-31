import { createLazyWrapper } from "@/helpers/createLazyWrapper"
import DatePickerClient from "./DatePicker.client"
import DatePickerServer from "./DatePicker.server"
import type { DatePickerProps } from "./DatePicker.model"

export default createLazyWrapper<DatePickerProps>({
  name: "DatePicker",
  Client: DatePickerClient,
  Server: DatePickerServer,
  isInteractive: () => true,
})
