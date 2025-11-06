"use client"

import React, {
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from "react"

type AnyProps = Record<string, unknown>

export type LinkLike = ComponentType<AnyProps>
export type ImageLike = ComponentType<AnyProps>

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
