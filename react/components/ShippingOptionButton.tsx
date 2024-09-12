import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'

import '../styles.css'

const CSS_HANDLES = ['buttonWrapper', 'buttonLabel', 'buttonValue'] as const

interface Props {
  onClick: () => void
  loading: boolean
  label: string
  placeholder: string
  value?: string
  compact: boolean
}

const ShippingOptionButton = ({
  onClick,
  loading,
  label,
  value,
  placeholder,
  compact,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className="flex items-center">
      <button
        onClick={onClick}
        style={{
          border: '0 solid',
          background: 'unset',
        }}
        className={`${handles.buttonWrapper} flex h2 items-center br3 pt3 pb3`}
      >
        {!compact && (
          <p className={`${handles.buttonLabel} ma0 c-on-base f6 mr2`}>
            {label}
          </p>
        )}
        {loading ? (
          <div className="ml4">
            <Spinner size={14} />
          </div>
        ) : (
          <p className={`${handles.buttonValue} ma0 f6 fw6`}>
            {value ?? placeholder}
          </p>
        )}
      </button>
    </div>
  )
}

export default ShippingOptionButton
