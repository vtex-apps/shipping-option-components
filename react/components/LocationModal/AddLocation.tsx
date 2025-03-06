import React from 'react'
import { Button } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import PostalCodeInput from '../PostalCodeInput'
import messages from '../../messages'
import PostalCodeHelpLink from '../PostalCodeHelpLink'

interface Props {
  onChange: (zipCode?: string) => void
  onSubmit: () => void
  isLoading?: boolean
  inputErrorMessage?: string
  zipCode?: string
}

const AddLocation = ({
  onChange,
  onSubmit,
  isLoading,
  inputErrorMessage,
  zipCode,
}: Props) => {
  const intl = useIntl()

  return (
    <div className="flex-auto flex flex-column justify-between mt0">
      <p className="mid-gray ma0">
        {intl.formatMessage(messages.locationModalDescription)}
      </p>

      <div>
        <PostalCodeInput
          zipCode={zipCode}
          onSubmit={onSubmit}
          errorMessage={inputErrorMessage}
          onChange={onChange}
          showClearButton={false}
          placeholder={intl.formatMessage(
            messages.popoverPostalCodeInputPlaceHolder
          )}
        />
        <div className="mt3">
          <PostalCodeHelpLink />
        </div>
      </div>

      <Button isLoading={isLoading} onClick={onSubmit}>
        {intl.formatMessage(messages.popoverSubmitButtonLabel)}
      </Button>
    </div>
  )
}

export default AddLocation
