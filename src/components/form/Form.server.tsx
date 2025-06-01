import { FormView } from "./Form.view"

import type {
  FormProps,
  FormField,
  FormMessages,
} from "./Form.model"
import type { FC } from "react"

const FormServer: FC<FormProps> = (props) => {
  const {
    fields,
    messages,
    ...rest
  } = props

  // Use the initial “fields” array as the formState
  // and messages as initial messages.
  const emptyState: FormField[] = fields ?? []
  const initialMessages: FormMessages | undefined = messages

  // Always treat as “valid” on server
  const alwaysValid = true

  return (
    <FormView
      {...rest}
      formMessages={initialMessages}
      formState={emptyState}
      isFormValid={alwaysValid}
      honeypot={{
        value: "",
      }}
      onFormSubmit={() => undefined}
    />
  )
}

export default FormServer
