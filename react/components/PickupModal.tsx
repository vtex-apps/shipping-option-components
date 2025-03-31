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
    onChange,
    onSelectPickup,
    onSubmit,
    pickups,
    inputErrorMessage,
    selectedPickup,
    selectedZipCode,
    zipCode,
    isLoading,
  } = pickupProps

  return (
    <Modal
      showArrowBack={false}
      isTopCloseButton
      title={intl.formatMessage(messages.deliverToButtonPlaceholder)}
      isOpen={isOpen}
      onClose={onClose}
    >
      <PickupSelection
        onChange={onChange}
        onSelectPickup={onSelectPickup}
        onSubmit={onSubmit}
        pickups={pickups}
        inputErrorMessage={inputErrorMessage}
        selectedPickup={selectedPickup}
        selectedZipCode={selectedZipCode}
        zipCode={zipCode}
        onDeliverySelection={() => null}
        shouldPersistFacet={false}
        isLoading={isLoading}
      />
    </Modal>
  )
}

export default PickupModal
