import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'
import { useDevice } from 'vtex.device-detector'

import ShippingIcon from './ShippingIcon'
import PickupIcon from './PickupIcon'
import DeliveryIcon from './DeliveryIcon'

interface Props {
  onClick: () => void
  selectedShipping?: 'delivery' | 'pickup-in-point'
  selectedPickup?: Pickup
  loading: boolean
}

const CSS_HANDLES = [
  'deliveryModalButton',
  'deliveryModalButtonLabel',
  'deliveryModalButtonLabelLimited',
]

const SHIPPING_ICONS = {
  'pickup-in-point': <PickupIcon width={24} height={24} />,
  delivery: <DeliveryIcon width={24} height={22.5} />,
}

const DeliveryModalButton = ({
  selectedShipping,
  onClick,
  selectedPickup,
  loading,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()

  return (
    <button
      onClick={onClick}
      className={`flex flex-row items-center pa4 ${handles.deliveryModalButton}`}
    >
      {selectedShipping ? (
        SHIPPING_ICONS[selectedShipping]
      ) : (
        <span>
          <ShippingIcon width={32} height={32} />
        </span>
      )}
      {!isMobile && (
        <>
          {loading ? (
            <span className="ml3">
              <Spinner size={14} />
            </span>
          ) : (
            <span
              className={`${handles.deliveryModalButtonLabel} ${
                selectedShipping === 'pickup-in-point'
                  ? handles.deliveryModalButtonLabelLimited
                  : ''
              } c-action-primary`}
            >
              {selectedShipping
                ? selectedShipping === 'delivery'
                  ? 'Filtrando por entrega'
                  : selectedPickup?.pickupName
                : 'Filtrar por envío'}
            </span>
          )}
        </>
      )}
    </button>
  )
}

export default DeliveryModalButton
