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
