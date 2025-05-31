import React from 'react'
import { create } from '@/helpers/bem'
import { Button } from '@/components/button'
import { Headline } from '@/components/headline'
import type { DrawerViewProps } from './Drawer.model'
import type { FC } from 'react'
import styles from './Drawer.module.scss'

const bem = create(styles, 'Drawer')

export const DrawerView: FC<DrawerViewProps> = ({
  open,
  title,
  titleProps,
  anchor = 'left',
  fullscreen = false,
  renderHeader,
  closeButtonRef,
  closeButtonProps,
  containerRef,
  className,
  containerClassName,
  children,
  onClose,
  backdropProps,
  closeOnBackdropClick = true,
  ...rest
}) => {
  const isOpen = Boolean(open)
  return (
    <div
      className={bem('backdrop', { open: isOpen })}
      {...backdropProps}
    >
      {/* 
        Inner container: stops propagation of mousedown so clicks INSIDE
        do not bubble up to backdrop. 
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        ref={containerRef}
        className={bem(
          'container',
          {
            open: isOpen,
            [`anchor-${anchor}`]: true,
            [`anchor-${anchor}--open`]: isOpen,
            fullscreen,
          },
          containerClassName
        )}
        onMouseDown={e => e.stopPropagation()}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        <div className={bem('header')}>
          {renderHeader ? (
            renderHeader()
          ) : (
            <>
              {title && (
                <Headline size="md" {...titleProps} id="drawer-title">
                  {title}
                </Headline>
              )}
              {/* Close‐button always shown in header if no custom renderHeader */}
              <Button
                aria-label="Close drawer"
                variant="text"
                iconProps={{ name: 'Cancel01Icon', size: 'sm' }}
                {...closeButtonProps}
                ref={closeButtonRef}
                onClick={() => onClose?.('escapeKeyDown')}
              />
            </>
          )}
        </div>

        <div className={bem('content')}>{children}</div>
      </div>
    </div>
  )
}
