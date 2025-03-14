import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import AddLocation from './AddLocation'
import Modal from '../Modal'
import messages from '../../messages'
import EmptyState from '../EmptyState'

type Stages = 'locationSelection' | 'noPickupState'

interface Props {
  isOpen: boolean
  onClose: () => void
  onChange: (zipCode?: string) => void
  onSubmit: (reload?: boolean, validateAndReload?: boolean) => Promise<any>
  isLoading?: boolean
  inputErrorMessage?: string
  zipCode?: string
  nonDismissibleModal?: boolean
}

export const LocationModal = ({
  isOpen,
  onClose,
  onChange,
  onSubmit,
  isLoading,
  inputErrorMessage,
  zipCode,
  nonDismissibleModal,
}: Props) => {
  const intl = useIntl()

  const [stage, setStage] = useState<Stages>('locationSelection')

  const stageContent: StageContent = {
    locationSelection: {
      title: intl.formatMessage(messages.locationModalTitle),
      content: (
        <AddLocation
          onChange={onChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          inputErrorMessage={inputErrorMessage}
          zipCode={zipCode}
        />
      ),
    },
    noPickupState: {
      title: '',
      content: (
        <EmptyState
          title={intl.formatMessage(messages.noPickupsStateTitle)}
          description={intl.formatMessage(messages.noPickupsStateDescription, {
            postalCode: ` ${zipCode}`,
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
