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
import UnavailableItemsModal from './components/UnavailableItemsModal'

type OpenModal =
  | 'location'
  | 'shipping-selection'
  | 'unavailable-items'
  | 'pickup'
  | null

interface Props {
  hideStoreSelection?: boolean
  compactMode?: boolean
  callToAction?: CallToAction
  dismissible?: boolean
  shippingSelection?: ShippingSelection
}

function ShippingOptionZipCode({
  compactMode = false,
  callToAction = 'popover-input',
  dismissible = false,
  shippingSelection = 'only-pickup',
}: Props) {
  const intl = useIntl()
  const [openModal, setOpenModal] = useState<OpenModal>(null)

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
    countryCode,
    unavailableCartItems,
    removeUnavailableItems,
  } = useShippingOptions()

  usePixelEventCallback({
    eventId: SHIPPING_MODAL_PIXEL_EVENT_ID,
    handler: () => {
      if (selectedZipCode) {
        setOpenModal('shipping-selection')
      } else {
        setWasLocationModalOpenedByEvent(true)
        setOpenModal('location')
      }
    },
  })

  usePixelEventCallback({
    eventId: STORE_DRAWER_PIXEL_EVENT_ID,
    handler: () => {
      setOpenModal('pickup')
    },
  })

  usePixelEventCallback({
    eventId: DELIVER_DRAWER_PIXEL_EVENT_ID,
    handler: () => setOpenModal('location'),
  })

  useEffect(() => {
    if (selectedZipCode === null && callToAction === 'modal') {
      setOpenModal('location')
    }
  }, [callToAction, selectedZipCode])

  useEffect(() => {
    if (unavailableCartItems.length > 0) {
      setOpenModal('unavailable-items')
    }
  }, [unavailableCartItems])

  const showDeliveryModalButton = shippingSelection === 'delivery-and-pickup'
  const showPickupButton = shippingSelection === 'only-pickup'

  return (
    <>
      <ShippingOptionButton
        onClick={() => {
          setWasLocationModalOpenedByEvent(false)
          setOpenModal('location')
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
          onClick={() => setOpenModal('shipping-selection')}
          selectedShipping={shippingOption}
          selectedPickup={selectedPickup}
          loading={isLoading}
        />
      )}
      {selectedZipCode && showPickupButton && (
        <ShippingOptionButton
          onClick={() => setOpenModal('pickup')}
          loading={isLoading}
          value={selectedPickup?.pickupPoint.friendlyName}
          placeholder={intl.formatMessage(messages.storeButtonPlaceHolder)}
          label={intl.formatMessage(messages.storeButtonLabel)}
          compact={compactMode}
        />
      )}
      <LocationModal
        isOpen={openModal === 'location'}
        onClose={() => setOpenModal(null)}
        onChange={onChange}
        onSubmit={async () => {
          const shouldReload = !wasLocationModalOpenedByEvent

          const success = await onSubmit(shouldReload)

          if (!shouldReload && success) {
            setOpenModal('shipping-selection')
          }
        }}
        isLoading={isLoading}
        inputErrorMessage={inputErrorMessage}
        zipCode={zipCode}
        nonDismissibleModal={
          !dismissible && !selectedZipCode && wasLocationModalOpenedByEvent
        }
      />
      <ShippingSelectionModal
        isOpen={openModal === 'shipping-selection'}
        onClose={() => setOpenModal(null)}
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
        nonDismissibleModal={
          !dismissible && !shippingOption && wasLocationModalOpenedByEvent
        }
      />
      <PickupModal
        isOpen={openModal === 'pickup'}
        onClose={() => setOpenModal(null)}
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
      <UnavailableItemsModal
        addressLabel={addressLabel ?? ''}
        isOpen={openModal === 'unavailable-items'}
        onClose={() => setOpenModal(null)}
        onTryAgain={() => setOpenModal('location')}
        onRemoveItems={removeUnavailableItems}
        unavailableCartItems={unavailableCartItems}
      />
    </>
  )
}

export default ShippingOptionZipCode
