import { type FC, Fragment, useState } from "react"

import { Button } from "../button"

import { Drawer } from "./Drawer"

import type { DrawerProps } from "./Drawer.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    anchor: {
      options: ["left", "right", "top", "bottom"],
      defaultValue: "bottom",
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const DrawerWithHooks: FC<DrawerProps> = ({ anchor }) => {
  const [open, setOpen] = useState(false)
  const toggleDrawer = () => {
    setOpen(true)
  }
  return (
    <Fragment key={anchor}>
      <Button
        style={{ marginRight: 20 }}
        title={anchor ?? ""}
        onClick={toggleDrawer}
      />
      <Drawer
        anchor={anchor}
        open={open}
        title="Your headline"
        onClose={toggleDrawer}
      >
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
      </Drawer>
    </Fragment>
  )
}

/* eslint react-hooks/rules-of-hooks: 0 */
export const Default: Story = {
  args: {
    open: false,
    anchor: "top",
    onClose: () => console.log(),
  },
  render: args => (
    <DrawerWithHooks
      anchor={args?.anchor}
      open={false}
      onClose={() => void 0}
    />
  ),
}
