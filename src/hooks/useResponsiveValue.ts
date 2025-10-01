"use client"
import { useEffect, useMemo, useRef, useState, type RefObject } from "react"

export type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl"
export type Breakpoints = Record<BreakpointKey, number>
type MQPair<T> = readonly [query: string, value: T]
export type ContainerRule<T> = { min?: number; max?: number; value: T }

export type Options<T> = {
  /** required default when nothing matches */
  fallback: T
  /** viewport: map breakpoint -> value (component passes both maps) */
  breakpoints?: Breakpoints
  valuesByBreakpoint?: Partial<Record<BreakpointKey, T>>
  /** arbitrary media queries (first match wins, in your order) */
  valuesByQueries?: ReadonlyArray<MQPair<T>>
  /** container width rules: first match wins (attach returned ref) */
  containerRules?: ReadonlyArray<ContainerRule<T>>
}

/* ---------- helpers: no deprecation warnings ---------- */
function addMQChangeListener(
  mql: MediaQueryList,
  handler: (e: MediaQueryListEvent) => void,
) {
  if ("addEventListener" in mql) {
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }
  // Fallback for very old Safari — typed as any to avoid deprecation warnings
  const legacy: MediaQueryList = mql
  legacy.addListener?.(handler)
  return () => legacy.removeListener?.(handler)
}

export function useResponsiveValue<T>(opts: Options<T>): {
  value: T
  ref: RefObject<HTMLElement | null>
} {
  const { fallback } = opts
  const [val, setVal] = useState<T>(fallback)

  // container observer (only activates if rules provided)
  const containerRef = useRef<HTMLElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const hasContainerRules =
      Array.isArray(opts.containerRules) && opts.containerRules.length > 0
    if (!hasContainerRules) return

    const el = containerRef.current
    if (!el || typeof ResizeObserver === "undefined") return

    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect?.width ?? 0
      setContainerWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [opts.containerRules])

  // viewport queries
  const queriesKey = useMemo(
    () => JSON.stringify(opts.valuesByQueries ?? []),
    [opts.valuesByQueries],
  )
  const valuesByBreakpointKey = useMemo(
    () => JSON.stringify(opts.valuesByBreakpoint ?? {}),
    [opts.valuesByBreakpoint],
  )
  const breakpointsKey = useMemo(
    () => JSON.stringify(opts.breakpoints ?? {}),
    [opts.breakpoints],
  )
  const containerRulesKey = useMemo(
    () => JSON.stringify(opts.containerRules ?? []),
    [opts.containerRules],
  )

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return

    const disposers: Array<() => void> = []
    const queryPairs = opts.valuesByQueries ?? []
    const queryMQLs = queryPairs.map(([q]) => window.matchMedia(q))
    queryMQLs.forEach(mql => disposers.push(addMQChangeListener(mql, compute)))

    const bpOrder: BreakpointKey[] = ["xl", "lg", "md", "sm", "xs"]
    const bps = opts.breakpoints
    const valuesByBp = opts.valuesByBreakpoint
    const bpMQLs: Array<{ key: BreakpointKey; mql: MediaQueryList }> = []
    if (bps && valuesByBp) {
      for (const k of bpOrder) {
        if (k in valuesByBp && bps[k] != null) {
          const mql = window.matchMedia(`(min-width:${bps[k]}px)`)
          bpMQLs.push({ key: k, mql })
          disposers.push(addMQChangeListener(mql, compute))
        }
      }
    }

    function compute() {
      const rules = opts.containerRules ?? []
      if (rules.length) {
        const hit = rules.find(r => {
          const minOk = r.min == null || containerWidth >= r.min
          const maxOk = r.max == null || containerWidth < r.max
          return minOk && maxOk
        })
        if (hit) {
          setVal(hit.value)
          return
        }
      }

      for (let i = 0; i < queryPairs.length; i++) {
        const mql = queryMQLs[i]
        if (mql != null && mql.matches === true) {
          const v = queryPairs[i]?.[1]
          setVal(v as T)
          return
        }
      }

      if (bps && valuesByBp) {
        for (const { key, mql } of bpMQLs) {
          if (mql.matches && key in valuesByBp) {
            setVal(valuesByBp[key] as T)
            return
          }
        }
      }

      setVal(fallback)
    }

    compute()
    return () => disposers.forEach(d => d())
  }, [
    opts.breakpoints,
    opts.containerRules,
    opts.valuesByBreakpoint,
    opts.valuesByQueries,
    fallback,
    containerWidth,
    queriesKey,
    valuesByBreakpointKey,
    breakpointsKey,
    containerRulesKey,
  ])

  return useMemo(() => ({ value: val, ref: containerRef }), [val])
}