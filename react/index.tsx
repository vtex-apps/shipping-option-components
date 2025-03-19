/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react'
import { usePixelEventCallback } from 'vtex.pixel-manager'
import { useIntl } from 'react-intl'

import useShippingOptions from './hooks/useShippingOptions'
import ShippingSelectionModal from './components/ShippingSelectionModal'
import DeliveryModalButton from './components/ShippingSelectionModal/DeliveryModalButton'
import {
  SHIPPING_MODAL_PIXEL_EVENT_ID,
  DELIVER_DRAWER_PIXEL_EVENT_ID,
} from './constants'
import PikcupDrawer from './components/PickupDrawer'
import { LocationModal } from './components/LocationModal'
import ShippingOptionButton from './components/ShippingOptionButton'
import messages from './messages'

interface Props {
  hideStoreSelection?: boolean
  compactMode?: boolean
  overlayType?: OverlayType
  enabled: boolean
}

function ShippingOptionZipCode({
  compactMode = false,
  overlayType = 'popover-input',
  hideStoreSelection = false,
  enabled,
}: Props) {
  const intl = useIntl()
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false)
  const [
    wasLocationModalOpenedByEvent,
    setWasLocationModalOpenedByEvent,
  ] = useState<boolean>(false)

  const [
    wasShippingModalOpenedByEvent,
    setWasShippingModalOpenedByEvent,
  ] = useState<boolean>(false)

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
    geoCoordinates,
    shippingOption,
  } = useShippingOptions()

  usePixelEventCallback({
    eventId: SHIPPING_MODAL_PIXEL_EVENT_ID,
    handler: () => {
      if (selectedZipCode) {
        setIsShippingModalOpen(true)
        setWasShippingModalOpenedByEvent(true)
      } else {
        setWasLocationModalOpenedByEvent(true)
        setIsLocationModalOpen(true)
      }
    },
  })

  usePixelEventCallback({
    eventId: DELIVER_DRAWER_PIXEL_EVENT_ID,
    handler: () => setIsLocationModalOpen(true),
  })

  useEffect(() => {
    if (selectedZipCode === null && overlayType === 'blocking-modal') {
      setIsLocationModalOpen(true)
    }
  }, [selectedZipCode, overlayType])

  const isBlockingModal =
    overlayType === 'blocking-modal' && !isFirstLoading && !selectedZipCode

  if (!enabled) {
    return null
  }

  return (
    <>
      {selectedZipCode && (
        <DeliveryModalButton
          onClick={() => {
            setWasShippingModalOpenedByEvent(false)
            setIsShippingModalOpen(true)
          }}
          selectedShipping={shippingOption}
          selectedPickup={selectedPickup}
          loading={isLoading}
        />
      )}

      <ShippingOptionButton
        onClick={() => {
          setWasLocationModalOpenedByEvent(false)
          setIsLocationModalOpen(true)
        }}
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
      <div style={{ display: 'none' }}>
        <PikcupDrawer
          isLoading={isLoading}
          onChange={onChange}
          onSubmit={() => onSubmit(false)}
          inputErrorMessage={inputErrorMessage}
          selectedZipCode={selectedZipCode}
          zipCode={zipCode}
          pickups={pickups}
          selectedPickup={selectedPickup}
          onSelectPickup={onSelectPickup}
          compact={compactMode}
          hideStoreSelection={hideStoreSelection}
        />
      </div>

      <LocationModal
        isOpen={isLocationModalOpen || isBlockingModal}
        onClose={() => setIsLocationModalOpen(false)}
        onChange={onChange}
        onSubmit={async () => {
          const shouldReload = !wasLocationModalOpenedByEvent

          await onSubmit(shouldReload)

          if (!shouldReload) {
            setIsLocationModalOpen(false)
            setIsShippingModalOpen(true)
          }
        }}
        isLoading={isLoading}
        inputErrorMessage={inputErrorMessage}
        zipCode={zipCode}
        showCloseButton={!isBlockingModal}
      />

      <ShippingSelectionModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        geoCoordinates={geoCoordinates}
        selectedShipping={shippingOption}
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
        showCloseButton={!wasShippingModalOpenedByEvent}
      />
    </>
  )
}

ShippingOptionZipCode.schema = {
  title: 'Seletor de localização',
}

export default ShippingOptionZipCode
