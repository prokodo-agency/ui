import { Icon } from "@/components/icon"
import { Input } from "@/components/input"
import { create } from "@/helpers/bem"

import styles from "./RTE.module.scss"

import type { RTEProps } from "./RTE.model"
import type { Ref, JSX, MouseEvent } from "react"

const bem = create(styles, "RTE")

type RTEViewProps = RTEProps & {
  htmlValue?: string
  surfaceRef?: Ref<HTMLDivElement>
  mountRef?: Ref<HTMLDivElement>
  showResize?: boolean
  onStartResize?: (e: MouseEvent<HTMLButtonElement>) => void
}

export function RTEView({
  name,
  value,
  disabled,
  readOnly,
  required,
  placeholder,
  maxLength,
  errorText,
  htmlValue,
  surfaceRef,
  mountRef,
  showResize = false,
  onStartResize,
  onChange,
  onValidate,
  errorTranslations,
  rteToolbar,
  rteOptions,
  ...rest
}: RTEViewProps): JSX.Element {
  void onChange
  void onValidate
  void errorTranslations
  void rteToolbar
  void rteOptions

  const mirrorValue = String(htmlValue ?? value ?? "")
  return (
    <Input
      {...rest}
      multiline
      disabled={disabled}
      errorText={errorText}
      maxLength={maxLength}
      name={name}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      value={mirrorValue}
      renderNode={({ id, describedBy, isError, nodeClassName }) => (
        <div
          className={bem(undefined, {
            disabled: Boolean(disabled),
            readonly: Boolean(readOnly),
          })}
        >
          <div
            ref={surfaceRef}
            className={bem(
              "surface",
              { error: Boolean(isError) },
              nodeClassName,
            )}
          >
            <div
              ref={mountRef}
              aria-describedby={describedBy}
              aria-invalid={isError}
              aria-required={Boolean(required)}
              className={bem("mount", { disabled: Boolean(disabled) })}
              id={id}
            />

            {showResize && !Boolean(disabled) && !Boolean(readOnly) && (
              <button
                aria-label="Resize editor height"
                className={bem("resize")}
                type="button"
                onMouseDown={onStartResize}
              >
                <Icon name="ResizeFieldIcon" size="sm" />
              </button>
            )}
          </div>

          <textarea
            readOnly
            aria-hidden="true"
            className={bem("hidden")}
            name={name}
            tabIndex={-1}
            value={mirrorValue}
          />
        </div>
      )}
      onChange={undefined}
    />
  )
}
