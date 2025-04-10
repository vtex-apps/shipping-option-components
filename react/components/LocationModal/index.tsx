import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import AddLocation from './AddLocation'
import Modal from '../Modal'
import messages from '../../messages'
import EmptyState from '../EmptyState'

type Stages = 'locationSelection' | 'noPickupState'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (zipCode: string) => void
  isLoading?: boolean
  inputErrorMessage?: string
  selectedZipcode?: string
  nonDismissibleModal?: boolean
}

const LocationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  inputErrorMessage,
  selectedZipcode,
  nonDismissibleModal,
}: Props) => {
  const [zipcode, setZipcode] = useState<string>('')
  const [stage, setStage] = useState<Stages>('locationSelection')
  const intl = useIntl()

  useEffect(() => setZipcode(selectedZipcode ?? ''), [selectedZipcode])

  const stageContent: StageContent = {
    locationSelection: {
      title: intl.formatMessage(messages.locationModalTitle),
      content: (
        <AddLocation
          onSubmit={onSubmit}
          isLoading={isLoading}
          inputErrorMessage={inputErrorMessage}
          onChange={(value: string) => setZipcode(value)}
          zipcode={zipcode}
        />
      ),
    },
    noPickupState: {
      title: '',
      content: (
        <EmptyState
          title={intl.formatMessage(messages.noPickupsStateTitle)}
          description={intl.formatMessage(messages.noPickupsStateDescription, {
            postalCode: ` ${zipcode}`,
          })}
          buttonLabel={intl.formatMessage(messages.noPickupsStateButtonLabel)}
          onClick={() => setStage('locationSelection')}
          variant="secondary"
        />
      ),
    },
  }

  return (
    <Modal
      onArrowBack={() => {}}
      showArrowBack={false}
      isTopCloseButton
      title={stageContent[stage].title}
      isOpen={isOpen}
      onClose={onClose}
      nonDismissible={nonDismissibleModal}
    >
      {stageContent[stage].content}
    </Modal>
  )
}

export default LocationModal
