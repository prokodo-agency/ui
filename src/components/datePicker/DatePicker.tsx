import { createIsland } from "@/helpers/createIsland"

import DatePickerServer from "./DatePicker.server"

import type { DatePickerProps } from "./DatePicker.model"

export const DatePicker = createIsland<DatePickerProps>({
  name: "DatePicker",
  Server: DatePickerServer,
  loadLazy: () => import("./DatePicker.lazy"),
})

DatePicker.displayName = "DatePicker"
