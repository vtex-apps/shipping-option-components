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
  onClose?: () => void
  shouldPersistFacet?: boolean
}

const PickupList = ({
  pickups,
  selectedPickup,
  onSelectPickup,
  onClose,
  shouldPersistFacet,
}: Props) => {
  const handle = useCssHandles(CSS_HANDLES)
  const intl = useIntl()
  const [highlightedPickup, setHighlightedPickup] = useState<Pickup | null>(
    null
  )

  useEffect(() => {
    if (selectedPickup) {
      setHighlightedPickup(selectedPickup)
    }
  }, [selectedPickup])

  const showUpdateButton =
    highlightedPickup &&
    highlightedPickup.pickupPoint.id !== selectedPickup?.pickupPoint.id

  return (
    <>
      <div className="m-100 flex flex-column justify-center">
        {pickups
          .filter((pickup) => pickup.pickupPoint.isActive)
          .map((currentPickup) => (
            <PickupItem
              key={currentPickup.pickupPoint.id}
              selected={
                !!highlightedPickup &&
                highlightedPickup.pickupPoint.id ===
                  currentPickup.pickupPoint.id
              }
              onClick={() => {
                setHighlightedPickup(currentPickup)

                if (!selectedPickup) {
                  onSelectPickup(currentPickup, shouldPersistFacet)
                  onClose?.()
                }
              }}
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
              onSelectPickup(highlightedPickup as Pickup, shouldPersistFacet)
              onClose?.()
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
