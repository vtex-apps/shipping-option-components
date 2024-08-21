import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'

import TruckIcon from './TruckIcon'
import '../styles.css'

const CSS_HANDLES = [
  'buttonWrapper',
  'zipCodeButtonText',
  'zipCodeIcon',
] as const

interface Props {
  onClick: () => void
  loading: boolean
  zipCode?: string
}

const ShippingOptionButton = ({ onClick, zipCode, loading }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button
      onClick={onClick}
      className={`${handles.buttonWrapper} bn bg-transparent flex justify-between items-center pointer pa0`}
    >
      <TruckIcon className={handles.zipCodeIcon} />
      {loading ? (
        <div className="ml4">
          <Spinner size={14} />
        </div>
      ) : (
        <span className={`${handles.zipCodeButtonText} f6 rebel-pink fw5`}>
          {zipCode ?? 'Enter a zip code'}
        </span>
      )}
    </button>
  )
}

export default ShippingOptionButton
