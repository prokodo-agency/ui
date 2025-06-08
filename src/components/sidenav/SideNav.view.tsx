import { create } from "@/helpers/bem"

import { Icon, type IconProps } from "../icon"
import { Link } from "../link"

import styles from "./SideNav.module.scss"

import type { SideNavViewProps, SideNavItem } from "./SideNav.model"
import type { JSX } from "react"

const bem = create(styles, "SideNav")

export default function SideNavView({
  items,
  collapsed,
  collapsedLabel = "Expand menu",
  collapsedIcon = "ArrowRight01Icon",
  unCollapsedLabel = "Collapse menu",
  unCollapsedIcon = "ArrowLeft01Icon",
  iconProps,
  onToggle,
  interactive = true,
  ariaLabel = "Main navigation",
  className,
}: SideNavViewProps): JSX.Element {

  const renderItem = (icon: IconProps, label: string) => (
    <>
      <div className={bem("icon__wrapper")}>
        <Icon size={25} {...icon} className={bem("icon", undefined, icon?.className)} />
      </div>
      {!collapsed && <span className={bem("label", { collapsed })}>{label}</span>}
    </>
  )

  return (
    <aside
      aria-label={ariaLabel}
      className={bem(undefined, { collapsed, interactive }, className)}
    >
      <button
        aria-controls="sidenav"
        aria-expanded={!collapsed}
        className={bem("toggle")}
        type="button"
        onClick={onToggle}
      >
        <Icon size="md" {...iconProps} name={collapsed ? collapsedIcon : unCollapsedIcon} />
        <span className={bem("collape__label", {"is-hidden": collapsed})}>
          {collapsed ? collapsedLabel : unCollapsedLabel}
        </span>
      </button>

      <nav id="sidenav">
        <ul className={bem("list")}>
          {items.map(({ label, icon, redirect,  }: SideNavItem) => (
            <li key={label}>
              {redirect?.href !== undefined ?
                <Link
                  {...redirect}
                  className={bem("link", { collapsed }, redirect?.className)}
                  href={redirect.href}
                >
                  {renderItem(icon, label)}
                </Link>
              : <>{renderItem(icon, label)}</> }
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
