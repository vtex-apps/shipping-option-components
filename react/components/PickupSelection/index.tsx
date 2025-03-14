import React from 'react'
import { useIntl } from 'react-intl'

import PostalCodeInput from '../PostalCodeInput'
import messages from '../../messages'
import EmptyState from '../EmptyState'
import PickupList from './PickupList'

interface Props {
  onSubmit: (zipCode?: string) => void
  inputErrorMessage?: string
  zipCode?: string
  onChange: (zipCode?: string) => void
  selectedZipCode?: string | null
  pickups: Pickup[]
  selectedPickup?: Pickup
  onSelectPickup: (pickup: Pickup, shouldPersistFacet?: boolean) => void
  onClose?: () => void
  shouldPersistFacet?: boolean
  onDeliverySelection?: () => void
}

const PickupSelection = ({
  onSubmit,
  inputErrorMessage,
  zipCode,
  onChange,
  pickups,
  selectedPickup,
  onSelectPickup,
  onClose,
  shouldPersistFacet,
  onDeliverySelection,
}: Props) => {
  const intl = useIntl()

  return (
    <div className="flex flex-column justify-between mt5 vh-100">
      <div className="mb7">
        <PostalCodeInput
          zipCode={zipCode}
          onSubmit={onSubmit}
          errorMessage={inputErrorMessage}
          onChange={onChange}
          placeholder={intl.formatMessage(messages.postalCodeInputPlaceHolder)}
        />
      </div>
      {pickups.length === 0 ? (
        <EmptyState
          onClick={onDeliverySelection}
          buttonLabel={intl.formatMessage(messages.noStoresStateButton)}
          title={intl.formatMessage(messages.noStoresStateTitle)}
          description={intl.formatMessage(messages.noStoresStateDescription, {
            postalCode: ` ${zipCode}`,
          })}
        />
      ) : (
        <PickupList
          pickups={pickups}
          onSelectPickup={onSelectPickup}
          selectedPickup={selectedPickup}
          onClose={onClose}
          shouldPersistFacet={shouldPersistFacet}
        />
      )}
    </div>
  )
}

export default PickupSelection
