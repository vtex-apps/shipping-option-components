import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Input, IconClear } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import messages from '../messages'
import '../styles.css'
import PinIcon from './PinIcon'

const CSS_HANDLES = ['postalCodeInputClearButton', 'zipCodeValue'] as const

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
}

const PostalCodeInput = ({
  zipCode,
  errorMessage,
  onSubmit,
  onChange,
  addressLabel,
}: Props) => {
  const [isZipCodeSet, setIsZipCodeSet] = useState(!!zipCode)

  useEffect(() => {
    if (errorMessage) {
      setIsZipCodeSet(false)
    }
  }, [errorMessage])

  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className="mb7">
      {isZipCodeSet ? (
        <ZipCodeValue
          zipCode={addressLabel ?? ''}
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
          placeholder={intl.formatMessage(messages.postalCodeInputPlaceHolder)}
          suffix={
            <button
              className={handles.postalCodeInputClearButton}
              onClick={() => {
                onChange('')
              }}
            >
              <IconClear />
            </button>
          }
        />
      )}
    </div>
  )
}

export default PostalCodeInput
