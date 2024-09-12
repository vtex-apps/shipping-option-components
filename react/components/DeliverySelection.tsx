import React from 'react'

import PostalCodeInput from './PostalCodeInput'
import SubmitButton from './SubmitButton'

interface Props {
  onSubmit: (zipCode?: string) => void
  inputErrorMessage?: string
  zipCode?: string
  onChange: (zipCode?: string) => void
  addressLabel?: string
  selectedZipCode?: string
  isLoading: boolean
}

const DeliverySelection = ({
  onSubmit,
  inputErrorMessage,
  zipCode,
  onChange,
  addressLabel,
  selectedZipCode,
  isLoading,
}: Props) => {
  const newZipCodeTyped = zipCode !== selectedZipCode
  const shouldHideUpdateButton = (!zipCode || !newZipCodeTyped) && !isLoading

  return (
    <div className="flex flex-column justify-between">
      <PostalCodeInput
        zipCode={zipCode}
        onSubmit={onSubmit}
        errorMessage={inputErrorMessage}
        onChange={onChange}
        addressLabel={addressLabel}
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
