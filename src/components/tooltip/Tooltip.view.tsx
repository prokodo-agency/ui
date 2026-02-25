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
  /* istanbul ignore next */
  return ((...args: unknown[]) => {
    if (typeof a === "function") (a as (...xs: unknown[]) => void)(...args)
    if (typeof b === "function") (b as (...xs: unknown[]) => void)(...args)
  }) as unknown as T
}

function setRef<T>(ref: unknown, value: T) {
  if (!ref) return
  /* istanbul ignore next */
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
    /* istanbul ignore next */
    display:
      ((triggerProps?.style as Record<string, unknown>)?.display as
        | string
        | undefined) ??
      ((childProps.style as Record<string, unknown>)?.display as
        | string
        | undefined) ??
      "inline-flex",
    width:
      ((triggerProps?.style as Record<string, unknown>)?.width as
        | string
        | undefined) ??
      ((childProps.style as Record<string, unknown>)?.width as
        | string
        | undefined) ??
      "max-content",
    maxWidth:
      ((triggerProps?.style as Record<string, unknown>)?.maxWidth as
        | string
        | undefined) ??
      ((childProps.style as Record<string, unknown>)?.maxWidth as
        | string
        | undefined) ??
      "max-content",
    flex:
      ((triggerProps?.style as Record<string, unknown>)?.flex as
        | string
        | undefined) ??
      ((childProps.style as Record<string, unknown>)?.flex as
        | string
        | undefined) ??
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
      (childProps as Record<string, unknown>)["aria-describedby"] as
        | string
        | undefined,
      describedBy,
    ),

    onMouseEnter: compose(childProps.onMouseEnter, triggerProps?.onMouseEnter),
    onMouseLeave: compose(childProps.onMouseLeave, triggerProps?.onMouseLeave),
    onFocus: compose(childProps.onFocus, triggerProps?.onFocus),
    onBlur: compose(childProps.onBlur, triggerProps?.onBlur),
    onKeyDown: compose(childProps.onKeyDown, triggerProps?.onKeyDown),

    ref: (node: HTMLElement | null) => {
      setRef(childProps.ref, node)
      /* istanbul ignore next */
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
