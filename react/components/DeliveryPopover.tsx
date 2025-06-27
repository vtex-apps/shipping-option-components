import React, { useEffect, useState } from 'react'
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
  onSubmit: (zipcode: string) => void
  isLoading?: boolean
  inputErrorMessage?: string
  popoverStore: PopoverStore
  selectedZipcode?: string
}

const DeliveryPopover = ({
  onClick,
  variant = 'popover-input',
  onSubmit,
  isLoading,
  inputErrorMessage,
  popoverStore,
  selectedZipcode,
}: Props) => {
  const [zipcode, setZipcode] = useState<string>('')
  const [alreadyOpen, setAlreadyOpen] = useState<boolean>(false)
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()

  const isFirstLoading = !zipcode && isLoading

  const openPopover = !isFirstLoading && !selectedZipcode && !alreadyOpen

  useEffect(() => {
    if (openPopover) {
      popoverStore.setOpen(true)
      setAlreadyOpen(true)
    }
  }, [openPopover, popoverStore])

  const handlePopoverClick = () => {
    onClick()
    popoverStore.setOpen(false)
  }

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
        <Button onClick={handlePopoverClick}>
          {intl.formatMessage(messages.popoverButtonLabel)}
        </Button>
      ) : (
        <div className={`${handles.popoverInputContainer} flex`}>
          <PostalCodeInput
            onChange={(value: string) => setZipcode(value)}
            zipcode={zipcode}
            onSubmit={onSubmit}
            errorMessage={inputErrorMessage}
            showClearButton={false}
            placeholder={intl.formatMessage(
              messages.popoverPostalCodeInputPlaceHolder
            )}
          />
          <Button isLoading={isLoading} onClick={() => onSubmit(zipcode)}>
            {intl.formatMessage(messages.popoverSubmitButtonLabel)}
          </Button>
        </div>
      )}

      <PopoverArrow className="deliveryPopoverArrow" />
    </Popover>
  )
}

export default DeliveryPopover
