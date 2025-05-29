"use client"
import { HeadlineView } from "./Headline.view"

import type { HeadlineProps } from "./Headline.model"
import type { JSX } from "react"

/** Einziger Export für das Island-Pattern. */
export default function HeadlineClient(props: HeadlineProps): JSX.Element {
  return <HeadlineView {...props} />
}
