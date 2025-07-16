import { create } from "@/helpers/bem"
import { isArray, isNull } from "@/helpers/validations"

import { Button } from "../button"
import { Grid } from "../grid"
import { Headline } from "../headline"

import styles from "./Form.module.scss"
import { FormField } from "./FormField"
import { FormResponse } from "./FormResponse"

import type { FormViewProps } from "./Form.model"
import type { FC } from "react"

const bem = create(styles, "Form")

export const FormView: FC<FormViewProps> = ({
  id,
  variant = "primary",
  disabled,
  action,
  label,
  hideHeadline,
  headlineProps,
  className,
  formState,
  formMessages,
  hideResponse,
  button,
  children,
  honeypot,
  onFormSubmit,
  isFormValid,
  fieldProps,
  messagesFields,
  ...props
}) => (
    <form
      {...props}
      noValidate
      action={action}
      aria-labelledby={`${id}-heading`}
      className={bem(undefined, undefined, className)}
      id={id}
      onSubmit={typeof action === "function" || typeof action === "string" ? undefined : onFormSubmit}
    >
      {/* Invisible heading for screen readers */}
      <Headline
        type="h2"
        {...headlineProps}
        id={`${id}-heading`}
        className={bem("label", {
          "is-hidden": Boolean(hideHeadline)
        }, headlineProps?.className)}
      >
        {label}
      </Headline>

      {/* Render each field in a GridRow */}
      <Grid className={bem("grid")} spacing={2}>
        {isArray(formState) &&
          formState.map((field) => (
            <FormField
              {...field}
              key={field.name}
              messagesFields={messagesFields}
              variant={variant}
              disabled={
                disabled !== undefined ? disabled : field?.disabled
              }
              {...fieldProps}
            />
          ))}

        {/* Any custom children */}
        {children}

        {/* Honeypot field (hidden from SR) */}
        <input
          aria-hidden="true"
          className={bem("hp")}
          id="hp"
          name="hp"
          type="text"
          {...honeypot}
        />
      </Grid>

      <div className={bem("footer")}>
        {/* Response messages (only if not hidden) */}
        {(hideResponse === false || hideResponse === undefined) && (
          <FormResponse messages={formMessages} />
        )}

        {/* Submit button (only if honeypot is empty) */}
        {!isNull(button) && (honeypot?.value as string)?.length === 0 && (
          <Button
            aria-label="Submit form"
            title="Submit"
            type="submit"
            {...button}
            className={bem("footer__submit", undefined, button?.className)}
            color={button?.color ?? variant}
            disabled={Boolean(formMessages?.errors) || !isFormValid}
          />
        )}
      </div>
    </form>
  )
