/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react'
import { useSSR, useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import { usePixelEventCallback } from 'vtex.pixel-manager'

import useShippingOptions from './hooks/useShippingOptions'
// import DeliveryDrawer from './components/DeliveryDrawer'
import PikcupDrawer from './components/PickupDrawer'
import { getCookie } from './utils/cookie'
import { LocationModal } from './components/LocationModal'
import ShippingOptionButton from './components/ShippingOptionButton'
import messages from './messages'
import { DELIVER_DRAWER_PIXEL_EVENT_ID } from './constants'

interface Props {
  hideStoreSelection?: boolean
  compactMode?: boolean
  overlayType?: OverlayType
}

function ShippingOptionZipCode({
  hideStoreSelection = false,
  compactMode = false,
  overlayType = 'popover-input',
}: Props) {
  const { production } = useRuntime()
  const intl = useIntl()
  const [shouldRender, setShouldRender] = useState<boolean>(!production)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false)

  const {
    inputErrorMessage,
    zipCode,
    isLoading,
    isFirstLoading,
    onSubmit,
    addressLabel,
    onChange,
    selectedZipCode,
    pickups,
    selectedPickup,
    onSelectPickup,
  } = useShippingOptions()

  const isSSR = useSSR()

  usePixelEventCallback({
    eventId: DELIVER_DRAWER_PIXEL_EVENT_ID,
    handler: () => setIsLocationModalOpen(true),
  })

  useEffect(() => {
    if (!isSSR) {
      return
    }

    const variant = getCookie('sp-variant')

    if (production && variant && variant.indexOf('delivery_promises') > -1) {
      setShouldRender(true)
    }
  }, [production, isSSR])

  if (!shouldRender) {
    return null
  }

  const isBlockingModal =
    overlayType === 'blocking-modal' && !isFirstLoading && !selectedZipCode

  return (
    <>
      <LocationModal
        isOpen={isLocationModalOpen || isBlockingModal}
        onClose={() => setIsLocationModalOpen(false)}
        onChange={onChange}
        onSubmit={onSubmit}
        isLoading={isLoading}
        inputErrorMessage={inputErrorMessage}
        zipCode={zipCode}
        showCloseButton={!isBlockingModal}
      />

      <ShippingOptionButton
        onClick={() => setIsLocationModalOpen(true)}
        loading={isLoading}
        value={addressLabel}
        placeholder={intl.formatMessage(messages.deliverToButtonPlaceholder)}
        label={intl.formatMessage(messages.deliverToButtonLabel)}
        compact={compactMode}
        zipCode={zipCode}
        onChange={onChange}
        onSubmit={onSubmit}
        inputErrorMessage={inputErrorMessage}
        overlayType={overlayType}
      />

      {/* <DeliveryDrawer
        addressLabel={addressLabel}
        isLoading={isLoading}
        onChange={onChange}
        onSubmit={onSubmit}
        inputErrorMessage={inputErrorMessage}
        selectedZipCode={selectedZipCode}
        zipCode={zipCode}
        compact={compactMode}
        overlayType={overlayType}
      /> */}
      <PikcupDrawer
        isLoading={isLoading}
        onChange={onChange}
        onSubmit={() => onSubmit(false)}
        addressLabel={addressLabel}
        inputErrorMessage={inputErrorMessage}
        selectedZipCode={selectedZipCode}
        zipCode={zipCode}
        pickups={pickups}
        selectedPickup={selectedPickup}
        onSelectPickup={onSelectPickup}
        compact={compactMode}
        hideStoreSelection={hideStoreSelection}
      />
    </>
  )
}

export default ShippingOptionZipCode
