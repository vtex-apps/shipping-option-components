import React from 'react'
import { useIntl } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'

import ShippingOptionDrawer from './ShippingOptionDrawer'
import ShippingOptionButton from './ShippingOptionButton'
import DeliverySelection from './DeliverySelection'
import { DELIVER_DRAWER_PIXEL_EVENT_ID } from '../constants'
import messages from '../messages'

interface Props {
  isLoading: boolean
  addressLabel?: string
  onSubmit: () => void
  inputErrorMessage?: string
  onChange: (zipCode?: string) => void
  zipCode?: string
  selectedZipCode?: string
  compact: boolean
  overlayType?: OverlayType
}

const DeliveryDrawer = ({
  addressLabel,
  isLoading,
  onChange,
  onSubmit,
  inputErrorMessage,
  selectedZipCode,
  zipCode,
  compact,
  overlayType,
}: Props) => {
  const intl = useIntl()
  const { push } = usePixel()

  const onOpen = () => {
    push({
      id: DELIVER_DRAWER_PIXEL_EVENT_ID,
    })
  }

  return (
    <ShippingOptionDrawer
      icon={
        <ShippingOptionButton
          onClick={onOpen}
          loading={isLoading}
          value={addressLabel}
          placeholder={intl.formatMessage(messages.deliverToButtonPlaceholder)}
          label={intl.formatMessage(messages.deliverToButtonLabel)}
          compact={compact}
          zipCode={zipCode}
          onChange={onChange}
          onSubmit={onSubmit}
          inputErrorMessage={inputErrorMessage}
          overlayType={overlayType}
        />
      }
      title={intl.formatMessage(messages.storeDeliverDrawerTitle)}
      customPixelEventId={DELIVER_DRAWER_PIXEL_EVENT_ID}
      onSubmit={onSubmit}
      inputErrorMessage={inputErrorMessage}
      isLoading={isLoading}
    >
      <DeliverySelection
        isLoading={isLoading}
        onChange={onChange}
        onSubmit={onSubmit}
        inputErrorMessage={inputErrorMessage}
        selectedZipCode={selectedZipCode}
        zipCode={zipCode}
      />
    </ShippingOptionDrawer>
  )
}

export default DeliveryDrawer
