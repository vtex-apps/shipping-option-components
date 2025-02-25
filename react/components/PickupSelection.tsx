import React from 'react'
import { useIntl } from 'react-intl'

import PostalCodeInput from './PostalCodeInput'
import SubmitButton from './SubmitButton'
import PickupItem from './PickupItem'
import messages from '../messages'

interface Props {
  onSubmit: (zipCode?: string) => void
  inputErrorMessage?: string
  zipCode?: string
  onChange: (zipCode?: string) => void
  addressLabel?: string | null
  selectedZipCode?: string | null
  isLoading: boolean
  pickups: Pickup[]
  selectedPickup?: Pickup
  onSelectPickup: (pickup: Pickup, shouldPersistFacet?: boolean) => void
  onClose?: () => void
  shouldPersistFacet?: boolean
}

const PickupSelection = ({
  onSubmit,
  inputErrorMessage,
  zipCode,
  onChange,
  addressLabel,
  selectedZipCode,
  isLoading,
  pickups,
  selectedPickup,
  onSelectPickup,
  onClose,
  shouldPersistFacet,
}: Props) => {
  const newZipCodeTyped = zipCode !== selectedZipCode
  const shouldHideUpdateButton = (!zipCode || !newZipCodeTyped) && !isLoading
  const intl = useIntl()

  return (
    <div className="flex flex-column justify-between mt5">
      <div className="mb7">
        <PostalCodeInput
          zipCode={zipCode}
          onSubmit={onSubmit}
          errorMessage={inputErrorMessage}
          onChange={onChange}
          addressLabel={addressLabel}
          placeholder={intl.formatMessage(messages.postalCodeInputPlaceHolder)}
          newZipCodeTyped={newZipCodeTyped}
        />
      </div>
      <div className="m-100 flex flex-column justify-center">
        {pickups.map((currentPickup) => (
          <PickupItem
            key={currentPickup.pickupPoint.id}
            selected={
              !!selectedPickup &&
              selectedPickup.pickupPoint.id === currentPickup.pickupPoint.id
            }
            onClick={() => {
              onSelectPickup(currentPickup, shouldPersistFacet)
              onClose?.()
            }}
            pickup={currentPickup}
          />
        ))}
      </div>

      <div className="fixed left-0 bottom-0 w-100 flex justify-center mb7">
        <SubmitButton
          isHidden={shouldHideUpdateButton}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}

export default PickupSelection
