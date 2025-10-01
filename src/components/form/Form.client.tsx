"use client"
import {
  useState,
  useEffect,
  useRef,
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

// Keep the discriminated union intact when updating a single field.
// We merge a *partial* patch into the *existing* field variant, and return
// the same specific variant `T` so TS stays happy.
function mergeField<T extends FormField>(
  prev: T,
  patch: Partial<FormField>
): T {
  return { ...prev, ...(patch as Partial<T>) } as T
}

// Defer external notifications (e.g., zustand/context) until after commit
// to avoid: "Cannot update a component (X) while rendering a different component (FormClient)"
const useDeferredNotifier = (cb?: (f: FormField) => void) => {
  const ref = useRef<FormField | null>(null)
  // flush after state commit
  useEffect(() => {
    if (ref.current && cb) {
      const f = ref.current
      ref.current = null
      cb(f)
    }
  })
  return (f: FormField) => { ref.current = f }
}

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
  const [formState, setFormState] = useState<FormField[]>(
    () => fields ?? []
  )

  // 2) Local form messages
  const [formMessages, setFormMessages] = useState<FormMessages | undefined>(
    initialMessages
  )

  // 3) Honeypot field
  const [honeypotValue, setHoneypotValue] = useState("")

  // notifier for onChangeForm that runs *after* render commit
  const notifyChange = useDeferredNotifier(onChangeForm)

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
        const next = [...prev]
        const nextField = { ...(next[index] as FormField), ...(update as object) } as FormField
        next[index] = nextField
        // Defer external notification until after commit
        notifyChange(nextField)
        return next
      })
    },
    [notifyChange]
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
          updatedErrors[field.name ?? field.label ?? ""] = [err as string]
        } else {
          delete updatedErrors[field.name ?? field.label ?? ""]
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
      setFormState((prev) => {
        const next = [...prev]
        const srcIdx = next.findIndex((f) => f.name === field.name)
        if (srcIdx < 0) return prev

        // If this is a dynamic-list, just update the array directly
        if (field.fieldType === "dynamic-list") {
          const prevSelf = next[srcIdx] as FormField
          const updated = mergeField(prevSelf, { value })
          next[srcIdx] = updated
          // bubble up the changed field AFTER commit
          notifyChange(updated)
          return next
        }

        // Helper: strict comparator that *does not match* for empty values
        const matches = (equalTo: unknown, v: unknown) => {
          // treat empty as "no match" so dependents reset/hide
          const emptyScalar = v === undefined || v === ""
          const emptyArray = Array.isArray(v) && v.length === 0
          if (emptyScalar || emptyArray) return false

          if (typeof equalTo === "boolean") return equalTo === v
          if (typeof equalTo === "string" || typeof equalTo === "number") {
            return equalTo === v
          }
          if (Array.isArray(equalTo)) {
            if (typeof v === "string" || typeof v === "number") {
              return (equalTo as Array<string | number>).includes(v as string | number)
            }
            if (Array.isArray(v)) {
              const vv = v as Array<string | number>
              const ee = equalTo as Array<string | number>
              return vv.some((item) => ee.includes(item))
            }
          }
          return false
        }

        // Build quick lookup for defaults by field name
        const defaultsByName = new Map<string, FormField>()
        for (const df of (defaultFields ?? [])) {
          if (isString(df?.name)) defaultsByName.set(df.name as string, df as FormField)
        }

        // Gather *targets* from the source field's own conditions
        const conds = Array.isArray(field.conditions) ? field.conditions : []
        const targetNames = Array.from(new Set(conds.map(c => c.fieldId).filter(Boolean)))

        // 1) Reset each dependent target to its default baseline
        for (const targetName of targetNames) {
          const depIdx = next.findIndex((f) => f.name === targetName)
          if (depIdx < 0) continue
          const prevDep = next[depIdx] as FormField
          const def = defaultsByName.get(targetName)
          // If no explicit default exists, assume default visible=false
          const dfPatch: Partial<FormField> = def
            ? { ...(def as FormField) }
            : { visible: false }
          // do not clobber current value/error with defaults
          delete dfPatch.value
          delete dfPatch.errorText

          let merged = mergeField(prevDep, dfPatch)
          // If (implicit or explicit) default is hidden, clear value & error
          const defaultVisible =
            (def && typeof def.visible === "boolean") ? def.visible : false
          if (defaultVisible === false) {
            merged = mergeField(merged, {
              value: undefined,
              errorText: undefined,
            })
          }
          next[depIdx] = merged
        }

        // 2) Apply matching conditions from the changed field onto its targets
        const appliedTargets = new Set<string>()
        for (const c of conds) {
          const targetIdx = next.findIndex((f) => f.name === c.fieldId)
          if (targetIdx < 0) continue
          const shouldApply =
            typeof c.equalTo === "undefined" ? true : matches(c.equalTo, value)
          if (shouldApply) {
            const prevTarget = next[targetIdx] as FormField
            const patch = (c.updateProps ?? {}) as Partial<FormField>
            next[targetIdx] = mergeField(prevTarget, patch)
            appliedTargets.add(prevTarget.name ?? "")
          }
        }

        // 2b) Fallback for targets with NO matching condition:
        // Hide them (or use their explicit default visible when available)
        for (const targetName of targetNames) {
          if (appliedTargets.has(targetName)) continue
          const targetIdx = next.findIndex((f) => f.name === targetName)
          if (targetIdx < 0) continue
          const prevTarget = next[targetIdx] as FormField
          const def = defaultsByName.get(targetName)
          const defaultVisible =
            (def && typeof def.visible === "boolean") ? def.visible : false
          let merged = mergeField(prevTarget, { visible: defaultVisible })
          if (defaultVisible === false) {
            merged = mergeField(merged, {
              value: undefined,
              errorText: undefined,
            })
          }
          next[targetIdx] = merged
        }

        // 3) Finally, update this field’s own value last
        const prevSelf2 = next[srcIdx] as FormField
        const updatedSelf = mergeField(prevSelf2, { value })
        next[srcIdx] = updatedSelf

        // bubble up the changed field only AFTER commit
        notifyChange(updatedSelf)
        return next
      })
    },
    [defaultFields, notifyChange]
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
      const visible = field.visible !== false
      const emptyArray = Array.isArray(field.value) && field.value.length === 0
      const emptyScalar = field.value === undefined || field.value === ""
      if (Boolean(field.required) && visible && (emptyScalar || emptyArray)) {
        const errMsg =
          messagesFields?.errors?.input?.["required"] ??
          "This field is required"
        const key = field.name ?? field.label ?? ""
        if (!errors[key]) {
          errors[key] = []
        }
        errors[key]?.push(errMsg)
      }
      if (isString(field.errorText)) {
        const key = field.name ?? field.label ?? ""
        if (!errors[key]) {
          errors[key] = []
        }
        errors[key]?.push(field.errorText as string)
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
        if (!Boolean(f.required) || f.visible === false) return true
        if (Array.isArray(f.value)) return f.value.length > 0
        return f.value !== undefined && f.value !== ""
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
      isHoneypotEmpty={honeypotValue.length === 0}
      fieldProps={{
        onChange: handleFieldChange,
        onValidate: handleFieldValidate,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }as any}
      honeypot={{
        defaultValue: "",
        onChange: handleHpChange,
        autoComplete: "off",
      }}
      onFormSubmit={handleFormSubmit}
    />
  )
})

FormClient.displayName = "FormClient"
