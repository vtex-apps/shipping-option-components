import React from 'react'
import { useIntl } from 'react-intl'

import Modal from './Modal'
import messages from '../messages'
import PickupSelection from './PickupSelection'

interface Props {
  isOpen: boolean
  onClose: () => void
  pickupProps: React.ComponentProps<typeof PickupSelection>
}

const PickupModal = ({ isOpen, onClose, pickupProps }: Props) => {
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

  return (
    <Modal
      showArrowBack={false}
      isTopCloseButton={false}
      title={intl.formatMessage(messages.deliverToButtonPlaceholder)}
      isOpen={isOpen}
      onClose={onClose}
    >
      <PickupSelection
        onSelectPickup={onSelectPickup}
        onSubmit={onSubmit}
        pickups={pickups}
        inputErrorMessage={inputErrorMessage}
        selectedPickup={selectedPickup}
        selectedZipcode={selectedZipcode}
        shouldPersistFacet={false}
        isLoading={isLoading}
      />
    </Modal>
  )
}

export default PickupModal
