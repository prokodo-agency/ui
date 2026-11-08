"use client"

import { useState, useEffect, type JSX, useMemo } from "react"

import SideNavView from "./SideNav.view"

import type { SideNavProps } from "./SideNav.model"

const STORAGE_KEY = "prokodo-adminSidebarCollapsed"

export default function SidebarClient({
  items,
  sections,
  onChange,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  ...props
}: SideNavProps): JSX.Element {
  const [internalCollapsed, setCollapsed] = useState(
    props.initialCollapsed ?? false,
  )
  const collapsed = controlledCollapsed ?? internalCollapsed

  /*  persist user preference in localStorage  */
  useEffect(() => {
    if (controlledCollapsed !== undefined) return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === "0" || stored === "1") setCollapsed(stored === "1")
    } catch {
      // Storage can be unavailable; navigation must still work.
    }
  }, [controlledCollapsed])

  const handleToggle = () => {
    const nextCollapsed = !collapsed
    if (controlledCollapsed === undefined) {
      setCollapsed(nextCollapsed)
      try {
        localStorage.setItem(STORAGE_KEY, nextCollapsed ? "1" : "0")
      } catch {
        // Persistence is optional, interaction is not.
      }
    }
    onCollapsedChange?.(nextCollapsed)
  }

  const formatedItems = useMemo(
    () =>
      items?.map(el => ({
        ...el,
        redirect: el?.redirect && {
          ...el?.redirect,
          href: el?.redirect?.href ?? "",
          onClick: e => {
            el?.redirect?.onClick?.(e)
            onChange?.(el)
          },
        },
      })),
    [items, onChange],
  )

  const formatedSections = useMemo(
    () =>
      sections?.map(section => ({
        ...section,
        items: section.items.map(el => ({
          ...el,
          redirect: el?.redirect && {
            ...el?.redirect,
            href: el?.redirect?.href ?? "",
            onClick: e => {
              el?.redirect?.onClick?.(e)
              onChange?.(el)
            },
          },
        })),
      })),
    [sections, onChange],
  )

  return (
    <SideNavView
      {...props}
      collapsed={collapsed}
      items={formatedItems}
      sections={formatedSections}
      onToggle={handleToggle}
    />
  )
}
