import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import AutocompleteClient from "./Autocomplete.client"
import AutocompleteServer from "./Autocomplete.server"

import type { AutocompleteProps } from "./Autocomplete.model"

export default createLazyWrapper<AutocompleteProps>({
  name: "Autocomplete",
  Client: AutocompleteClient,
  Server: AutocompleteServer,
})
