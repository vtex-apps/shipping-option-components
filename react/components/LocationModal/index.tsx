import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import AddLocation from './AddLocation'
import Modal from '../Modal'
import messages from '../../messages'
import EmptyState from '../EmptyState'
import type { ZipCodeError } from '../../context/ShippingOptionContext'
import { PRODUCTS_NOT_FOUND_ERROR_CODE } from '../../constants'

const LOCATION_SELECTION = 'locationSelection'
const NO_PICKUP_STATE = 'noPickupState'

type Stages = 'locationSelection' | 'noPickupState'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (zipCode: string) => void
  isLoading?: boolean
  inputErrorMessage?: ZipCodeError
  selectedZipcode?: string
  nonDismissibleModal?: boolean
  showLocationDetectorButton?: boolean
}

const LocationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  inputErrorMessage,
  selectedZipcode,
  nonDismissibleModal,
  showLocationDetectorButton = false,
}: Props) => {
  const [zipcode, setZipcode] = useState<string>('')
  const [stage, setStage] = useState<Stages>(LOCATION_SELECTION)
  const intl = useIntl()

  useEffect(() => setZipcode(selectedZipcode ?? ''), [selectedZipcode])

  useEffect(() => {
    if (inputErrorMessage?.code === PRODUCTS_NOT_FOUND_ERROR_CODE) {
      setStage(NO_PICKUP_STATE)
    }
  }, [inputErrorMessage])

  const stageContent: StageContent = {
    locationSelection: {
      title: intl.formatMessage(messages.locationModalTitle),
      content: (
        <AddLocation
          onSubmit={onSubmit}
          showLocationDetectorButton={showLocationDetectorButton}
          isLoading={isLoading}
          inputErrorMessage={inputErrorMessage?.message}
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
          onClick={() => setStage(LOCATION_SELECTION)}
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
