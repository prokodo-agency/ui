import { createIsland } from "@/helpers/createIsland"

import DatePickerServer from "./DatePicker.server"

import type { DatePickerProps } from "./DatePicker.model"

export const DatePicker = createIsland<DatePickerProps>({
  name: "DatePicker",
  Server: DatePickerServer,
  loadLazy: /* istanbul ignore next */ () => import("./DatePicker.lazy"),
})

DatePicker.displayName = "DatePicker"
