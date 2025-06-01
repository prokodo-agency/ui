import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import SliderClient from "./Slider.client"
import SliderServer from "./Slider.server"

import type { SliderProps } from "./Slider.model"

export default createLazyWrapper<SliderProps>({
  name: "Slider",
  Client: SliderClient,
  Server: SliderServer,
})
