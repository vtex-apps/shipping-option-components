/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'

import Modal from '../Modal'
import ShippingMethodStage from './ShippingMethodStage'
import PickupSelection from '../PickupSelection'
import { updateSession } from '../../client'

interface Props {
  pickupProps: React.ComponentProps<typeof PickupSelection>
  geoCoordinates?: number[]
  isOpen: boolean
  onClose: () => void
}

type Stages = 'shippingSelection' | 'pickupSelection'

interface StageContent {
  [key: string]: { title: string; content: React.JSX.Element }
}

const ShippingSelectionModal = ({
  pickupProps,
  isOpen,
  onClose,
  geoCoordinates,
}: Props) => {
  const {
    isLoading,
    onChange,
    onSelectPickup,
    onSubmit,
    pickups,
    addressLabel,
    inputErrorMessage,
    selectedPickup,
    selectedZipCode,
    zipCode,
  } = pickupProps

  const [stage, setStage] = useState<Stages>('shippingSelection')

  const onDeliverySelection = () => {
    updateSession(zipCode!, geoCoordinates!, selectedPickup, 'delivery')
    onClose()
    location.reload()
  }

  const stageContent: StageContent = {
    shippingSelection: {
      title: 'Choose a shipping method',
      content: (
        <ShippingMethodStage
          onDeliverySelection={onDeliverySelection}
          onPickupSelection={() => setStage('pickupSelection')}
        />
      ),
    },
    pickupSelection: {
      title: 'Choose a store',
      content: (
        <PickupSelection
          isLoading={isLoading}
          onChange={onChange}
          onSelectPickup={onSelectPickup}
          onSubmit={onSubmit}
          pickups={pickups}
          addressLabel={addressLabel}
          inputErrorMessage={inputErrorMessage}
          selectedPickup={selectedPickup}
          selectedZipCode={selectedZipCode}
          zipCode={zipCode}
        />
      ),
    },
  }

  return (
    <Modal
      onArrowBack={() => setStage('shippingSelection')}
      showArrowBack={stage !== 'shippingSelection'}
      title={stageContent[stage].title}
      isOpen={isOpen}
      onClose={onClose}
    >
      {stageContent[stage].content}
    </Modal>
  )
}

export default ShippingSelectionModal
