import { useState } from "react"

import { SideNav } from "../../src/components/sidenav"
import SideNavView from "../../src/components/sidenav/SideNav.view"

const navItems = [
  { label: "Dashboard", icon: { name: "Home01Icon" as const } },
  { label: "Settings", icon: { name: "Settings01Icon" as const } },
  { label: "Profile", icon: { name: "User02Icon" as const } },
]

describe("SideNav", () => {
  it("renders navigation items when expanded", () => {
    cy.mount(<SideNavView collapsed={false} items={navItems} />)
    cy.contains("Dashboard").should("be.visible")
    cy.contains("Settings").should("be.visible")
  })

  it("renders as an aside element", () => {
    cy.mount(<SideNavView collapsed={false} items={navItems} />)
    cy.get("aside").should("exist")
  })

  it("has aria-label on the navigation", () => {
    cy.mount(
      <SideNavView
        ariaLabel="Sidebar navigation"
        collapsed={false}
        items={navItems}
      />,
    )
    cy.get("[aria-label='Sidebar navigation']").should("exist")
  })

  it("hides item labels when collapsed", () => {
    cy.mount(<SideNavView collapsed items={navItems} />)
    cy.contains("Dashboard").should("not.exist")
  })

  it("renders collapse toggle button", () => {
    cy.mount(
      <SideNavView
        collapsed={false}
        collapsedLabel="Expand menu"
        items={navItems}
        onToggle={cy.stub()}
      />,
    )
    cy.get("button").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <SideNavView ariaLabel="Main menu" collapsed={false} items={navItems} />,
    )
    cy.checkAccessibility()
  })
})

describe("SideNav application-owned state", () => {
  it("keeps external controls, built-in toggles and accessible links synchronized without persistence", () => {
    const onCollapsedChange = cy.stub().as("collapseRequest")
    const ControlledNavigation = () => {
      const [collapsed, setCollapsed] = useState(false)
      return (
        <>
          <button
            style={{ minHeight: 44, minWidth: 44 }}
            aria-controls="sidenav"
            aria-expanded={!collapsed}
            type="button"
            onClick={() => setCollapsed(value => !value)}
          >
            Toggle from application
          </button>
          <SideNav
            priority
            collapsed={collapsed}
            items={[
              {
                label: "Dashboard",
                icon: { name: "Home01Icon" },
                active: true,
                redirect: {
                  href: "#dashboard",
                  ariaLabel: "Dashboard",
                  "aria-current": "page",
                },
              },
            ]}
            renderFooter={() => <p>Application-owned navigation state</p>}
            onCollapsedChange={next => {
              onCollapsedChange(next)
              setCollapsed(next)
            }}
          />
        </>
      )
    }
    cy.window().then(win => {
      win.localStorage.setItem(
        "prokodo-adminSidebarCollapsed",
        "existing-value",
      )
      cy.stub(win.localStorage, "getItem").as("storageRead")
      cy.stub(win.localStorage, "setItem").as("storageWrite")
    })
    cy.mount(<ControlledNavigation />)
    cy.contains("Application-owned navigation state").should("be.visible")
    cy.contains("button", "Toggle from application")
      .click()
      .should("have.attr", "aria-expanded", "false")
    cy.get('a[aria-label="Dashboard"]')
      .should("be.visible")
      .and("have.attr", "aria-current", "page")
    cy.get('aside button[aria-expanded="false"]').click()
    cy.get("@collapseRequest").should("have.been.calledOnceWith", false)
    cy.contains("button", "Toggle from application").should(
      "have.attr",
      "aria-expanded",
      "true",
    )
    cy.contains("button", "Collapse menu").should(
      "have.attr",
      "aria-expanded",
      "true",
    )
    cy.get("@storageRead").should("not.have.been.called")
    cy.get("@storageWrite").should("not.have.been.called")
    cy.checkAccessibility()
  })
})
