import { create } from "@/helpers/bem"

import { Icon } from "../icon"

import styles from "./Stepper.module.scss"

import type { StepperViewProps } from "./Stepper.model"
import type { FC } from "react"

const bem = create(styles, "Stepper")

export const StepperView: FC<StepperViewProps> = ({
  steps,
  activeStep,
  translations,
  className,
  ...rootProps
}) => {
  const t = translations ?? {
    stepper: "Stepper Navigation",
    step: "Step",
    status: {
      open: "Open. Future step and therefore disabled.",
      completed:
        "Completed. Press Enter to jump back to this step.",
    },
  }

  return (
    <ol
      {...rootProps}
      aria-label={t.stepper}
      className={bem(undefined, undefined, className)}
    >
      {steps.map((step, i) => {
        const {
          key,
          label,
          labelProps = {},
          className: liClass,
          ...liRest
        } = step

        const isActive = i === activeStep
        const isCompleted = activeStep > i

        /** aria‐current="step" on the active step */
        /** aria‐disabled="true" on future steps */
        return (
          <li
            key={key ?? `step-${i}`}
            aria-current={isActive ? "step" : undefined}
            aria-disabled={!isCompleted && !isActive ? "true" : undefined}
            className={bem(
              "step",
              { "is-active": isActive || isCompleted },
              liClass
            )}
            {...liRest}
          >
            {typeof label === "string" && (
              <div
                {...labelProps}
                aria-describedby={`step-${i}-description`}
                aria-labelledby={`step-${i}-label`}
                className={bem(
                  "label",
                  { "is-active": isActive },
                  labelProps.className
                )}
              >
                <div
                  id={`step-${i}-label`}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`${t.step} ${i + 1} ${label}. ${
                    isCompleted ? t.status.completed : t.status.open
                  }`}
                  className={bem("icon__container", {
                    "is-active": isActive || isCompleted,
                  })}
                  {...step?.innerContainerProps}
                >
                  <span
                    className={bem("icon__label", {
                      "is-active": isActive || isCompleted,
                    })}
                  >
                    {isCompleted ? (
                      <div className={bem("icon__completed__container")}>
                        <span
                          className={bem("icon__sr__only")}
                          id={`step-${i}-description`}
                        >
                          {t.status.completed}
                        </span>
                        <Icon
                          className={bem("icon__completed")}
                          name="Tick01Icon"
                          size="md"
                        />
                      </div>
                    ) : (
                      <>
                        <span
                          className={bem("icon__sr__only")}
                          id={`step-${i}-description`}
                        >
                          {t.status.open}
                        </span>
                        {i + 1}
                      </>
                    )}
                  </span>
                </div>
                <span
                  className={bem("label__text", {
                    "is-active": isActive || isCompleted,
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
