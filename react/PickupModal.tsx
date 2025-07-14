import React from 'react'

import PickupModal from './components/PickupModal'
import { useShippingOptionDispatch, useShippingOptionState } from './context'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const PickupModalWithContext = ({ isOpen, onClose }: Props) => {
  const {
    zipcode: selectedZipcode,
    pickups,
    selectedPickup,
    isLoading,
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

  return (
    <PickupModal
      isOpen={isOpen}
      onClose={onClose}
      pickupProps={{
        onSelectPickup,
        onSubmit: (value) => onSubmit(value, false),
        pickups,
        inputErrorMessage: submitErrorMessage?.message,
        selectedPickup,
        selectedZipcode,
        isLoading,
      }}
    />
  )
}

export default PickupModalWithContext
