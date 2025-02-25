import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

interface Props {
  onClick: () => void
  icon: React.ReactNode
  label: string
  isSelected: boolean
}

const CSS_HANDLES = ['shippingOptionButton', 'shippingOptionButtonSelected']

const ShippingOptionButton = ({ icon, label, onClick, isSelected }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button
      onClick={onClick}
      className={`br2 w-100 ${handles.shippingOptionButton} ${
        isSelected ? handles.shippingOptionButtonSelected : ''
      }`}
    >
      <div className="flex items-center">
        {icon}
        <p className="f3 ml4 mt0 mb0 tc">{label}</p>
      </div>
    </button>
  )
}

export default ShippingOptionButton
