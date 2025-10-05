import { DialogView } from "./Dialog.view"

import type { DialogProps } from "./Dialog.model"
import type { FC } from "react"

const DialogServer: FC<DialogProps> = props => {
  if (!Boolean(props.open)) return null
  return <DialogView {...props} onChange={undefined} />
}

export default DialogServer
