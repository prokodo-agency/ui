import type { ReactNode } from "react"
import Layout from "@theme-original/DocItem/Layout"
import Admonition from "@theme/Admonition"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import { useDoc } from "@docusaurus/plugin-content-docs/client"
import componentsData from "@site/docs/_data/components.json"

type ComponentCatalogEntry = {
  slug: string
  aic: "server" | "client" | "lazy" | "none"
}

const AIC_READY_COMPONENTS = new Set(
  (componentsData as ComponentCatalogEntry[])
    .filter(
      entry =>
        entry.aic === "server" ||
        entry.aic === "client" ||
        entry.aic === "lazy",
    )
    .map(entry => entry.slug),
)

function RuntimeInfo({ componentId }: { componentId: string }): ReactNode {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext()

  const componentName = componentId
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

  const isClientOnly = componentId === "lottie" || componentId === "map"
  const isAicReady = AIC_READY_COMPONENTS.has(componentId)

  if (isClientOnly) {
    return (
      <Admonition
        type="info"
        title={currentLocale === "de" ? "Laufzeit" : "Runtime"}
      >
        <p>
          {currentLocale === "de"
            ? `${componentName} ist client-only und läuft immer im Browser.`
            : `${componentName} is client-only and always runs in the browser.`}
        </p>
      </Admonition>
    )
  }

  if (isAicReady) {
    return (
      <Admonition
        type="tip"
        title={
          currentLocale === "de" ? "Universell einsetzbar" : "Works everywhere"
        }
      >
        <p>
          {currentLocale === "de"
            ? `${componentName} funktioniert sowohl auf dem Server als auch im Browser. Nutze immer den Standard-Import (z. B. @prokodo/ui/${componentId}) — die Library erkennt die Umgebung automatisch.`
            : `${componentName} works in both server and client environments. Always use the standard import (e.g. @prokodo/ui/${componentId}) — the library detects the runtime automatically.`}
        </p>
      </Admonition>
    )
  }

  return (
    <Admonition
      type="info"
      title={currentLocale === "de" ? "Server-Komponente" : "Server Component"}
    >
      <p>
        {currentLocale === "de"
          ? `${componentName} wird bevorzugt auf dem Server gerendert. Nutze den Standard-Import (z. B. @prokodo/ui/${componentId}) — die Library erkennt die Umgebung automatisch.`
          : `${componentName} is best rendered on the server. Use the standard import (e.g. @prokodo/ui/${componentId}) — the library detects the runtime automatically.`}
      </p>
    </Admonition>
  )
}

export default function DocItemLayout(props: {
  children: ReactNode
}): ReactNode {
  const { metadata } = useDoc()
  const componentPrefix = "components/"
  const isComponentDoc = metadata.id.startsWith(componentPrefix)
  const componentId = isComponentDoc
    ? metadata.id.slice(componentPrefix.length)
    : null

  const showRuntimeInfo = componentId && componentId !== "overview"

  return (
    <Layout {...props}>
      {showRuntimeInfo && <RuntimeInfo componentId={componentId} />}
      {props.children}
    </Layout>
  )
}
