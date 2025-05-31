import { createLazyWrapper } from "@/helpers/createLazyWrapper"
import type { SliderProps } from "./Slider.model"
import SliderClient from "./Slider.client"
import SliderServer from "./Slider.server"

export default createLazyWrapper<SliderProps>({
  name: "Slider",
  Client: SliderClient,
  Server: SliderServer,
  isInteractive: () => true,
})
