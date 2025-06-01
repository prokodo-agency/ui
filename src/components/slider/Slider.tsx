import { createIsland } from "@/helpers/createIsland"

import SliderServer from "./Slider.server"

import type { SliderProps } from "./Slider.model"

export const Slider = createIsland<SliderProps>({
  name: "Slider",
  Server: SliderServer,
  loadLazy: () => import("./Slider.lazy"),
})
