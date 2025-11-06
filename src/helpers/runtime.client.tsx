"use client"

import React, { createContext, useContext, type ReactNode } from "react"

export type UIRuntimeCtx = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linkComponent?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageComponent?: any
}

const UIRuntimeContext = createContext<UIRuntimeCtx>({})

export type UIRuntimeProviderProps = {
  value: UIRuntimeCtx
  children: ReactNode
}

export const UIRuntimeProvider = ({
  value,
  children,
}: UIRuntimeProviderProps): React.JSX.Element => (
  <UIRuntimeContext.Provider value={value}>
    {children}
  </UIRuntimeContext.Provider>
)

export const useUIRuntime = (): UIRuntimeCtx => useContext(UIRuntimeContext)
