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
  STORE_DRAWER_PIXEL_EVENT_ID,
} from './constants'
import { LocationModal } from './components/LocationModal'
import ShippingOptionButton from './components/ShippingOptionButton'
import messages from './messages'
import PickupModal from './components/PickupModal'

interface Props {
  hideStoreSelection?: boolean
  compactMode?: boolean
  callToAction?: CallToAction
  dismissible?: boolean
  shippingSelection?: ShippingSelection
  countryCode: string
}

function ShippingOptionZipCode({
  compactMode = false,
  callToAction = 'popover-input',
  dismissible = false,
  shippingSelection,
  countryCode,
}: Props) {
  const intl = useIntl()
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false)
  const [isPickupModalOpen, setisPickupModalOpen] = useState<boolean>(false)
  const [
    wasLocationModalOpenedByEvent,
    setWasLocationModalOpenedByEvent,
  ] = useState<boolean>(false)

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

  usePixelEventCallback({
    eventId: SHIPPING_MODAL_PIXEL_EVENT_ID,
    handler: () => {
      if (selectedZipCode) {
        setIsShippingModalOpen(true)
      } else {
        setWasLocationModalOpenedByEvent(true)
        setIsLocationModalOpen(true)
      }
    },
  })

  usePixelEventCallback({
    eventId: STORE_DRAWER_PIXEL_EVENT_ID,
    handler: () => {
      setisPickupModalOpen(true)
    },
  })

  usePixelEventCallback({
    eventId: DELIVER_DRAWER_PIXEL_EVENT_ID,
    handler: () => setIsLocationModalOpen(true),
  })

  useEffect(() => {
    if (selectedZipCode === null && callToAction === 'modal') {
      setIsLocationModalOpen(true)
    }
  }, [callToAction, selectedZipCode])

  const showDeliveryModalButton = shippingSelection === 'delivery-and-pickup'
  const showPickupButton = shippingSelection === 'only-pickup'

  return (
    <>
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
        callToAction={callToAction}
      />

      {selectedZipCode && showDeliveryModalButton && (
        <DeliveryModalButton
          onClick={() => setIsShippingModalOpen(true)}
          selectedShipping={shippingOption}
          selectedPickup={selectedPickup}
          loading={isLoading}
        />
      )}

      {selectedZipCode && showPickupButton && (
        <ShippingOptionButton
          onClick={() => setisPickupModalOpen(true)}
          loading={isLoading}
          value={selectedPickup?.pickupPoint.friendlyName}
          placeholder={intl.formatMessage(messages.storeButtonPlaceHolder)}
          label={intl.formatMessage(messages.storeButtonLabel)}
          compact={compactMode}
        />
      )}

      <LocationModal
        isOpen={isLocationModalOpen}
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
        nonDismissibleModal={!dismissible}
      />

      <ShippingSelectionModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        geoCoordinates={geoCoordinates}
        selectedShipping={shippingOption}
        countryCode={countryCode}
        pickupProps={{
          onChange,
          onSelectPickup,
          onSubmit: () => onSubmit(false),
          pickups,
          inputErrorMessage,
          selectedPickup,
          selectedZipCode,
          zipCode,
          isLoading,
        }}
      />

      <PickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setisPickupModalOpen(false)}
        pickupProps={{
          onChange,
          onSelectPickup,
          onSubmit: () => onSubmit(false),
          pickups,
          inputErrorMessage,
          selectedPickup,
          selectedZipCode,
          zipCode,
          isLoading,
        }}
      />
    </>
  )
}

export default ShippingOptionZipCode
