"use client"
import {
  type FC,
  type ReactNode,
  type ChangeEvent,
  type FormEvent,
  Fragment,
  memo,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react"

import { create } from "@/helpers/bem"
import { isArray, isString } from "@/helpers/validations"

import { Button } from "../button"
import { Grid } from "../grid"
import { Headline } from "../headline"

import styles from "./Form.module.scss"
import { FormField } from "./FormField"
import { FormResponse } from "./FormResponse"

import type {
  FormProps,
  FormMessages,
  FormMessagesErrors,
  FormFieldValue,
  FormField as FormFieldModel,
  FormFieldCondition,
} from "./Form.model"

const bem = create(styles, "Form")

export const Form: FC<FormProps> = memo(
  ({
    variant = "primary",
    action,
    label,
    className,
    fields,
    disableFields,
    hideResponse,
    defaultFields,
    messages,
    messagesFields,
    button,
    children,
    onSubmit,
    onChangeForm,
    ...props
  }) => {
    // State for honeypot field (used to detect bots)
    const [form, setForm] = useState<FormFieldModel[]>(fields ?? [])
    const [formMessages, setFormMessages] = useState<FormMessages | undefined>(
      messages,
    )
    const [hp, setHp] = useState("")

    useEffect(() => {
      if (messages !== undefined) {
        setFormMessages(messages)
      }
    }, [messages])

    // Update helper for fields in state
    const updateFormState = useCallback(
      (index: number, props: Partial<FormFieldModel>) => {
        setForm((prevData: FormFieldModel[]) => {
          const newArray = [...prevData]
          newArray[index] = {
            ...newArray[index],
            ...props,
          } as FormFieldModel
          return newArray
        })
        if (onChangeForm) {
          onChangeForm({
            ...form[index],
            ...props,
          } as FormFieldModel)
        }
      },
      [form, onChangeForm],
    )

    const filterConditions = useCallback(
      (
        conditions: FormFieldCondition[],
        value?: string | string[] | boolean,
      ): FormFieldCondition[] =>
        conditions.filter(e => {
          if (
            value === undefined ||
            e.equalTo === undefined ||
            (typeof e.equalTo === "boolean" && e.equalTo === value)
          )
            return true
          // Handle the case where `equalTo` is a string or boolean
          if (typeof e.equalTo === "string") {
            return e.equalTo === value // Keep element if `equalTo` matches `Value`
          }
          // Handle the case where `equalTo` is an array of strings or booleans
          if (Array.isArray(e.equalTo) && typeof value === "string") {
            return e.equalTo.includes(value) // Keep element if `Value` is included in `equalTo` array
          }
          // If none of the conditions match, exclude the element
          return false
        }),
      [],
    )

    // Hold only conditions which match the equalTo attribute
    const handleFilterConditions = useCallback(
      (
        conditions: FormFieldCondition[],
        value?: string | string[] | boolean,
      ): FormFieldCondition[] => {
        if (value !== undefined && isArray(value as string[])) {
          return (value as string[]).flatMap(val =>
            filterConditions(conditions, val),
          )
        }
        return filterConditions(conditions, value)
      },
      [filterConditions],
    )

    // Get field index of form
    const getFieldIndex = useCallback(
      (field: FormFieldModel): number =>
        form.findIndex(e => e?.name === field?.name),
      [form],
    )

    // Reset the conditions of field to default
    const resetFieldConditions = useCallback(
      (changedField: FormFieldModel): void => {
        const fieldIndex = form.findIndex(
          field => field?.name === changedField?.name,
        )
        const defaultField = defaultFields?.[fieldIndex]
        if (defaultField === undefined) return
        defaultFields?.[fieldIndex]?.conditions?.forEach(con => {
          const index = defaultFields.findIndex(
            field => field?.name === con?.fieldId,
          )
          if (defaultFields[index] === undefined) return
          updateFormState(index, defaultFields[index])
        })
        return
      },
      [defaultFields, form, updateFormState],
    )

    // Handle change form field
    const handleChangeField = useCallback(
      (field: FormFieldModel, value: FormFieldValue): void => {
        const conditions = field?.conditions
        if (!conditions || conditions?.length <= 0) {
          const index = getFieldIndex(field)
          updateFormState(index, { value })
          return
        }
        // Reset conditional fields first
        resetFieldConditions(field)
        // Loop over conditions
        handleFilterConditions(conditions, value).forEach(con => {
          const conditionalFieldIndex = form.findIndex(
            field => field?.name === con?.fieldId,
          )
          updateFormState(conditionalFieldIndex, con.updateProps)
        })
        const index = getFieldIndex(field)
        updateFormState(index, { value })
      },
      [
        form,
        getFieldIndex,
        resetFieldConditions,
        handleFilterConditions,
        updateFormState,
      ],
    )

    // Handle validation of fields
    const handleValidationField = useCallback(
      (field: FormFieldModel, errorText?: string): void => {
        const fieldIndex = form.findIndex(e => e?.name === field?.name)
        updateFormState(fieldIndex, {
          errorText,
        })
        const label = field?.label ?? ""
        setFormMessages(prevState => {
          const updatedErrors = { ...prevState?.errors } // Clone the current errors object
          const newErrors: string[] = errorText !== undefined ? [errorText] : []
          if (newErrors.length > 0) {
            // If there are errors for this field, update or add them
            updatedErrors[label] = newErrors
          } else {
            // If there are no errors, remove the field from the errors object
            delete updatedErrors[label]
          }
          // Return the updated formMessages object
          return {
            ...prevState,
            errors:
              Object.keys(updatedErrors).length > 0 ? updatedErrors : undefined, // Only keep errors if there are any
          }
        })
      },
      [form, updateFormState],
    )

    // Memoized callback for form field rendering
    const renderField = useCallback(
      (field: FormFieldModel): ReactNode => (
        <FormField
          {...field}
          aria-labelledby={`${field?.label}-label`}
          aria-required={Boolean(field?.required) ? "true" : undefined} // Indicate required fields
          messagesFields={messagesFields}
          variant={variant}
          // disabled={
          //   disableFields !== undefined ? disableFields : field?.disabled
          // }
          onChange={handleChangeField}
          onValidate={handleValidationField}
        />
      ),
      [
        variant,
        disableFields,
        messagesFields,
        handleChangeField,
        handleValidationField,
      ],
    )

    // Handle form validation
    const handleValidationForm = useCallback((): FormMessages => {
      const errors: FormMessagesErrors = {}

      for (const field of form) {
        const { required, visible, value, label, fieldType } = field

        // Ensure the field has a name before proceeding
        if (label === undefined) {
          continue // Skip fields without a valid name
        }

        // Initialize an empty array for each field if it doesn't already exist
        if (!errors[label]) {
          errors[label] = []
        }

        // Check if the field has an errorText (and it's not slider/switch type)
        const hasErrorText =
          fieldType !== "slider" &&
          fieldType !== "switch" &&
          isString(field?.errorText)
        if (hasErrorText) {
          errors[label].push(field?.errorText!) // Push the errorText into the array
          continue
        }

        // Check if the field is required but has no value
        if (
          Boolean(required) &&
          (value === undefined || value === "") &&
          visible !== false
        ) {
          errors[label].push(
            messagesFields?.errors?.required ??
              "This field is required. Please fill it out.",
          )
        }
      }

      // Remove fields with no errors
      const cleanedErrors = Object.keys(errors).reduce((acc, key) => {
        if (errors[key] && errors[key].length > 0) {
          acc[key] = errors[key]
        }
        return acc
      }, {} as FormMessagesErrors)

      return {
        errors:
          Object.keys(cleanedErrors).length > 0 ? cleanedErrors : undefined,
      }
    }, [form, messagesFields])

    // Handle form submit
    const handleSubmitForm = useCallback(
      (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        const { errors } = handleValidationForm()
        setFormMessages({
          errors: errors !== undefined ? errors : undefined,
        })
        if (errors === undefined) {
          onSubmit?.(form)
        }
      },
      [form, handleValidationForm, onSubmit],
    )

    // Memoized function to handle honeypot field changes
    const handleHpChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => setHp(e?.target?.value),
      [],
    )

    // Validate if button is active (if hideResponse is true)
    const isFormValid = useMemo(
      () =>
        Boolean(hideResponse)
          ? form.every(field => {
              const { value } = field
              if (
                Boolean(field?.required) &&
                (value === undefined ||
                  value === "" ||
                  (Array.isArray(value) && value?.length <= 0)) &&
                field?.visible !== false
              ) {
                return false
              }
              return true
            })
          : true,
      [form, hideResponse],
    )
    return (
      <form
        {...props}
        noValidate
        action={action}
        aria-labelledby="form-heading"
        className={bem(undefined, undefined, className)}
        onSubmit={action === undefined ? handleSubmitForm : undefined}
      >
        {/* Hidden heading for screen readers */}
        <Headline className={bem("label")} id="form-heading" type="h2">
          {label}
        </Headline>

        {/* Render form fields in a Grid layout */}
        <Grid spacing={2}>
          {isArray(form) &&
            form.map(field => (
              <Fragment key={`form-input-${field.name}`}>
                {/* Render the label for the field */}
                {renderField(field)}
              </Fragment>
            ))}

          {/* Render custom component form fields */}
          {children}

          {/* Render honeypot field (hidden from screen readers) */}
          {renderField({
            fieldType: "input",
            label: "Do not fill this field",
            labelProps: {
              "aria-hidden": "true",
            },
            name: "hp",
            id: "hp",
            "aria-hidden": "true", // Hide honeypot field from assistive technology
            className: bem("hp"),
            value: hp,
            onChange: handleHpChange,
          })}
        </Grid>
        <div className={bem("footer")}>
          {/* Render response */}
          {(hideResponse === false || hideResponse === undefined) && (
            <FormResponse messages={formMessages} />
          )}
          {/* Only render submit button if honeypot is empty */}
          {hp?.length <= 0 && (
            <Button
              aria-label="Submit form"
              className={bem("footer__submit")}
              color={variant}
              type="submit"
              {...button}
              disabled={formMessages?.errors !== undefined || !isFormValid}
            />
          )}
        </div>
      </form>
    )
  },
)

Form.displayName = "Form"
