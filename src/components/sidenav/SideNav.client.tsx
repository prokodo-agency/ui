"use client"

import { useState, useEffect, type JSX } from "react"

import SideNavView from "./SideNav.view"

import type { SideNavProps } from "./SideNav.model"

const STORAGE_KEY = "prokodo-adminSidebarCollapsed"

export default function SidebarClient(props: SideNavProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(
    props.initialCollapsed ?? false
  )

  /*  persist user preference in localStorage  */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) setCollapsed(stored === "1")
  }, [])

  const handleToggle = () => {
    setCollapsed(c => {
      localStorage.setItem(STORAGE_KEY, c ? "0" : "1")
      return !c
    })
  }

  return (
    <SideNavView
      {...props}
      collapsed={collapsed}
      onToggle={handleToggle}
    />
  )
}
