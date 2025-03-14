/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import Modal from '../Modal'
import ShippingMethodStage from './ShippingMethodStage'
import PickupSelection from '../PickupSelection'
import { updateSession } from '../../client'
import messages from '../../messages'

interface Props {
  pickupProps: React.ComponentProps<typeof PickupSelection>
  geoCoordinates?: number[]
  isOpen: boolean
  onClose: () => void
  selectedShipping?: 'delivery' | 'pickup-in-point'
}

type Stages = 'shippingSelection' | 'pickupSelection'

const ShippingSelectionModal = ({
  pickupProps,
  isOpen,
  onClose,
  geoCoordinates,
  selectedShipping,
}: Props) => {
  const intl = useIntl()
  const {
    onChange,
    onSelectPickup,
    onSubmit,
    pickups,
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
      title: intl.formatMessage(messages.shippingSelectionModalTitle),
      content: (
        <ShippingMethodStage
          selectedShipping={selectedShipping}
          onDeliverySelection={onDeliverySelection}
          onPickupSelection={() => setStage('pickupSelection')}
        />
      ),
    },
    pickupSelection: {
      title: intl.formatMessage(messages.pickupSelectionTitle),
      content: (
        <PickupSelection
          onChange={onChange}
          onSelectPickup={onSelectPickup}
          onSubmit={onSubmit}
          pickups={pickups}
          inputErrorMessage={inputErrorMessage}
          selectedPickup={selectedPickup}
          selectedZipCode={selectedZipCode}
          zipCode={zipCode}
          onDeliverySelection={onDeliverySelection}
        />
      ),
    },
  }

  return (
    <Modal
      onArrowBack={() => setStage('shippingSelection')}
      showArrowBack={stage !== 'shippingSelection'}
      isTopCloseButton={stage === 'shippingSelection'}
      title={stageContent[stage].title}
      isOpen={isOpen}
      onClose={onClose}
    >
      {stageContent[stage].content}
    </Modal>
  )
}

export default ShippingSelectionModal
