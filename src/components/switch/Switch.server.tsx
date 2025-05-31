import { SwitchView } from "./Switch.view"
import type { SwitchProps } from "./Switch.model"

export default function SwitchServer(props: SwitchProps) {
  const {
    checked: controlledChecked,
  } = props
  const isChecked =
    typeof controlledChecked === "boolean" ? controlledChecked : false
  return (
    <SwitchView
      {...props}
      checked={undefined}
      isChecked={isChecked}
      isFocused={false}
      onChangeInternal={() => {}}
      onFocusInternal={() => {}}
      onBlurInternal={() => {}}
    />
  )
}
