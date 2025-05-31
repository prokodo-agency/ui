import { InputView } from "./Input.view"
import type { InputProps } from "./Input.model"

export default function InputServer(p: InputProps) {
  return <InputView {...p} />
}
