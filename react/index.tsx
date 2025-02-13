/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react'
import { useSSR, useRuntime } from 'vtex.render-runtime'

import useShippingOptions from './hooks/useShippingOptions'
import DeliveryDrawer from './components/DeliveryDrawer'
import PikcupDrawer from './components/PickupDrawer'
import { getCookie } from './utils/cookie'

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
  const [shouldRender, setShouldRender] = useState<boolean>(!production)

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

  const isSSR = useSSR()

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
