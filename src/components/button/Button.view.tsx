import { create } from '@/helpers/bem'

import { Icon } from '../icon'

import styles from './Button.module.scss'

import type { ButtonViewProps, ButtonDefaultProps } from './Button.model'
import type { FC } from "react"

const bem = create(styles, 'Button')

export const ButtonView: FC<ButtonViewProps> = ({
  buttonRef,
  fullWidth,
  color,
  variant,
  className,
  contentClassName,
  disabled,
  redirect,
  iconProps = {},
  isIconOnly,
  LinkComponent,
  ...rest
}) => {
  const isOutlined = variant === 'outlined'
  const iconName   = iconProps?.name
  const iconMod    = { 'icon-only': isIconOnly }
  const {title} = (rest as ButtonDefaultProps)

  const inner = (
    <>
      {iconName && <Icon className={bem('icon', iconMod)} {...iconProps} />}
      {title}
    </>
  )

  const variantNode = isOutlined ? (
    <div className={bem('content', iconMod, contentClassName)}>{inner}</div>
  ) : (
    inner
  )

  const common = {
    id: rest.id,
    'aria-label': title ?? undefined,
    className: bem(
      undefined,
      {
        'has-fullWidth': Boolean(fullWidth),
        'has-icon': !Boolean(isIconOnly),
        [`has-variant-${variant}`]: true,
        [`has-bg-${color}`]: variant === 'contained',
        [`has-text-${color}`]: variant === 'text',
        'is-disabled': Boolean(disabled),
        ...iconMod,
      },
      className,
    ),
  }

  return redirect ? (
    <LinkComponent {...common} disabled={disabled} href={redirect.href}>
      {variantNode}
    </LinkComponent>
  ) : (
    <button
      {...common}
      ref={buttonRef}
      disabled={Boolean(disabled)}
      tabIndex={Boolean(disabled) ? -1 : rest.tabIndex}
      type="button"
      {...rest}
    >
      {variantNode}
    </button>
  )
}
