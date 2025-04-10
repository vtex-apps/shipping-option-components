import React from 'react'
import { Input, IconClear } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import '../styles.css'

const CSS_HANDLES = [
  'postalCodeInputClearButton',
  'postalCodeInputContainer',
] as const

interface Props {
  onSubmit: (zipcode: string) => void
  onChange: (zipcode: string) => void
  zipcode: string
  errorMessage?: string
  showClearButton?: boolean
  placeholder?: string
}

const postalCodeInputClearButton = {
  backgroundColor: 'unset',
  width: '32px',
  height: '32px',
}

const PostalCodeInput = ({
  zipcode,
  errorMessage,
  onSubmit,
  onChange,
  showClearButton = false,
  placeholder,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`w-100 ${handles.postalCodeInputContainer}`}>
      <Input
        autFocus
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value.replace(/[^0-9]/g, ''))
        }
        onKeyDown={(e: { key: string }) => {
          if (e.key === 'Enter') {
            onSubmit(zipcode ?? '')
          }
        }}
        value={zipcode}
        errorMessage={errorMessage}
        placeholder={placeholder}
        suffix={
          showClearButton ? (
            <button
              style={postalCodeInputClearButton}
              className={`bn pointer flex justify-center items-center pa3 ${handles.postalCodeInputClearButton}`}
              onClick={() => {
                onChange('')
              }}
            >
              <IconClear />
            </button>
          ) : null
        }
      />
    </div>
  )
}

export default PostalCodeInput
