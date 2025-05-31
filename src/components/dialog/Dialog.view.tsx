import { Button } from '@/components/button'
import { Headline } from '@/components/headline'
import { create } from '@/helpers/bem'
import type { DialogViewProps } from './Dialog.model'
import styles from './Dialog.module.scss'

const bem = create(styles, 'Dialog')

export function DialogView({
  open,
  title,
  hideTitle = false,
  renderHeader,
  hideCloseButton = false,
  translations,
  actions = [],
  contentProps = {},
  contentRef,
  containerChildren,
  className,
  classNameHeader,
  scroll = 'paper',
  fullScreen = false,
  titleProps = {},
  children,
  onClose,
  wrapperProps,
  closeOnBackdropClick = true,
  closeButtonProps,
  closeButtonRef,
  containerRef,
  ...rest
}: DialogViewProps) {
  // Modifikatoren für den Container (innen)
  const containerMods = {
    fullScreen,
    [`scroll-${scroll}`]: true,
  }
  // Modifikatoren für Wrapper (Animation)
  const wrapperMods = {
    fullScreen,
    'is-visible': Boolean(open),
  }

  const renderDialog = () => (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-content"
      className={bem(undefined, wrapperMods, className)}
      {...rest}
    >
      <div className={bem('container', containerMods)}>
        <div className={bem('header', undefined, classNameHeader)}>
          <div>
            <Headline
              {...titleProps}
              id="dialog-title"
              className={bem('title', { 'is-hidden': hideTitle })}
            >
              {title}
            </Headline>
            {renderHeader?.()}
          </div>

          {!Boolean(hideCloseButton) && (
            <Button
              aria-label={translations?.close}
              color="inherit"
              variant="outlined"
              iconProps={{ name: 'Cancel01Icon', size: 'sm' }}
              {...closeButtonProps}
              title={translations?.close ?? "Close"}
              ref={closeButtonRef}
              onClick={onClose}
            />
          )}
        </div>

        {/* Focus-Trap Sentinel */}
        <div tabIndex={0} aria-hidden="true" />

        <div
          {...contentProps}
          id="dialog-content"
          ref={contentRef}
          className={bem(
            'content',
            { [`scroll-${scroll}`]: true },
            contentProps.className
          )}
        >
          {children}
        </div>

        {actions.length > 0 && (
          <div className={bem('actions')}>
            <div tabIndex={0} aria-hidden="true" />
            {actions.map((action) => (
              <Button key={action.id} {...action} title={action?.title ?? ""} />
            ))}
            <div tabIndex={0} aria-hidden="true" />
          </div>
        )}
      </div>

      {containerChildren}
    </div>
  )

  if (!closeOnBackdropClick || fullScreen) return renderDialog()
  return (
    <div
      className={bem('backdrop', { 'is-visible': Boolean(open) })}
      {...wrapperProps}
    >
      {renderDialog()}
    </div>
  )
}
