import { AutocompleteView } from "./Autocomplete.view"

import type { AutocompleteProps } from "./Autocomplete.model"
import type { JSX } from "react"

export default function AutocompleteServer(
  props: AutocompleteProps,
): JSX.Element {
  return <AutocompleteView {...props} readOnly />
}
