import React from 'react'
import { Input, IconClear } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import '../styles.css'

const CSS_HANDLES = [
  'postalCodeInputClearButton',
  'postalCodeInputContainer',
] as const

interface Props {
  onSubmit: () => void
  onChange: (zipCode?: string) => void
  zipCode?: string
  errorMessage?: string
  showClearButton?: boolean
  placeholder?: string
}

const PostalCodeInput = ({
  zipCode,
  errorMessage,
  onSubmit,
  onChange,
  showClearButton = true,
  placeholder,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.postalCodeInputContainer}>
      <Input
        autFocus
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value.replace(/[^0-9]/g, ''))
        }
        onKeyDown={(e: { key: string }) => {
          if (e.key === 'Enter') {
            onSubmit()
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
    </div>
  )
}

export default PostalCodeInput
