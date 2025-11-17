/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import Modal from '../Modal'
import ShippingMethodStage from './ShippingMethodStage'
import PickupSelection from '../PickupSelection'
import messages from '../../messages'

interface Props {
  pickupProps: React.ComponentProps<typeof PickupSelection>
  isOpen: boolean
  onClose: () => void
  selectedShipping?: 'delivery' | 'pickup-in-point'
  nonDismissibleModal: boolean
  onDeliverySelection: () => void
  onPickupMethodSelection?: () => void
}

type Stages = 'shippingSelection' | 'pickupSelection'

const ShippingSelectionModal = ({
  pickupProps,
  isOpen,
  onClose,
  selectedShipping,
  nonDismissibleModal,
  onDeliverySelection,
  onPickupMethodSelection,
}: Props) => {
  const intl = useIntl()
  const {
    onSelectPickup,
    onSubmit,
    pickups,
    inputErrorMessage,
    selectedPickup,
    selectedZipcode,
    isLoading,
  } = pickupProps

  const [stage, setStage] = useState<Stages>('shippingSelection')

  const stageContent: StageContent = {
    shippingSelection: {
      title: intl.formatMessage(messages.shippingSelectionModalTitle),
      content: (
        <ShippingMethodStage
          selectedShipping={selectedShipping}
          onDeliverySelection={onDeliverySelection}
          onPickupSelection={() => {
            if (onPickupMethodSelection) {
              onPickupMethodSelection()
            }

            setStage('pickupSelection')
          }}
        />
      ),
    },
    pickupSelection: {
      title: intl.formatMessage(messages.pickupSelectionTitle),
      content: (
        <PickupSelection
          isLoading={isLoading}
          onSelectPickup={onSelectPickup}
          onSubmit={onSubmit}
          pickups={pickups}
          inputErrorMessage={inputErrorMessage}
          selectedPickup={selectedPickup}
          selectedZipcode={selectedZipcode}
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
      nonDismissibleModal={nonDismissibleModal}
    >
      {stageContent[stage].content}
    </Modal>
  )
}

export default ShippingSelectionModal
