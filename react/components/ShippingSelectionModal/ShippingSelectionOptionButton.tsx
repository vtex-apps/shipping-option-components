import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

interface Props {
  onClick: () => void
  icon: React.ReactNode
  label: string
}

const CSS_HANDLES = ['shippingOptionButton']

const ShippingOptionButton = ({ icon, label, onClick }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button
      onClick={onClick}
      className={`flex-auto-l br2 ${handles.shippingOptionButton}`}
    >
      <div className="flex flex-column items-center pt6 pb6">
        {icon}
        <p className="f3 mt4 mb0">{label}</p>
      </div>
    </button>
  )
}

export default ShippingOptionButton
