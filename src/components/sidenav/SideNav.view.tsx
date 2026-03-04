import { create } from "@/helpers/bem"

import { Headline } from "../headline"
import { Icon, type IconProps } from "../icon"
import { Link } from "../link"

import styles from "./SideNav.module.scss"

import type {
  SideNavViewProps,
  SideNavItem,
  SideNavSection,
} from "./SideNav.model"
import type { JSX } from "react"

const bem = create(styles, "SideNav")

export default function SideNavView({
  items,
  sections,
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
  renderFooter,
  headlineProps: globalHeadlineProps,
  descriptionProps: globalDescriptionProps,
}: SideNavViewProps): JSX.Element {
  const renderItem = (icon: IconProps, label: string) => (
    <>
      <div className={bem("icon__wrapper")}>
        <Icon
          size={25}
          {...icon}
          className={bem("icon", undefined, icon?.className)}
        />
      </div>
      {!collapsed && (
        <span className={bem("label", { collapsed })}>{label}</span>
      )}
    </>
  )

  const renderNavItem = ({ label, icon, redirect, active }: SideNavItem) => (
    <li key={label}>
      {redirect?.href !== undefined ? (
        <Link
          {...redirect}
          href={redirect.href}
          className={bem(
            "link",
            { collapsed, "is-active": Boolean(active) },
            redirect?.className,
          )}
        >
          {renderItem(icon, label)}
        </Link>
      ) : (
        <>{renderItem(icon, label)}</>
      )}
    </li>
  )

  const renderSection = (section: SideNavSection, index: number) => {
    const {
      headline,
      description,
      headlineComponent: HeadlineComponent,
      headlineProps: sectionHeadlineProps,
      descriptionProps: sectionDescriptionProps,
      items: sectionItems,
    } = section
    const mergedHeadlineProps = {
      ...globalHeadlineProps,
      ...sectionHeadlineProps,
    }
    const mergedDescriptionProps = {
      ...globalDescriptionProps,
      ...sectionDescriptionProps,
    }
    const showHeader =
      !collapsed && (headline || description || HeadlineComponent)

    return (
      <div key={index} className={bem("section")}>
        {showHeader && (
          <div className={bem("section__header")}>
            {HeadlineComponent ? (
              <HeadlineComponent className={bem("section__headline")} />
            ) : (
              headline && (
                <Headline
                  size="xs"
                  type="h6"
                  {...mergedHeadlineProps}
                  className={bem(
                    "section__headline",
                    undefined,
                    mergedHeadlineProps?.className,
                  )}
                >
                  {headline}
                </Headline>
              )
            )}
            {!HeadlineComponent && description && (
              <p
                {...mergedDescriptionProps}
                className={bem(
                  "section__description",
                  undefined,
                  mergedDescriptionProps?.className,
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
        <ul className={bem("list")}>{sectionItems.map(renderNavItem)}</ul>
      </div>
    )
  }

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
        <Icon
          size="md"
          {...iconProps}
          className={bem("collapse__icon", undefined, iconProps?.className)}
          name={collapsed ? collapsedIcon : unCollapsedIcon}
        />
        <span className={bem("collapse__label", { "is-hidden": collapsed })}>
          {collapsed ? collapsedLabel : unCollapsedLabel}
        </span>
      </button>

      <nav id="sidenav">
        {sections && sections.length > 0 ? (
          <div className={bem("sections")}>{sections.map(renderSection)}</div>
        ) : (
          <ul className={bem("list")}>{(items ?? []).map(renderNavItem)}</ul>
        )}
      </nav>

      {renderFooter !== undefined && !collapsed && renderFooter()}
    </aside>
  )
}
