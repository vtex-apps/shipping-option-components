import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import ShippingSelectionOptionButton from './ShippingSelectionOptionButton'
import DeliveryIcon from './DeliveryIcon'
import PickupIcon from './PickupIcon'

const CSS_HANDLES = ['shippingMethodModalOptions']

interface Props {
  onPickupSelection: () => void
  onDeliverySelection: () => void
  selectedShipping?: 'delivery' | 'pickup-in-point'
}

const ShippingMethodStage = ({
  onDeliverySelection,
  onPickupSelection,
  selectedShipping,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <>
      <p className="mid-gray ma0">
        La disponibilidad de dos productos varía según el método
      </p>
      <div
        className={`flex w-100 mt8 justify-around ${handles.shippingMethodModalOptions}`}
      >
        <ShippingSelectionOptionButton
          onClick={onDeliverySelection}
          icon={<DeliveryIcon />}
          label="Entregar a domicilio"
          isSelected={selectedShipping === 'delivery'}
        />
        <ShippingSelectionOptionButton
          onClick={onPickupSelection}
          icon={<PickupIcon />}
          label="Recoger en una tienda"
          isSelected={selectedShipping === 'pickup-in-point'}
        />
      </div>
    </>
  )
}

export default ShippingMethodStage
