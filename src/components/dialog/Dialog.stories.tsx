import { type FC, Fragment, useRef } from "react"

import { Button } from "../button"

import { Dialog } from "./Dialog"

import type { DialogProps, DialogRef } from "./Dialog.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    hideCloseButton: {
      control: { type: "boolean" },
    },
    title: {
      defaultValue: "Example Dialog",
      control: { type: "text" },
    },
    hideTitle: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const DialogWithRef: FC<DialogProps> = args => {
  const dialogRef = useRef<DialogRef | null>(null)
  return (
    <Fragment>
      <Button
        title="Open Dialog"
        onClick={() => dialogRef.current?.openDialog()}
      />
      <Dialog ref={dialogRef} {...args}>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet.
        </p>
      </Dialog>
    </Fragment>
  )
}

/* eslint react-hooks/rules-of-hooks: 0 */
export const Default: Story = {
  args: {
    title: "Example Dialog",
    onClose: () => console.log("Dialog closed"),
  },
  render: args => <DialogWithRef {...args} />,
}

export const FullScreen: Story = {
  args: {
    title: "Example Dialog",
    fullScreen: true,
    onClose: () => console.log("Dialog closed"),
  },
  render: args => <DialogWithRef {...args} />,
}
