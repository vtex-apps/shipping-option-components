import React from 'react'

import LocationModal from './components/LocationModal'
import { useShippingOptionDispatch, useShippingOptionState } from './context'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const LocationModalWithContext = ({ isOpen, onClose }: Props) => {
  const {
    zipcode: selectedZipcode,
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

  return (
    <LocationModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
      inputErrorMessage={submitErrorMessage}
      selectedZipcode={selectedZipcode}
    />
  )
}

export default LocationModalWithContext
