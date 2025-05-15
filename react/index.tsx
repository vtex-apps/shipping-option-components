/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react'
import { usePixelEventCallback } from 'vtex.pixel-manager'
import { useIntl } from 'react-intl'

import { useShippingOptionState, useShippingOptionDispatch } from './context'
import ShippingSelectionModal from './components/ShippingSelectionModal'
import DeliveryModalButton from './components/ShippingSelectionModal/DeliveryModalButton'
import { SHIPPING_MODAL_PIXEL_EVENT_ID } from './constants'
import LocationModal from './components/LocationModal'
import ShippingOptionButton from './components/ShippingOptionButton'
import messages from './messages'
import PickupModal from './components/PickupModal'
import PinIcon from './components/PinIcon'
import PickupIcon from './components/ShippingSelectionModal/PickupIcon'

interface Props {
  hideStoreSelection?: boolean
  callToAction?: CallToAction
  dismissible?: boolean
  shippingSelection?: ShippingSelection
  mode?: Mode
}

function ShippingOptionZipcode({
  compactMode = false,
  callToAction = 'popover-input',
  dismissible = false,
  shippingSelection,
  mode = 'default',
}: Props) {
  const intl = useIntl()
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false)
  const [isPickupModalOpen, setIsPickupModalOpen] = useState<boolean>(false)
  const [
    wasLocationModalOpenedByEvent,
    setWasLocationModalOpenedByEvent,
  ] = useState<boolean>(false)

  const {
    zipcode: selectedZipcode,
    pickups,
    selectedPickup,
    isLoading,
    shippingOption,
    addressLabel,
    submitErrorMessage,
  } = useShippingOptionState()

  const dispatch = useShippingOptionDispatch()

  const onSubmit = (zipcode: string, reload?: boolean) => {
    dispatch({
      type: 'UPDATE_ZIPCODE',
      args: { zipcode, reload },
    })
  }

  const onSelectPickup = (pickup: Pickup, shouldPersistFacet?: boolean) => {
    dispatch({
      type: 'UPDATE_PICKUP',
      args: { pickup, shouldPersistFacet },
    })
  }

  const onDeliverySelection = () => {
    dispatch({
      type: 'SELECT_DELIVERY_SHIPPING_OPTION',
    })
  }

  usePixelEventCallback({
    eventId: SHIPPING_MODAL_PIXEL_EVENT_ID,
    handler: () => {
      if (selectedZipcode) {
        setIsShippingModalOpen(true)
      } else {
        setWasLocationModalOpenedByEvent(true)
        setIsLocationModalOpen(true)
      }
    },
  })

  useEffect(() => {
    const isModalOpen =
      !isLoading && !selectedZipcode && callToAction === 'modal'

    if (isModalOpen) {
      setIsLocationModalOpen(true)
    }
  }, [callToAction, selectedZipcode, isLoading])

  useEffect(() => {
    if (wasLocationModalOpenedByEvent && selectedZipcode) {
      setIsLocationModalOpen(false)
      setIsShippingModalOpen(true)
    }
  }, [selectedZipcode, wasLocationModalOpenedByEvent])

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
        selectedZipcode={selectedZipcode}
        onSubmit={onSubmit}
        inputErrorMessage={submitErrorMessage}
        callToAction={callToAction}
        mode={mode}
        icon={<PinIcon filled={false} width={20} height={20} />}
      />

      {selectedZipcode && showDeliveryModalButton && (
        <DeliveryModalButton
          onClick={() => setIsShippingModalOpen(true)}
          selectedShipping={shippingOption}
          selectedPickup={selectedPickup}
          loading={isLoading}
        />
      )}

      {selectedZipcode && showPickupButton && (
        <ShippingOptionButton
          onClick={() => setIsPickupModalOpen(true)}
          loading={isLoading}
          value={selectedPickup?.pickupPoint.friendlyName}
          placeholder={intl.formatMessage(messages.storeButtonPlaceHolder)}
          mode={mode}
          icon={<PickupIcon width={20} height={20} />}
        />
      )}

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSubmit={async (zipcode: string) => {
          const shouldReload = !wasLocationModalOpenedByEvent

          onSubmit(zipcode, shouldReload)
        }}
        isLoading={isLoading}
        inputErrorMessage={submitErrorMessage}
        selectedZipcode={selectedZipcode}
        nonDismissibleModal={
          (!dismissible && !selectedZipcode) ||
          (wasLocationModalOpenedByEvent && !selectedZipcode)
        }
      />

      <ShippingSelectionModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        selectedShipping={shippingOption}
        onDeliverySelection={() => {
          onDeliverySelection()
          setIsShippingModalOpen(false)
        }}
        pickupProps={{
          onSelectPickup,
          onSubmit: (value) => onSubmit(value, false),
          pickups,
          inputErrorMessage: submitErrorMessage,
          selectedPickup,
          selectedZipcode,
          isLoading,
        }}
        nonDismissibleModal={
          (!dismissible && !shippingOption) ||
          (wasLocationModalOpenedByEvent && !shippingOption)
        }
      />

      <PickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        pickupProps={{
          onSelectPickup,
          onSubmit: (value) => onSubmit(value, false),
          pickups,
          inputErrorMessage: submitErrorMessage,
          selectedPickup,
          selectedZipcode,
          isLoading,
        }}
      />
    </>
  )
}

export default ShippingOptionZipcode
