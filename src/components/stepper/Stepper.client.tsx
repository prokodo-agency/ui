"use client"
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  type MouseEvent,
  type KeyboardEvent,
  type FocusEvent,
  type Ref,
  memo,
  useMemo,
} from "react"

import { StepperView } from "./Stepper.view"

import type { Step, StepperProps, StepperRef } from "./Stepper.model"

const StepperClient = forwardRef<StepperRef, StepperProps>((props, ref) => {
  const {
    steps,
    initialStep = 0,
    onChange,
    onFocus,
    onBlur,
    translations,
    className,
    ...rootProps
  } = props

  // 1) Internal activeStep state
  const [activeStep, setActiveStep] = useState<number>(initialStep)

  // 2) Refs array to focus individual step buttons
  const stepRefs = useRef<Array<HTMLDivElement | null>>([])

  // 3) Expose jumpToStep on the ref
  useImperativeHandle<StepperRef, StepperRef>(
    ref as Ref<StepperRef>,
    () => ({
      jumpToStep: (index: number) => {
        if (index >= 0 && index < steps.length) {
          setActiveStep(index)
          stepRefs.current[index]?.focus()
        }
      },
    }),
    [steps.length],
  )

  // 4) Handler: when a step is clicked
  const handleStepClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, index: number) => {
      setActiveStep(index)
      stepRefs.current[index]?.focus()
      onChange?.(e, index)
    },
    [onChange],
  )

  // 5) Handler: keyboard navigation (Left/Right arrow)
  const handleStepKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>, index: number) => {
      const prev = index - 1
      const next = index + 1

      if (e.key === "ArrowLeft") {
        // Only move left if prev is a completed step
        if (prev >= 0 && prev < activeStep) {
          setActiveStep(prev)
          stepRefs.current[prev]?.focus()
          onChange?.(e, prev)
        }
        e.preventDefault()
      } else if (e.key === "ArrowRight") {
        // Only move right if next is already completed (< activeStep)
        if (next < steps.length && next < activeStep) {
          setActiveStep(next)
          stepRefs.current[next]?.focus()
          onChange?.(e, next)
        }
        e.preventDefault()
      }
    },
    [onChange, steps.length, activeStep],
  )

  // 7) If initialStep prop ever changes, sync internal state:
  useEffect(() => {
    if (initialStep >= 0 && initialStep < steps.length) {
      setActiveStep(initialStep)
    }
  }, [initialStep, steps.length])

  const formattedSteps: Step[] = useMemo(
    () =>
      steps.map((step, i) => {
        const isActive = i === activeStep
        const isCompleted = activeStep > i

        return {
          ...step,
          innerContainerProps: {
            // If the step is “completed” (activeStep > i) but not current (i !== active), allow click
            onClick: (e: MouseEvent<HTMLDivElement>) => {
              if (isCompleted && !isActive) {
                handleStepClick(e, i)
              }
              steps?.[i]?.innerContainerProps?.onClick?.(e)
            },
            onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
              handleStepKeyDown(e, i)
              steps?.[i]?.innerContainerProps?.onKeyDown?.(e)
            },
            onFocus: (e: FocusEvent<HTMLDivElement>) => {
              onFocus?.(e, i)
              steps?.[i]?.innerContainerProps?.onFocus?.(e)
            },
            onBlur: (e: FocusEvent<HTMLDivElement>) => {
              onBlur?.(e, i)
              steps?.[i]?.innerContainerProps?.onBlur?.(e)
            },
            // Capture the <div role="button"> element in stepRefs.current[i]
            ref: (el: HTMLDivElement | null) => {
              stepRefs.current[i] = el
            },
          },
        }
      }),
    [steps, activeStep, handleStepClick, handleStepKeyDown, onFocus, onBlur],
  )

  return (
    <StepperView
      {...rootProps}
      activeStep={activeStep}
      className={className}
      stepRefs={stepRefs}
      steps={formattedSteps}
      translations={translations}
    />
  )
})

StepperClient.displayName = "StepperClient"

export default memo(StepperClient)
