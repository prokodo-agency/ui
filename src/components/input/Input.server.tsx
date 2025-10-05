import { InputView } from "./Input.view"

import type { InputProps } from "./Input.model"
import type { JSX } from "react"

export default function InputServer(p: InputProps): JSX.Element {
  // const { value, ...rest } = p
  return <InputView {...p} readOnly />
}
