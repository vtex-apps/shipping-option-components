import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

import ShippingSelectionOptionButton from './ShippingSelectionOptionButton'
import DeliveryIcon from './DeliveryIcon'
import PickupIcon from './PickupIcon'
import messages from '../../messages'

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
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <>
      <p className="mid-gray ma0">
        {intl.formatMessage(messages.shippingSelectionModalDescription)}
      </p>
      <div
        className={`flex flex-column w-100 mt8 justify-around ${handles.shippingMethodModalOptions}`}
      >
        <ShippingSelectionOptionButton
          onClick={onDeliverySelection}
          icon={<DeliveryIcon />}
          label={intl.formatMessage(
            messages.shippingSelectionModalDeliveryButton
          )}
          isSelected={selectedShipping === 'delivery'}
        />
        <ShippingSelectionOptionButton
          onClick={onPickupSelection}
          icon={<PickupIcon />}
          label={intl.formatMessage(
            messages.shippingSelectionModalPickupButton
          )}
          isSelected={selectedShipping === 'pickup-in-point'}
        />
      </div>
    </>
  )
}

export default ShippingMethodStage
