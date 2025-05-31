import { ChipView } from "./Chip.view";
import type { ChipProps } from "./Chip.model";

export default function ChipServer(props: ChipProps) {
  return <ChipView {...props} />;
}
