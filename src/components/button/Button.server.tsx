import { create } from '@/helpers/bem'

import { Icon } from '../icon'
import { Link } from '../link'

import styles from './Button.module.scss'

import type { ButtonProps, ButtonDefaultProps } from './Button.model'
import type { JSX } from 'react'

const bem = create(styles, 'Button')

export default function ButtonServer(props: ButtonProps):JSX.Element {
  const {
    fullWidth,
    color = 'primary',
    iconProps = {},
    variant = 'contained',
    className,
    contentClassName,
    disabled,
    redirect,
  } = props

  const isOutlined = variant === 'outlined'
  const iconName = iconProps?.name
  const isIconOnly = iconName && !(props as ButtonDefaultProps)?.title

  const iconModifier = {
    'icon-only': Boolean(isIconOnly),
  }

  const renderInnerContent = () => (
    <span className={bem('title')}>
      {iconName && <Icon className={bem('icon', iconModifier)} {...iconProps} />}
      {(props as ButtonDefaultProps)?.title}
    </span>
  )

  const renderVariant = () =>
    isOutlined ? (
      <div className={bem('content', iconModifier, contentClassName)}>
        {renderInnerContent()}
      </div>
    ) : (
      renderInnerContent()
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
      >
        {renderVariant()}
      </Link>
    )
  }

  return (
    <button
      disabled={Boolean(disabled)}
      type="button"
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
