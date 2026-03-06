import type { ReactNode } from "react"

import { STORYBOOK_URL } from "../constants"

interface LiveDemoLinkProps {
  /** Storybook docs path, e.g. "/docs/prokodo-content-button--docs" */
  path: string
}

/**
 * Renders a "Live demo →" link to the corresponding Storybook docs page.
 *
 * Uses rel="nofollow" as a signal that Storybook is UX-only and should not
 * pass SEO equity. Combined with robots.txt Disallow: /storybook/, crawlers
 * won't reach Storybook pages regardless — nofollow is belt-and-suspenders.
 *
 * href is constructed from STORYBOOK_URL so it automatically resolves to
 * localhost:6006 in development and to https://ui.prokodo.com/storybook in
 * production.
 */
export function LiveDemoLink({ path }: LiveDemoLinkProps): ReactNode {
  const href = `${STORYBOOK_URL}/?path=${encodeURIComponent(path)}`

  return (
    <a href={href} target="_blank" rel="nofollow noopener noreferrer">
      Live demo →
    </a>
  )
}
