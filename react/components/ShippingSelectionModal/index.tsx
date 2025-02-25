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
  selectedShipping?: 'delivery' | 'pickup-in-point'
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
  selectedShipping,
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

  const onDeliverySelection = async () => {
    await updateSession(zipCode!, geoCoordinates!, selectedPickup, 'delivery')
    onClose()
    location.reload()
  }

  const stageContent: StageContent = {
    shippingSelection: {
      title: 'Seleccione un método de envío',
      content: (
        <ShippingMethodStage
          selectedShipping={selectedShipping}
          onDeliverySelection={onDeliverySelection}
          onPickupSelection={() => setStage('pickupSelection')}
        />
      ),
    },
    pickupSelection: {
      title: 'Elige una tienda',
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
      showTopCloseButton={stage === 'shippingSelection'}
      title={stageContent[stage].title}
      isOpen={isOpen}
      onClose={onClose}
    >
      {stageContent[stage].content}
    </Modal>
  )
}

export default ShippingSelectionModal
