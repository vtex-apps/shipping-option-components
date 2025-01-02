import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'

import ShippingIcon from './ShippingIcon'
import PickupIcon from './PickupIcon'
import DeliveryIcon from './DeliveryIcon'

interface Props {
  onClick: () => void
  selectedShipping?: 'delivery' | 'pickup'
  selectedPickup?: Pickup
  loading: boolean
}

const CSS_HANDLES = [
  'deliiveryModalButton',
  'deliveryModalButtonLabel',
  'deliveryModalButtonLabelLimited',
]

const SHIPPING_ICONS = {
  pickup: <PickupIcon width={24} height={24} />,
  delivery: <DeliveryIcon width={24} height={22.5} />,
}

const DeliveryModalButton = ({
  selectedShipping,
  onClick,
  selectedPickup,
  loading,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button
      style={{ border: 0 }}
      onClick={onClick}
      className={`flex flex-row items-center pa4 ${handles.deliiveryModalButton}`}
    >
      {selectedShipping ? (
        SHIPPING_ICONS[selectedShipping]
      ) : (
        <ShippingIcon width={32} height={32} />
      )}
      {loading ? (
        <span className="ml3">
          <Spinner size={14} />
        </span>
      ) : (
        <span
          className={`${handles.deliveryModalButtonLabel} ${
            selectedShipping === 'pickup'
              ? handles.deliveryModalButtonLabelLimited
              : ''
          }`}
        >
          {selectedShipping
            ? selectedShipping === 'delivery'
              ? 'Filtrando por entrega'
              : selectedPickup?.pickupPoint.friendlyName
            : 'Filtrar por envio'}
        </span>
      )}
    </button>
  )
}

export default DeliveryModalButton
