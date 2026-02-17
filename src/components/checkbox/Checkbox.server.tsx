import { CheckboxView } from "./Checkbox.view"

import type { CheckboxProps } from "./Checkbox.model"
import type { JSX } from "react"

export default function CheckboxServer<T extends string = string>(
  props: CheckboxProps<T>,
): JSX.Element {
  const isChecked =
    typeof props.checked === "boolean"
      ? props.checked
      : (props.defaultChecked ?? false)

  return (
    <CheckboxView
      {...props}
      checked={undefined}
      defaultChecked={undefined}
      isChecked={isChecked}
    />
  )
}
