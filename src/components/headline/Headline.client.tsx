"use client"
import type { HeadlineProps } from "./Headline.model"
import { HeadlineView } from "./Headline.view"

/** Einziger Export für das Island-Pattern. */
export default function HeadlineClient(props: HeadlineProps) {
  return <HeadlineView {...props} />
}
