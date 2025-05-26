import { forwardRef, createElement } from "react"

import defaultAttributes from "./defaultAttributes"

export type IconProps = {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
} & React.SVGProps<SVGSVGElement>

const createIconComponent = (
  name: string,
  data: [string, Record<string, any>][]
) => {
  const Component = forwardRef<SVGSVGElement, IconProps>(
    (
      {
        color = "currentColor",
        size = 24,
        strokeWidth = 1.5,
        className = "",
        children,
        ...rest
      },
      ref
    ) => {
      const props = {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        strokeWidth,
        color,
        className,
        ...rest,
      }

      return createElement(
        "svg",
        props,
        ...(data?.map(([tag, attrs]) => createElement(tag, { key: attrs.key, ...attrs })) ?? []),
        ...(Array.isArray(children) ? children : [children])
      )
    }
  )

  Component.displayName = `${name}Icon`
  return Component
}

export default createIconComponent
