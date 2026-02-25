import { PostWidgetView } from "../../src/components/post-widget/PostWidget.view"

const widgetItems = [
  {
    title: { content: "First Post Title" },
    redirect: { href: "/blog/first-post" },
  },
  {
    title: { content: "Second Post Title" },
    redirect: { href: "/blog/second-post" },
  },
]

describe("PostWidget", () => {
  it("renders widget title", () => {
    cy.mount(
      <PostWidgetView
        items={widgetItems}
        title={{ content: "Latest Articles" }}
      />,
    )
    cy.contains("Latest Articles").should("be.visible")
  })

  it("renders post items", () => {
    cy.mount(<PostWidgetView items={widgetItems} title={{ content: "Blog" }} />)
    cy.contains("First Post Title").should("be.visible")
    cy.contains("Second Post Title").should("be.visible")
  })

  it("renders post item links", () => {
    cy.mount(
      <PostWidgetView items={widgetItems} title={{ content: "Posts" }} />,
    )
    cy.get("a[href='/blog/first-post']").should("exist")
  })

  it("renders as a section element", () => {
    cy.mount(
      <PostWidgetView
        items={widgetItems}
        title={{ content: "Recent Posts" }}
      />,
    )
    cy.get("section").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <PostWidgetView
        items={widgetItems}
        title={{ content: "Accessible Widget" }}
      />,
    )
    cy.checkAccessibility()
  })
})
