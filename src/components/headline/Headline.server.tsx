import type { HeadlineProps } from "./Headline.model"
import { HeadlineView } from "./Headline.view"

/** Einziger Export für das Island-Pattern. */
export default function HeadlineServer(props: HeadlineProps) {
  return <HeadlineView {...props} />
}
