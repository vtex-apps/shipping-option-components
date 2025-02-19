import React from 'react'
import { useIntl } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'
import { useCssHandles } from 'vtex.css-handles'

import ShippingOptionDrawer from './ShippingOptionDrawer'
import ShippingOptionButton from './ShippingOptionButton'
import DeliverySelection from './DeliverySelection'
import { DELIVER_DRAWER_PIXEL_EVENT_ID } from '../constants'
import messages from '../messages'
import PinIcon from './PinIcon'

interface Props {
  isLoading: boolean
  addressLabel?: string
  onSubmit: () => void
  inputErrorMessage?: string
  onChange: (zipCode?: string) => void
  zipCode?: string
  selectedZipCode?: string | null
  compact: boolean
  city?: string
  overlayType?: OverlayType
}

const CSS_HANDLES = ['deliveryDrawerValue']

const DeliveryDrawer = ({
  addressLabel,
  city,
  isLoading,
  onChange,
  onSubmit,
  inputErrorMessage,
  selectedZipCode,
  zipCode,
  // compact,
  overlayType,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()
  const { push } = usePixel()

  const onOpen = () => {
    push({
      id: DELIVER_DRAWER_PIXEL_EVENT_ID,
    })
  }

  return (
    <ShippingOptionDrawer
      icon={
        <ShippingOptionButton
          onClick={onOpen}
          loading={isLoading}
          value={
            city && selectedZipCode ? (
              <div
                className={`${handles.deliveryDrawerValue} flex flex-column`}
              >
                <span className="truncate tl">{city}</span>
                <span className="tl">{selectedZipCode}</span>
              </div>
            ) : (
              addressLabel
            )
          }
          placeholder={intl.formatMessage(messages.deliverToButtonPlaceholder)}
          label={<PinIcon filled={false} />}
          compact={false} // remove
          zipCode={zipCode}
          onChange={onChange}
          onSubmit={onSubmit}
          inputErrorMessage={inputErrorMessage}
          overlayType={overlayType}
        />
      }
      title={intl.formatMessage(messages.storeDeliverDrawerTitle)}
      customPixelEventId={DELIVER_DRAWER_PIXEL_EVENT_ID}
      onSubmit={onSubmit}
      inputErrorMessage={inputErrorMessage}
      isLoading={isLoading}
    >
      <DeliverySelection
        isLoading={isLoading}
        onChange={onChange}
        onSubmit={onSubmit}
        addressLabel={addressLabel}
        inputErrorMessage={inputErrorMessage}
        selectedZipCode={selectedZipCode}
        zipCode={zipCode}
      />
    </ShippingOptionDrawer>
  )
}

export default DeliveryDrawer
