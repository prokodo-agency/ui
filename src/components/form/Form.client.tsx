"use client"
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  type ChangeEvent,
  type FormEvent,
} from "react"

import { isString } from "@/helpers/validations"

import { FormView } from "./Form.view"

import type {
  FormField,
  FormMessages,
  FormProps,
  FormFieldValue,
} from "./Form.model"

type PartialFormField = { [K in keyof FormField]?: FormField[K] };

export const FormClient = memo((props: FormProps) => {
  const {
    disabled,
    fields,
    defaultFields,
    messages: initialMessages,
    onSubmit,
    onChangeForm,
    messagesFields,
    hideResponse,
    ...restProps
  } = props

  // 1) Local form state
  const [formState, setFormState] = useState<FormField[]>(fields ?? [])

  // 2) Local form messages
  const [formMessages, setFormMessages] = useState<FormMessages | undefined>(
    initialMessages
  )

  // 3) Honeypot field
  const [honeypotValue, setHoneypotValue] = useState("")

  // 4) Sync messages when prop changes
  useEffect(() => {
    if (initialMessages !== undefined) {
      setFormMessages(initialMessages)
    }
  }, [initialMessages])

  // 5) Helper to update a single field in state
  const updateSingleField = useCallback(
    (index: number, update: PartialFormField) => {
      setFormState((prev) => {
        const clone = [...prev]
        clone[index] = { ...clone[index] as FormField, ...(update as object) }
        return clone
      })
      if (onChangeForm) {
        onChangeForm({ ...(formState[index] as FormField), ...(update as object) } as FormField)
      }
    },
    [formState, onChangeForm]
  )

  // 6) Validate a single field (called by FormField)
  const handleFieldValidate = useCallback(
    (field: FormField, err?: string) => {
      if (field.errorText === err) {
        return
      }
      const idx = formState.findIndex((f) => f?.name === field?.name)
      if (idx < 0) return
      updateSingleField(idx, { errorText: err })

      // Rebuild formMessages.errors
      setFormMessages((prev) => {
        const updatedErrors: Record<string, string[]> = {
          ...(prev?.errors ?? {}),
        }
        if (isString(err)) {
          updatedErrors[field.label ?? ""] = [err as string]
        } else {
          delete updatedErrors[field.label ?? ""]
        }
        return {
          errors:
            Object.keys(updatedErrors).length > 0
              ? updatedErrors
              : undefined,
        }
      })
    },
    [formState, updateSingleField]
  )

  // 7) Handle a change in a single field (include conditional logic)
  const handleFieldChange = useCallback(
    (field: FormField, value?: FormFieldValue) => {
      const idx = formState.findIndex((f) => f.name === field.name)
      if (idx < 0) return

      // If this is a dynamic-list, just update the array directly
      if (field.fieldType === "dynamic-list") {
        updateSingleField(idx, { value })
        return
      }

      // If there are no conditions, update value directly
      if (!field.conditions || field.conditions.length === 0) {
        updateSingleField(idx, { value })
        return
      }

      // First reset any dependent fields to default
      defaultFields?.forEach((defField, i) => {
        if (
          Boolean(defField.conditions?.some((c) => c.fieldId === field.name))
        ) {
          updateSingleField(i, defaultFields[i] as FormField)
        }
      })

      // Then apply matching conditions
      const matched = (field.conditions ?? []).filter((c) => {
        if (value === undefined || c.equalTo === undefined) return true
        if (typeof c.equalTo === "boolean" && c.equalTo === value) {
          return true
        }
        if (typeof c.equalTo === "string") {
          return c.equalTo === value
        }
        if (Array.isArray(c.equalTo) && typeof value === "string") {
          return c.equalTo.includes(value)
        }
        return false
      })
      matched.forEach((c) => {
        const idx2 = formState.findIndex((f) => f.name === c.fieldId)
        if (idx2 >= 0) {
          updateSingleField(idx2, c.updateProps)
        }
      })

      // Finally, update this field’s own value
      updateSingleField(idx, { value })
    },
    [defaultFields, formState, updateSingleField]
  )

  // 8) Honeypot change
  const handleHpChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setHoneypotValue(e.target.value)
    },
    []
  )

  // 9) Validate the entire form before submit
  const validateFullForm = useCallback(() => {
    const errors: Record<string, string[]> = {}

    formState.forEach((field) => {
      if (
        Boolean(field.required) &&
        (field.value === undefined ||
          field.value === "" ||
          (Array.isArray(field.value) && field.value.length === 0)) &&
        field.visible !== false
      ) {
        const errMsg =
          messagesFields?.errors?.input?.["required"] ??
          "This field is required"
        if (!errors[field.label ?? ""]) {
          errors[field.label ?? ""] = []
        }
        errors[field.label ?? ""]?.push(errMsg)
      }
      if (isString(field.errorText)) {
        if (!errors[field.label ?? ""]) {
          errors[field.label ?? ""] = []
        }
        errors[field.label ?? ""]?.push(field.errorText as string)
      }
    })

    return {
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    }
  }, [formState, messagesFields])

  // 10) Handle form submit
  const handleFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const { errors } = validateFullForm()
      setFormMessages({ errors })
      if (!errors) {
        onSubmit?.(formState)
      }
    },
    [formState, onSubmit, validateFullForm]
  )

  // 11) Determine if “Submit” should be disabled (only if hideResponse is true)
  const isFormValid = useMemo(() => {
    if (Boolean(hideResponse)) {
      return formState.every((f) => {
        if (Boolean(f.required) && f.value === undefined && Boolean(f.visible) !== false) {
          return false
        }
        return true
      })
    }
    return true
  }, [formState, hideResponse])

  return (
    <FormView
      {...restProps}
      disabled={disabled}
      formMessages={formMessages}
      formState={formState}
      isFormValid={isFormValid}
      fieldProps={{
        onChange: handleFieldChange,
        onValidate: handleFieldValidate,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }as any}
      honeypot={{
        value: honeypotValue,
        onChange: handleHpChange,
      }}
      onFormSubmit={handleFormSubmit}
    />
  )
})

FormClient.displayName = "FormClient"
