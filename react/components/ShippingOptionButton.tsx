import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import TruckIcon from './TruckIcon'
import '../styles.css'

const CSS_HANDLES = [
  'buttonWrapper',
  'zipCodeButtonText',
  'zipCodeIcon',
] as const

interface Props {
  onClick: () => void
  zipCode?: string
}

const ShippingOptionButton = ({ onClick, zipCode }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button
      onClick={onClick}
      className={`${handles.buttonWrapper} bn flex justify-between items-center pointer pa0`}
    >
      <TruckIcon className={handles.zipCodeIcon} />
      <span className={`${handles.zipCodeButtonText} f6 rebel-pink fw5`}>
        {zipCode ?? 'Enter a zip code'}
      </span>
    </button>
  )
}

export default ShippingOptionButton
