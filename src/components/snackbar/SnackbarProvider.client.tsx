"use client"
import {
  type ReactNode,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react"

import { create } from "@/helpers/bem"

import { Snackbar } from "./Snackbar"
import styles from "./Snackbar.module.scss"
import { SnackbarCtx } from "./SnackbarProvider.context"

import type {
  SnackbarProviderProps,
  SnackbarContextValue,
  SnackbarPayload,
} from "./SnackbarProvider.model"

const bem = create(styles, "SnackbarProvider")

/* Hook never throws – returns no-op impl on server side */
export function useSnackbar(): SnackbarContextValue {
  return useContext(SnackbarCtx);
}

export default function SnackbarProvider({
  className,
  maxSnack = 3,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
  children,
}: SnackbarProviderProps): ReactNode {
  const [queue, setQueue] = useState<SnackbarPayload[]>([])

  // ── enqueue ───────────────────────────────────────────────────
  const enqueue = useCallback(
    (p: SnackbarPayload): string => {
      const id = p.id ?? `snk_${crypto.randomUUID()}`
      setQueue((q) => {
        const next = [
          ...q,
          { ...p, id, anchorOrigin: p.anchorOrigin ?? anchorOrigin },
        ]
        return next.length > maxSnack ? next.slice(1) : next
      })
      return id
    },
    [maxSnack, anchorOrigin],
  )

  // ── close ─────────────────────────────────────────────────────
  const close = useCallback((id: string): void => {
    setQueue((q) => q.filter((s) => s.id !== id))
  }, [])

  // ── context memo ──────────────────────────────────────────────
  const ctx = useMemo<SnackbarContextValue>(() => ({ enqueue, close }), [enqueue, close])

  // ── group by anchorOrigin once per render ─────────────────────
  const grouped = useMemo(() => queue.reduce<Record<string, SnackbarPayload[]>>((acc, s) => {
      const key = `${s.anchorOrigin?.vertical}-${s.anchorOrigin?.horizontal}`;
      (acc[key] ??= []).push(s)
      return acc
    }, {}), [queue])

  // ── render ────────────────────────────────────────────────────
  return (
     <SnackbarCtx.Provider value={ctx}>
      {children}

      {Object.entries(grouped).map(([key, snacks]) => {
        const { vertical, horizontal } = snacks[0]?.anchorOrigin!
        const mod = {
          [`is-${vertical}`]: true,
          [`is-${horizontal}`]: true,
        }
        return (
          <div
            key={key}
            className={bem(undefined, mod, className)}>
            {snacks.map((snk) => (
              <Snackbar
                key={snk.id}
                {...snk}
                open
                className={bem("snackbar", mod, snk.className)}
                onClose={() => close(snk.id!)}
              />
            ))}
          </div>
        );
      })}
    </SnackbarCtx.Provider>
  )
}
