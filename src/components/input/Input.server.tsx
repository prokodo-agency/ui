import { InputView } from "./Input.view"

import type { InputProps } from "./Input.model"
import type { JSX } from "react"

export default function InputServer(p: InputProps): JSX.Element {
  return <InputView {...p} />
}
