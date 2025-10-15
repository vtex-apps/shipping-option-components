import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import messages from '../../messages'
import PickupItem from './PickupItem'

const CSS_HANDLES = ['updateButtonContainer'] as const

interface Props {
  pickups: Pickup[]
  selectedPickup?: Pickup
  onSelectPickup: (pickup: Pickup, shouldPersistFacet?: boolean) => void
}

const PickupList = ({ pickups, selectedPickup, onSelectPickup }: Props) => {
  const handle = useCssHandles(CSS_HANDLES)
  const intl = useIntl()
  const [highlightedPickup, setHighlightedPickup] = useState<Pickup>()

  useEffect(() => {
    if (selectedPickup) {
      setHighlightedPickup(selectedPickup)
    }
  }, [selectedPickup])

  const showUpdateButton =
    selectedPickup &&
    highlightedPickup &&
    highlightedPickup.pickupPoint.id !== selectedPickup.pickupPoint.id

  const handleClickItem = (pickup: Pickup) => {
    setHighlightedPickup(pickup)

    if (
      !selectedPickup ||
      selectedPickup.pickupPoint.id === pickup.pickupPoint.id
    ) {
      onSelectPickup(pickup)
    }
  }

  return (
    <>
      <div className="m-100 flex flex-column justify-center">
        {pickups.map((currentPickup) => (
          <PickupItem
            key={currentPickup.pickupPoint.id}
            selected={
              !!highlightedPickup &&
              highlightedPickup.pickupPoint.id === currentPickup.pickupPoint.id
            }
            onClick={() => handleClickItem(currentPickup)}
            pickup={currentPickup}
          />
        ))}
      </div>
      {showUpdateButton && (
        <div
          style={{ bottom: '-30px' }}
          className={`sticky left-0 bottom-0 w-100 flex justify-center ${handle.updateButtonContainer}`}
        >
          <Button
            block
            onClick={() => {
              onSelectPickup(highlightedPickup as Pickup)
            }}
          >
            {intl.formatMessage(messages.updateButtonLabel)}
          </Button>
        </div>
      )}
    </>
  )
}

export default PickupList
