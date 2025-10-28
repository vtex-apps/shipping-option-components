import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import PostalCodeInput from '../PostalCodeInput'
import messages from '../../messages'
import EmptyState from '../EmptyState'
import PickupList from './PickupList'

interface Props {
  onSubmit: (zipCode: string) => void
  inputErrorMessage?: string
  selectedZipcode?: string
  pickups: Pickup[]
  selectedPickup?: Pickup
  onSelectPickup: (pickup: Pickup, shouldPersistFacet?: boolean) => void
  onDeliverySelection?: () => void
  isLoading: boolean
}

const PickupSelection = ({
  onSubmit,
  inputErrorMessage,
  selectedZipcode,
  pickups,
  selectedPickup,
  onSelectPickup,
  onDeliverySelection,
  isLoading,
}: Props) => {
  const [zipcode, setZipcode] = useState<string>('')
  const intl = useIntl()

  useEffect(() => setZipcode(selectedZipcode ?? ''), [selectedZipcode])

  return (
    <div className="flex flex-column mt5 vh-100">
      <div className="mb7">
        <PostalCodeInput
          onChange={(value: string) => setZipcode(value)}
          zipcode={zipcode}
          onSubmit={onSubmit}
          errorMessage={inputErrorMessage}
          placeholder={intl.formatMessage(messages.postalCodeInputPlaceHolder)}
        />
      </div>
      {pickups.length === 0 && !isLoading ? (
        <EmptyState
          onClick={onDeliverySelection}
          buttonLabel={intl.formatMessage(messages.noStoresStateButton)}
          title={intl.formatMessage(messages.noStoresStateTitle)}
          description={intl.formatMessage(messages.noStoresStateDescription, {
            postalCode: ` ${zipcode}`,
          })}
        />
      ) : (
        <PickupList
          pickups={pickups}
          onSelectPickup={onSelectPickup}
          selectedPickup={selectedPickup}
        />
      )}
    </div>
  )
}

export default PickupSelection
