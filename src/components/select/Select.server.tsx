import { SelectView } from "./Select.view";
import type { SelectProps } from "./Select.model";

export default function SelectServer(props: SelectProps) {
  return <SelectView {...props} />;
}
