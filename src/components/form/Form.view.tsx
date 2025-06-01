import { create } from "@/helpers/bem"
import { isArray } from "@/helpers/validations"

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
  action,
  label,
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
        className={bem("label")}
        id={`${id}-heading`}
        type="h2"
      >
        {label}
      </Headline>

      {/* Render each field in a GridRow */}
      <Grid spacing={2}>
        {isArray(formState) &&
          formState.map((field) => (
            <FormField
              {...field}
              key={field.name}
              messagesFields={messagesFields}
              variant={variant}
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
        {(honeypot?.value as string)?.length === 0 && (
          <Button
            aria-label="Submit form"
            className={bem("footer__submit")}
            color={variant}
            title="Submit"
            type="submit"
            {...button}
            disabled={Boolean(formMessages?.errors) || !isFormValid}
          />
        )}
      </div>
    </form>
  )
