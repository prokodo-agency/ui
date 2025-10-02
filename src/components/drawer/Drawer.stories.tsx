/* eslint-disable */
import { Fragment, useEffect, useState, type FC } from "react"

import { Button } from "../button"
import { Drawer } from "./Drawer"

import type { DrawerProps, DrawerChangeReason } from "./Drawer.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    anchor: {
      control: { type: "inline-radio" },
      options: ["left", "right", "top", "bottom"],
      defaultValue: "left",
    },
    fullscreen: { control: "boolean", defaultValue: false },
    closeOnBackdropClick: { control: "boolean", defaultValue: true },
    onChange: { action: "onChange" },
    open: { control: "boolean" },
    containerClassName: { control: "text" },
    className: { control: "text" },
    renderHeader: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const renderContainer = (children: React.ReactNode) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    }}
  >
    {children}
  </div>
)

/** Controlled helper (no refs, no wrapper changes) */
const DrawerControlled: FC<DrawerProps> = args => {
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(args.open))

  // sync with Storybook controls
  useEffect(() => {
    setIsOpen(Boolean(args.open))
  }, [args.open])

  const handleChange = (e: unknown, reason: DrawerChangeReason) => {
    setIsOpen(false)
    args.onChange?.(e, reason)
  }

  return (
    <Fragment>
      {renderContainer(
        <Button title="Open Drawer" onClick={() => setIsOpen(true)} />,
      )}
      <Drawer {...args} open={isOpen} onChange={handleChange}>
        <div style={{ padding: "1rem" }}>
          <h3>Drawer Content</h3>
          <p>
            Adjust <strong>Anchor</strong> and <strong>Fullscreen</strong> in
            the controls to see different behaviors.
          </p>
          <Button title="Close Drawer" onClick={() => setIsOpen(false)} />
        </div>
      </Drawer>
    </Fragment>
  )
}

/** 1) Default: left, non-fullscreen, backdrop closes */
export const Default: Story = {
  args: {
    open: false,
    anchor: "left",
    fullscreen: false,
    closeOnBackdropClick: true,
  },
  render: args => <DrawerControlled {...args} />,
}

/** 2) FullscreenTop: fullscreen from top */
export const FullscreenTop: Story = {
  args: {
    open: true,
    anchor: "top",
    fullscreen: true,
    closeOnBackdropClick: true,
  },
  render: args => {
    const [isOpen, setIsOpen] = useState<boolean>(Boolean(args.open))

    useEffect(() => {
      setIsOpen(Boolean(args.open))
    }, [args.open])

    const handleChange = (e: unknown, reason: DrawerChangeReason) => {
      setIsOpen(false)
      args.onChange?.(e, reason)
    }

    return (
      <Fragment>
        {renderContainer(
          <Button
            title="Toggle Fullscreen Top Drawer"
            onClick={() => setIsOpen(true)}
          />,
        )}
        <Drawer
          {...args}
          anchor="top"
          fullscreen
          open={isOpen}
          onChange={handleChange}
        >
          <div style={{ padding: "2rem" }}>
            <h2>Fullscreen Top Drawer</h2>
            <p>
              This drawer is <code>fullscreen</code> and anchored at{" "}
              <code>top</code>.
            </p>
            <Button title="Close" onClick={() => setIsOpen(false)} />
          </div>
        </Drawer>
      </Fragment>
    )
  },
}

/** 3) Right, non-fullscreen, backdrop disabled */
export const RightDisabledBackdrop: Story = {
  args: {
    open: false,
    anchor: "right",
    fullscreen: false,
    closeOnBackdropClick: false,
  },
  render: args => {
    const [isOpen, setIsOpen] = useState<boolean>(Boolean(args.open))

    useEffect(() => {
      setIsOpen(Boolean(args.open))
    }, [args.open])

    const handleChange = (e: unknown, reason: DrawerChangeReason) => {
      setIsOpen(false)
      args.onChange?.(e, reason)
    }

    return (
      <Fragment>
        {renderContainer(
          <Button title="Open Right Drawer" onClick={() => setIsOpen(true)} />,
        )}
        <Drawer
          {...args}
          anchor="right"
          closeOnBackdropClick={false}
          fullscreen={false}
          open={isOpen}
          onChange={handleChange}
        >
          <div style={{ padding: "1rem" }}>
            <h3>Right Drawer (Backdrop Disabled)</h3>
            <p>Use the header “×” or the button below to close.</p>
            <Button title="Close" onClick={() => setIsOpen(false)} />
          </div>
        </Drawer>
      </Fragment>
    )
  },
}
