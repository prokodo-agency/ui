"use client"

import {
  cloneElement,
  useId,
  type HTMLAttributes,
  type JSX,
  type ReactElement,
  type Ref,
  type CSSProperties,
} from "react"

import { create } from "@/helpers/bem"

import styles from "./Tooltip.module.scss"

import type { TooltipPlacement, TooltipViewProps } from "./Tooltip.model"

const bem = create(styles, "Tooltip")

function mergeClassName(a?: string, b?: string): string | undefined {
  const v = [a, b].filter(Boolean).join(" ")
  return v.length ? v : undefined
}

function compose<T>(a?: T, b?: T): T | undefined {
  if (!a && !b) return
  return ((...args: unknown[]) => {
    if (typeof a === "function") (a as (...xs: unknown[]) => void)(...args)
    if (typeof b === "function") (b as (...xs: unknown[]) => void)(...args)
  }) as unknown as T
}

function setRef<T>(ref: unknown, value: T) {
  if (!ref) return
  if (typeof ref === "function") {
    ref(value)
    return
  }
  try {
    ;(ref as { current: T }).current = value
  } catch {
    // ignore
  }
}

type MergeableTriggerProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>
}

export function TooltipView(props: TooltipViewProps): JSX.Element {
  const {
    id,
    content,
    children,
    placement = "top",
    disabled,
    open,

    className,
    tooltipClassName,
    triggerClassName,
    triggerProps,

    __rootRef,
    __triggerRef,
    __bubbleRef,
    __bubbleStyle,
    __renderVisualBubble = true,
    __open,
    __placement,
    __tooltipId,
  } = props

  const rid = useId()
  const tooltipId = __tooltipId ?? id ?? `tt-${rid}`

  const describedBy = !disabled ? tooltipId : undefined

  const effectivePlacement = (__placement ?? placement) as TooltipPlacement
  const effectiveOpen = __open ?? open

  const child = children as ReactElement<HTMLAttributes<HTMLElement>>
  const childProps = child.props as MergeableTriggerProps

  const mergedStyle: CSSProperties = {
    ...(childProps.style ?? {}),
    ...(triggerProps?.style ?? {}),

    // ✅ critical: prevent full-width triggers (global button resets, flex rules, etc.)
    display:
      (triggerProps?.style as any)?.display ??
      (childProps.style as any)?.display ??
      "inline-flex",
    width:
      (triggerProps?.style as any)?.width ??
      (childProps.style as any)?.width ??
      "max-content",
    maxWidth:
      (triggerProps?.style as any)?.maxWidth ??
      (childProps.style as any)?.maxWidth ??
      "max-content",
    flex:
      (triggerProps?.style as any)?.flex ??
      (childProps.style as any)?.flex ??
      "0 0 auto",
  }

  const merged: MergeableTriggerProps = {
    ...childProps,
    ...triggerProps,

    style: mergedStyle,

    className: mergeClassName(
      childProps.className,
      bem("trigger", undefined, triggerClassName),
    ),

    "aria-describedby": mergeClassName(
      (childProps as any)["aria-describedby"],
      describedBy,
    ),

    onMouseEnter: compose(childProps.onMouseEnter, triggerProps?.onMouseEnter),
    onMouseLeave: compose(childProps.onMouseLeave, triggerProps?.onMouseLeave),
    onFocus: compose(childProps.onFocus, triggerProps?.onFocus),
    onBlur: compose(childProps.onBlur, triggerProps?.onBlur),
    onKeyDown: compose(childProps.onKeyDown, triggerProps?.onKeyDown),

    ref: (node: HTMLElement | null) => {
      setRef((childProps as any).ref, node)
      if (__triggerRef) __triggerRef.current = node
    },
  }

  const inlineBubbleClass = bem(
    "bubble",
    { open: Boolean(effectiveOpen), [effectivePlacement]: true },
    tooltipClassName,
  )

  return (
    <span
      ref={__rootRef}
      className={bem(undefined, { disabled: Boolean(disabled) }, className)}
      data-placement={effectivePlacement}
      data-open={
        effectiveOpen === undefined ? undefined : String(Boolean(effectiveOpen))
      }
    >
      {cloneElement(child, merged)}

      {!disabled && (
        <span aria-hidden="true" className={bem("sr")} id={tooltipId}>
          {content}
        </span>
      )}

      {!disabled && __renderVisualBubble && (
        <span
          ref={__bubbleRef}
          aria-hidden={effectiveOpen === undefined ? undefined : !effectiveOpen}
          className={inlineBubbleClass}
          role="tooltip"
          style={__bubbleStyle}
        >
          {content}
        </span>
      )}
    </span>
  )
}
