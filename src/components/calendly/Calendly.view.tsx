import { Animated } from "@/components/animated/Animated"
import { Loading } from "@/components/loading"
import { create } from "@/helpers/bem"

import styles from "./Calendly.module.scss"

import type { CalendlyProps } from "./Calendly.model"
import type { JSX } from "react"

const bem = create(styles, "Calendly")

export function CalendlyView({
  animationProps,
  hideLoading,
  LoadingComponent = Loading,
  calendlyId: _calendlyId,
  className,
  ...rest
}: CalendlyProps): JSX.Element {
  return (
    <Animated {...animationProps}>
      {!Boolean(hideLoading) && <LoadingComponent />}
      <div
        {...rest}
        data-calendly
        className={bem("widget", undefined, className)}
      />
    </Animated>
  )
}
