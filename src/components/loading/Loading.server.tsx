import { SpinnerView, OverlayView } from "./Loading.view"

import type { LoadingProps } from "./Loading.model"
import type { FC } from "react"

const LoadingServer: FC<LoadingProps> = (props) => {
  if (props.variant === "overlay") {
    const { backdrop = "auto", ...rest } = props
    // No media queries on the server; choose light and let client correct.
    const resolved = backdrop === "dark" ? "dark" : "light"
    return <OverlayView {...rest} reducedMotion={props.reducedMotion} resolvedBackdrop={resolved} />
  }
  const { variant: _v, ...rest } = props
  return <SpinnerView {...rest} reducedMotion={props.reducedMotion} />
}

export default LoadingServer
