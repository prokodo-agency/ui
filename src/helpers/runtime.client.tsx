"use client"

import React, {
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkLike = ComponentType<any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ImageLike = ComponentType<any>

export type UIRuntimeCtx = {
  linkComponent?: LinkLike
  imageComponent?: ImageLike
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
