/* eslint-disable */
import { type FC, Fragment, useRef, useState } from 'react'

import { Button } from '../button'

import { Drawer } from './Drawer'

import type { DrawerProps, DrawerChangeReason, DrawerRef } from './Drawer.model'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'prokodo/common/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    anchor: {
      control: { type: 'inline-radio' },
      options: ['left', 'right', 'top', 'bottom'],
      defaultValue: 'left',
    },
    fullscreen: { control: 'boolean', defaultValue: false },
    closeOnBackdropClick: { control: 'boolean', defaultValue: true },
    // We’ll log onChange calls in the Actions panel:
    onChange: { action: 'onChange' },
    open: { control: 'boolean' },
    containerClassName: { control: 'text' },
    className: { control: 'text' },
    renderHeader: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const renderContainer = (children) => (
  <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)"
  }}>{children}</div>
)

//
// A small wrapper component that holds a ref to <Drawer> and provides
// an “Open Drawer” button.  Use <DrawerWithRef> in our stories.
//
const DrawerWithRef: FC<DrawerProps> = (args) => {
  const drawerRef = useRef<DrawerRef | null>(null)
  const [isOpen, setIsOpen] = useState(args.open ?? false)

  // Whenever the “open” arg changes, sync local state:
  if (args.open !== isOpen) {
    setIsOpen(Boolean(args.open))
  }

  // Called when Drawer dispatches a close event:
  const handleChange = (e: unknown, reason: DrawerChangeReason) => {
    setIsOpen(false)
    args.onChange?.(e, reason)
  }

  return (
    <Fragment>
      {renderContainer(
        <Button
          title="Open Drawer"
          onClick={() => {
            drawerRef.current?.openDrawer()
          }}
        />
      )}
      <Drawer
        {...args}
        ref={drawerRef}
        open={isOpen}
        onChange={handleChange}
      >
        <div style={{ padding: '1rem' }}>
          <h3>Drawer Content</h3>
          <p>
            This is sample content inside the drawer. Adjust “Anchor” and “Fullscreen” controls
            in the Storybook panel to see different behaviors.
          </p>
          <Button
            title="Close Drawer"
            onClick={() => drawerRef.current?.closeDrawer()}
          />
        </div>
      </Drawer>
    </Fragment>
  )
}

//
// 1) Default story: left‐anchored, not fullscreen, close on backdrop
//
export const Default: Story = {
  args: {
    open: false,
    anchor: 'left',
    fullscreen: false,
    closeOnBackdropClick: true,
    // onChange is handled by Storybook’s Actions panel
  },
  render: (args) => <DrawerWithRef {...args} />,
}

//
// 2) FullscreenTop story: opens fullscreen from top
//
export const FullscreenTop: Story = {
  args: {
    open: true,
    anchor: 'top',
    fullscreen: true,
    closeOnBackdropClick: true,
  },
  render: (args) => {
    const drawerRef = useRef<DrawerRef | null>(null)
    const [isOpen, setIsOpen] = useState(true)

    const handleChange = (e: unknown, reason: DrawerChangeReason) => {
      setIsOpen(false)
      args.onChange?.(e, reason)
    }

    return (
      <Fragment>
        {renderContainer(
          <Button
            title="Toggle Fullscreen Top Drawer"
            onClick={() => drawerRef.current?.openDrawer()}
          />
        )}
        <Drawer
          {...args}
          ref={drawerRef}
          fullscreen
          anchor="top"
          open={isOpen}
          onChange={handleChange}
        >
          <div style={{ padding: '2rem' }}>
            <h2>Fullscreen Top Drawer</h2>
            <p>
              This drawer is <code>fullscreen</code> and anchored at <code>top</code>.
            </p>
            <Button
              title="Close"
              onClick={() => drawerRef.current?.closeDrawer()}
            />
          </div>
        </Drawer>
      </Fragment>
    )
  },
}

//
// 3) Right‐anchored, non‐fullscreen, backdrop clicks disabled
//
export const RightDisabledBackdrop: Story = {
  args: {
    open: false,
    anchor: 'right',
    fullscreen: false,
    closeOnBackdropClick: false,
  },
  render: (args) => {
    const drawerRef = useRef<DrawerRef | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const handleChange = (e: unknown, reason: DrawerChangeReason) => {
      setIsOpen(false)
      args.onChange?.(e, reason)
    }

    return (
      <Fragment>
        {renderContainer(
          <Button
            title="Open Right Drawer"
            onClick={() => drawerRef.current?.openDrawer()}
          />
        )}
        <Drawer
          {...args}
          ref={drawerRef}
          anchor="right"
          closeOnBackdropClick={false}
          fullscreen={false}
          open={isOpen}
          onChange={handleChange}
        >
          <div style={{ padding: '1rem' }}>
            <h3>Right Drawer (Backdrop Disabled)</h3>
            <p>You must click the “×” icon or the Close button below to dismiss.</p>
            <Button
              title="Close"
              onClick={() => drawerRef.current?.closeDrawer()}
            />
          </div>
        </Drawer>
      </Fragment>
    )
  },
}
