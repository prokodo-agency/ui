import { SwitchView } from "./Switch.view"

import type { SwitchProps } from "./Switch.model"
import type { JSX } from "react"

export default function SwitchServer(props: SwitchProps): JSX.Element {
  const { checked: controlledChecked } = props
  const isChecked =
    typeof controlledChecked === "boolean" ? controlledChecked : false
  return (
    <SwitchView
      {...props}
      checked={undefined}
      isChecked={isChecked}
      isFocused={false}
      onBlurInternal={() => undefined}
      onChangeInternal={() => undefined}
      onFocusInternal={() => undefined}
    />
  )
}
