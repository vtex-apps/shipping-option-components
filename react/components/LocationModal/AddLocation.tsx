import React from 'react'
import { Button } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import PostalCodeInput from '../PostalCodeInput'
import messages from '../../messages'
import PostalCodeHelpLink from '../PostalCodeHelpLink'
import LocationDetectorButton from '../LocationDetectorButton'

interface AddLocationProps {
  onSubmit: (zipcode: string) => void
  onChange: (zipCode: string) => void
  zipcode: string
  isLoading?: boolean
  inputErrorMessage?: string
  showLocationDetectorButton?: boolean
}

const AddLocation = ({
  onSubmit,
  onChange,
  zipcode,
  isLoading,
  inputErrorMessage,
  showLocationDetectorButton,
}: AddLocationProps) => {
  const intl = useIntl()

  return (
    <div className="flex-auto flex flex-column justify-between mt0">
      <p className="mid-gray ma0">
        {intl.formatMessage(messages.locationModalDescription)}
      </p>

      <div>
        <PostalCodeInput
          onChange={(value: string) => onChange(value)}
          zipcode={zipcode}
          onSubmit={onSubmit}
          errorMessage={inputErrorMessage}
          showClearButton={false}
          placeholder={intl.formatMessage(
            messages.popoverPostalCodeInputPlaceHolder
          )}
        />
        <div className="mt3">
          <PostalCodeHelpLink />
        </div>
      </div>

      <Button isLoading={isLoading} onClick={() => onSubmit(zipcode)}>
        {intl.formatMessage(messages.popoverSubmitButtonLabel)}
      </Button>
      {showLocationDetectorButton && <LocationDetectorButton />}
    </div>
  )
}

export default AddLocation
