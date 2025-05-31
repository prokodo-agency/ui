import type { FC } from "react"
import { DialogView } from "./Dialog.view"
import type { DialogProps } from "./Dialog.model"

const DialogServer: FC<DialogProps> = (props) => {
    if (!props.open) return null
    return <DialogView {...props} onChange={undefined} />
}

export default DialogServer
