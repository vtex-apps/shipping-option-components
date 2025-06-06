import React from 'react'
import { Popover, PopoverArrow, PopoverStore } from '@ariakit/react'
import { useIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import PostalCodeInput from './PostalCodeInput'
import messages from '../messages'
import PostalCodeHelpLink from './PostalCodeHelpLink'

const CSS_HANDLES = [
  'deliveryPopover',
  'deliveryPopoverText',
  'deliveryPopoverArrow',
  'popoverInputContainer',
] as const

interface Props {
  onClick: () => void
  variant?: 'popover-button' | 'popover-input'
  onChange: (zipCode?: string) => void
  onSubmit: () => void
  isLoading?: boolean
  inputErrorMessage?: string
  zipCode?: string
  popoverStore: PopoverStore
}

const DeliveryPopover = ({
  onClick,
  variant = 'popover-input',
  onChange,
  onSubmit,
  isLoading,
  inputErrorMessage,
  zipCode,
  popoverStore,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()

  return (
    <Popover
      className={handles.deliveryPopover}
      hideOnInteractOutside
      autoFocusOnShow={false}
      store={popoverStore}
    >
      <p className={`${handles.deliveryPopoverText} ma0`}>
        {`${intl.formatMessage(messages.popoverDescription)} `}
        <PostalCodeHelpLink />
      </p>

      {variant === 'popover-button' ? (
        <Button onClick={onClick}>
          {intl.formatMessage(messages.popoverButtonLabel)}
        </Button>
      ) : (
        <div className={`${handles.popoverInputContainer} flex`}>
          <PostalCodeInput
            zipCode={zipCode}
            onSubmit={onSubmit}
            errorMessage={inputErrorMessage}
            onChange={onChange}
            showClearButton={false}
            placeholder={intl.formatMessage(
              messages.popoverPostalCodeInputPlaceHolder
            )}
          />
          <Button isLoading={isLoading} onClick={onSubmit}>
            {intl.formatMessage(messages.popoverSubmitButtonLabel)}
          </Button>
        </div>
      )}

      <PopoverArrow className="deliveryPopoverArrow" />
    </Popover>
  )
}

export default DeliveryPopover
