import { Animated } from "@/components/animated/Animated"
import { Loading } from "@/components/loading"

import type { CalendlyProps } from "./Calendly.model"
import type { CSSProperties, JSX } from "react"

export function CalendlyView({
  animationProps,
  hideLoading,
  LoadingComponent = Loading,
  ...rest
}: CalendlyProps): JSX.Element {
  const style: CSSProperties = {
    display: "none",
    minWidth: 320,
    height: 700,
  }

  return (
    <Animated {...animationProps}>
      {!Boolean(hideLoading) && <LoadingComponent />}
      <div {...rest} data-calendly style={style} />
    </Animated>
  )
}
