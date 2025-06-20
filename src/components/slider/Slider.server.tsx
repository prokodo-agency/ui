import { SliderView } from "./Slider.view"

import type { SliderProps } from "./Slider.model"
import type { JSX } from "react"

export default function SliderServer(props: SliderProps): JSX.Element {
  // On the server, we simply render the view with a “neutral” internalValue.
  // If props.value is provided, use it otherwise default to min (0).
  const { value, min = 0 } = props
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : min

  return (
    <SliderView
      {...props}
      internalValue={numeric}
      isFocused={false}
      onBlurInternal={() => undefined}
      onChangeInternal={() => undefined}
      // no-op handlers on server
      onFocusInternal={() => undefined}
    />
  )
}
