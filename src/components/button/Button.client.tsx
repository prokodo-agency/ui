'use client'

import { type JSX, useMemo, useRef, useId } from 'react'

import { create } from '@/helpers/bem'
import { isString } from '@/helpers/validations'

import { Icon } from '../icon'
import { Link } from '../link'
import { Loading } from '../loading'

import styles from './Button.module.scss'

import type { ButtonProps, ButtonDefaultProps } from './Button.model'

const bem = create(styles, 'Button')

const mockEvent = {} as React.MouseEvent<HTMLButtonElement>
const mockKeyDownEvent = {} as React.KeyboardEvent<HTMLButtonElement>

export default function ButtonClient(props: ButtonProps): JSX.Element {
  const {
    id,
    fullWidth,
    color = 'primary',
    iconProps = {},
    loading,
    variant = 'contained',
    className,
    contentClassName,
    disabled,
    redirect,
    onClick,
    onKeyDown,
    ...rest
  } = props

  const uniqueId = useId()
  const labelRef = useRef<HTMLSpanElement | null>(null)
  const ariaLabelId = `Button-${uniqueId}`
  const isOutlined = variant === 'outlined'
  const iconName = iconProps?.name
  const isIconOnly = iconName && !(props as ButtonDefaultProps)?.title

  const iconModifier = useMemo(
    () => ({
      'icon-only': Boolean(isIconOnly),
    }),
    [isIconOnly]
  )

  const renderInnerContent = () => (
    <span ref={labelRef} aria-labelledby={ariaLabelId} className={bem('title')}>
      {iconName && <Icon className={bem('icon', iconModifier)} {...iconProps} />}
      {(props as ButtonDefaultProps)?.title}
    </span>
  )

  const renderContent = () =>
    Boolean(loading) ? <Loading size="xs" /> : renderInnerContent()

  const renderVariant = () =>
    isOutlined ? (
      <div className={bem('content', iconModifier, contentClassName)}>
        {renderContent()}
      </div>
    ) : (
      renderContent()
    )

  if (redirect) {
    return (
      <Link
        disabled={disabled}
        href={redirect.href}
        className={bem(
          undefined,
          {
            'has-fullWidth': Boolean(fullWidth),
            [`has-variant-${variant}`]: true,
            [`has-bg-${color}`]: variant === 'contained',
            [`has-text-${color}`]: variant === 'text',
            'is-disabled': Boolean(disabled),
            ...iconModifier,
          },
          className
        )}
        onClick={() => onClick?.(mockEvent)}
        onKeyDown={() => onKeyDown?.(mockKeyDownEvent)}
      >
        {renderVariant()}
      </Link>
    )
  }

  return (
    <button
      {...rest}
      color={color}
      disabled={Boolean(disabled) || Boolean(loading)}
      id={`${ariaLabelId}${isString(id) ? ` ${id}` : ''}`}
      tabIndex={redirect !== undefined || Boolean(disabled) ? -1 : rest.tabIndex}
      className={bem(
        undefined,
        {
          'has-fullWidth': Boolean(fullWidth),
          [`has-variant-${variant}`]: true,
          [`has-bg-${color}`]: variant === 'contained',
          [`has-text-${color}`]: variant === 'text',
          'is-disabled': Boolean(disabled),
          ...iconModifier,
        },
        className
      )}
    >
      {renderVariant()}
    </button>
  )
}
