import { SelectView } from "./Select.view";

import type { SelectProps } from "./Select.model";
import type { JSX } from "react"

export default function SelectServer(props: SelectProps): JSX.Element | null {
  return <SelectView {...props} />
}
