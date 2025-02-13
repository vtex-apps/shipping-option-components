import React, { useEffect, useState } from 'react'
import { Input, IconClear } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import '../styles.css'
import PinIcon from './PinIcon'

const CSS_HANDLES = [
  'postalCodeInputClearButton',
  'zipCodeValue',
  'postalCodeInputContainer',
] as const

interface ZipCodeValueProps {
  zipCode: string
  onClick: () => void
}

const ZipCodeValue = ({ zipCode, onClick }: ZipCodeValueProps) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button className={handles.zipCodeValue} onClick={onClick}>
      <PinIcon />

      <span className="ml3">{zipCode}</span>
    </button>
  )
}

interface Props {
  onSubmit: () => void
  onChange: (zipCode?: string) => void
  addressLabel?: string
  zipCode?: string
  errorMessage?: string
  showClearButton?: boolean
  placeholder?: string
  newZipCodeTyped?: boolean
}

const PostalCodeInput = ({
  zipCode,
  errorMessage,
  onSubmit,
  onChange,
  addressLabel,
  showClearButton = true,
  placeholder,
  newZipCodeTyped,
}: Props) => {
  const [isZipCodeSet, setIsZipCodeSet] = useState(!!zipCode)

  useEffect(() => {
    if (errorMessage) {
      setIsZipCodeSet(false)
    }
  }, [errorMessage])

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.postalCodeInputContainer}>
      {isZipCodeSet ? (
        <ZipCodeValue
          zipCode={(newZipCodeTyped ? zipCode : addressLabel) ?? ''}
          onClick={() => setIsZipCodeSet(false)}
        />
      ) : (
        <Input
          autFocus
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value.replace(/[^0-9]/g, ''))
          }
          onBlur={() => {
            !!zipCode && setIsZipCodeSet(true)
          }}
          onKeyDown={(e: { key: string }) => {
            if (e.key === 'Enter') {
              onSubmit()
              setIsZipCodeSet(true)
            }
          }}
          value={zipCode}
          errorMessage={errorMessage}
          placeholder={placeholder}
          suffix={
            showClearButton ? (
              <button
                className={handles.postalCodeInputClearButton}
                onClick={() => {
                  onChange('')
                }}
              >
                <IconClear />
              </button>
            ) : null
          }
        />
      )}
    </div>
  )
}

export default PostalCodeInput
