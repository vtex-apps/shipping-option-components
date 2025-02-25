import React from 'react'
import { useIntl } from 'react-intl'

import PostalCodeInput from './PostalCodeInput'
import SubmitButton from './SubmitButton'
import messages from '../messages'

interface Props {
  onSubmit: (zipCode?: string) => void
  inputErrorMessage?: string
  zipCode?: string
  onChange: (zipCode?: string) => void
  selectedZipCode?: string | null
  isLoading: boolean
}

const DeliverySelection = ({
  onSubmit,
  inputErrorMessage,
  zipCode,
  onChange,
  selectedZipCode,
  isLoading,
}: Props) => {
  const newZipCodeTyped = zipCode !== selectedZipCode
  const shouldHideUpdateButton = (!zipCode || !newZipCodeTyped) && !isLoading
  const intl = useIntl()

  return (
    <div className="flex flex-column justify-between">
      <PostalCodeInput
        zipCode={zipCode}
        onSubmit={onSubmit}
        errorMessage={inputErrorMessage}
        onChange={onChange}
        placeholder={intl.formatMessage(messages.postalCodeInputPlaceHolder)}
      />
      <div className="fixed left-0 bottom-0 w-100 flex justify-center mb7">
        <SubmitButton
          isHidden={shouldHideUpdateButton}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}

export default DeliverySelection
