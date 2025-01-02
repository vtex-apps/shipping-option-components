import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import ShippingSelectionOptionButton from './ShippingSelectionOptionButton'
import DeliveryIcon from './DeliveryIcon'
import PickupIcon from './PickupIcon'

const CSS_HANDLES = ['shippingMethodModalOptions']

interface Props {
  onPickupSelection: () => void
  onDeliverySelection: () => void
}

const ShippingMethodStage = ({
  onDeliverySelection,
  onPickupSelection,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <>
      <p className="mid-gray ma0">
        Product availability may vary per shipping option.
      </p>
      <div className={`flex w-100 mt8 ${handles.shippingMethodModalOptions}`}>
        <ShippingSelectionOptionButton
          onClick={onDeliverySelection}
          icon={<DeliveryIcon />}
          label="Delivery"
        />
        <ShippingSelectionOptionButton
          onClick={onPickupSelection}
          icon={<PickupIcon />}
          label="Pickup"
        />
      </div>
    </>
  )
}

export default ShippingMethodStage
