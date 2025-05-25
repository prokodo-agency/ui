"use client"
import {
  type FC,
  type KeyboardEvent,
  useRef,
  useState,
  useImperativeHandle,
} from "react"

import { Icon } from "@/components/icon"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Stepper.module.scss"

import type { StepperProps } from "./Stepper.model"

const bem = create(styles, "Stepper")

export const Stepper: FC<StepperProps> = ({
  ref,
  className,
  steps,
  initialStep,
  onChangeStep,
  translations,
  ...props
}) => {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeStep, setActiveStep] = useState<number>(initialStep ?? 1)

  useImperativeHandle(
    ref,
    () => ({
      jumpToStep: (index: number) => setActiveStep(index),
    }),
    [],
  )

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    stepIndex: number,
  ) => {
    if (event.key === "ArrowLeft") {
      // Navigate to the previous step and set focus
      if (stepIndex > 0) {
        setActiveStep(stepIndex - 1)
        stepRefs.current[stepIndex - 1]?.focus()
        onChangeStep?.(stepIndex - 1)
      }
    }
  }

  return (
    <ol
      {...props}
      aria-label={translations?.stepper ?? "Stepper Navigation"}
      className={bem(undefined, undefined, className)}
    >
      {steps.map((step, i) => {
        const { key, label, labelProps, ...rest } = step
        const active = i === activeStep
        const completed = activeStep > i
        return (
          <li
            key={label ?? `step-${key}`}
            aria-current={active ? "step" : undefined}
            aria-disabled={!completed && !active ? "true" : undefined}
            className={bem(
              "step",
              {
                "is-active": active || completed,
              },
              rest?.className,
            )}
            {...rest}
          >
            {isString(label) && (
              <div
                {...labelProps}
                aria-describedby={`step-${i}-description`}
                aria-labelledby={`step-${i}-label`}
                className={bem(
                  "label",
                  {
                    "is-active": Boolean(active),
                  },
                  labelProps?.className,
                )}
              >
                <div
                  ref={el => {
                    if (el) stepRefs.current[i] = el
                  }}
                  role="button"
                  tabIndex={active ? 0 : -1}
                  aria-label={`${translations?.step ?? "Step"} ${i + 1} ${label}. ${
                    completed
                      ? (translations?.status.completed ??
                        "Completed. Press Enter to jump back to this step.")
                      : (translations?.status.open ??
                        "Open. Future step and therefore deactivated.")
                  }`}
                  className={bem("icon__container", {
                    "is-active": active || completed,
                  })}
                  onKeyDown={event => handleKeyDown(event, i)}
                  onClick={() => {
                    if (activeStep !== i && activeStep > i) {
                      setActiveStep(i)
                      stepRefs.current[i]?.focus()
                      onChangeStep?.(i)
                    }
                  }}
                >
                  <span
                    className={bem("icon__label", {
                      "is-active": active || completed,
                    })}
                  >
                    {completed ? (
                      <div className={bem("icon__completed__container")}>
                        <Icon
                          className={bem("icon__completed")}
                          name="Tick01Icon"
                          size="md"
                        />
                      </div>
                    ) : (
                      i + 1
                    )}
                  </span>
                </div>
                <span
                  className={bem("label__text", {
                    "is-active": active || completed,
                  })}
                >
                  {label}
                </span>
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
