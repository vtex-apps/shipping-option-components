/* eslint-disable no-restricted-globals */
import React from 'react'

import useShippingOptions from './hooks/useShippingOptions'
import DeliveryDrawer from './components/DeliveryDrawer'
import PikcupDrawer from './components/PickupDrawer'

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
  } = useShippingOptions()

  return (
    <>
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
