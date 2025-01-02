/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react'
import { useSSR, useRuntime } from 'vtex.render-runtime'
import { usePixelEventCallback } from 'vtex.pixel-manager'

import useShippingOptions from './hooks/useShippingOptions'
import DeliveryDrawer from './components/DeliveryDrawer'
// import PikcupDrawer from './components/PickupDrawer'
import { getCookie } from './utils/cookie'
import ShippingSelectionModal from './components/ShippingSelectionModal'
import DeliveryModalButton from './components/ShippingSelectionModal/DeliveryModalButton'
import { SHIPPING_MODAL_PIXEL_EVENT_ID } from './constants'

interface Props {
  hideStoreSelection?: boolean
  compactMode?: boolean
  overlayType?: OverlayType
}

function ShippingOptionZipCode({
  // hideStoreSelection = false,
  compactMode = false,
  overlayType = 'popover-input',
}: Props) {
  const { production } = useRuntime()
  const [shouldRender, setShouldRender] = useState<boolean>(!production)
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false)

  const {
    inputErrorMessage,
    zipCode,
    isLoading,
    onSubmit,
    addressLabel,
    onChange,
    selectedZipCode,
    pickups,
    selectedPickup,
    onSelectPickup,
    geoCoordinates,
    shippingOption,
  } = useShippingOptions()

  const isSSR = useSSR()

  usePixelEventCallback({
    eventId: SHIPPING_MODAL_PIXEL_EVENT_ID,
    handler: () => setIsShippingModalOpen(true),
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

  return (
    <>
      {selectedZipCode && (
        <DeliveryModalButton
          onClick={() => setIsShippingModalOpen(true)}
          selectedShipping={shippingOption}
          selectedPickup={selectedPickup}
          loading={isLoading}
        />
      )}
      <DeliveryDrawer
        addressLabel={addressLabel}
        isLoading={isLoading}
        onChange={onChange}
        onSubmit={onSubmit}
        inputErrorMessage={inputErrorMessage}
        selectedZipCode={selectedZipCode}
        zipCode={zipCode}
        compact={compactMode}
        overlayType={overlayType}
      />
      {/* {!hideStoreSelection && (
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
        />
      )} */}
      <ShippingSelectionModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        geoCoordinates={geoCoordinates}
        pickupProps={{
          isLoading,
          onChange,
          onSelectPickup,
          onSubmit: () => onSubmit(false),
          pickups,
          addressLabel,
          inputErrorMessage,
          selectedPickup,
          selectedZipCode,
          zipCode,
        }}
      />
    </>
  )
}

export default ShippingOptionZipCode
