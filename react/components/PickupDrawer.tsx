import React from 'react'
import { useIntl } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'

import ShippingOptionDrawer from './ShippingOptionDrawer'
import ShippingOptionButton from './ShippingOptionButton'
import { STORE_DRAWER_PIXEL_EVENT_ID } from '../constants'
import messages from '../messages'
import PickupSelection from './PickupSelection'

interface Props {
  isLoading: boolean
  addressLabel?: string
  onSubmit: () => void
  inputErrorMessage?: string
  onChange: (zipCode?: string) => void
  zipCode?: string
  selectedZipCode?: string
  selectedPickup?: Pickup
  pickups: Pickup[]
  onSelectPickup: (pickup: Pickup) => void
  compact: boolean
}

const PikcupDrawer = ({
  addressLabel,
  isLoading,
  onChange,
  onSubmit,
  inputErrorMessage,
  selectedZipCode,
  zipCode,
  pickups,
  selectedPickup,
  onSelectPickup,
  compact,
}: Props) => {
  const intl = useIntl()
  const { push } = usePixel()

  const onOpen = () => {
    push({
      id: STORE_DRAWER_PIXEL_EVENT_ID,
    })
  }

  const drawerTitleMessage =
    pickups.length > 0
      ? messages.pickupDrawerTitleFilled
      : messages.pickupDrawerTitleEmpty

  const storeLabel = selectedPickup
    ? selectedPickup.pickupPoint.friendlyName
    : undefined

  return (
    <ShippingOptionDrawer
      icon={
        <ShippingOptionButton
          onClick={onOpen}
          loading={isLoading}
          value={storeLabel}
          placeholder={intl.formatMessage(messages.storeButtonPlaceHolder)}
          label={intl.formatMessage(messages.storeButtonLabel)}
          compact={compact}
        />
      }
      title={intl.formatMessage(drawerTitleMessage)}
      customPixelEventId={STORE_DRAWER_PIXEL_EVENT_ID}
      onSubmit={onSubmit}
      inputErrorMessage={inputErrorMessage}
      isLoading={isLoading}
    >
      <PickupSelection
        isLoading={isLoading}
        onChange={onChange}
        onSubmit={onSubmit}
        addressLabel={addressLabel}
        inputErrorMessage={inputErrorMessage}
        selectedZipCode={selectedZipCode}
        zipCode={zipCode}
        pickups={pickups}
        selectedPickup={selectedPickup}
        onSelectPickup={onSelectPickup}
      />
    </ShippingOptionDrawer>
  )
}

export default PikcupDrawer
