import React from 'react'
import { useIntl } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'
import { useDrawer } from 'vtex.store-drawer/DrawerContext'
import { useCssHandles } from 'vtex.css-handles'

import ShippingOptionDrawer from './ShippingOptionDrawer'
import ShippingOptionButton from './ShippingOptionButton'
import { STORE_DRAWER_PIXEL_EVENT_ID } from '../constants'
import messages from '../messages'
import PickupSelection from './PickupSelection'

const CSS_HANDLES = ['drawerHiddenIcon'] as const

interface Props {
  isLoading: boolean
  onSubmit: () => void
  inputErrorMessage?: string
  onChange: (zipCode?: string) => void
  zipCode?: string
  selectedZipCode?: string | null
  selectedPickup?: Pickup
  pickups: Pickup[]
  onSelectPickup: (pickup: Pickup) => void
  compact: boolean
  hideStoreSelection: boolean
}

const PikcupDrawer = ({
  isLoading,
  onChange,
  onSubmit,
  inputErrorMessage,
  selectedZipCode,
  zipCode,
  pickups,
  selectedPickup,
  onSelectPickup,
  compact,
  hideStoreSelection,
}: Props) => {
  const intl = useIntl()
  const { push } = usePixel()
  const handles = useCssHandles(CSS_HANDLES)

  const onOpen = () => {
    push({
      id: STORE_DRAWER_PIXEL_EVENT_ID,
    })
  }

  const drawerTitleMessage =
    pickups.length > 0
      ? messages.pickupDrawerTitleFilled
      : messages.pickupDrawerTitleEmpty

  const storeLabel = selectedPickup
    ? selectedPickup.pickupPoint.friendlyName
    : undefined

  const PickupSelectionWrapper = (
    props: React.ComponentProps<typeof PickupSelection>
  ) => {
    const close = useDrawer()

    return (
      <PickupSelection {...props} onClose={close} shouldPersistFacet={false} />
    )
  }

  return (
    <ShippingOptionDrawer
      icon={
        hideStoreSelection ? (
          <div className={`${handles.drawerHiddenIcon}`} />
        ) : (
          <ShippingOptionButton
            onClick={onOpen}
            loading={isLoading}
            value={storeLabel}
            placeholder={intl.formatMessage(messages.storeButtonPlaceHolder)}
            label={intl.formatMessage(messages.storeButtonLabel)}
            compact={compact}
          />
        )
      }
      title={intl.formatMessage(drawerTitleMessage)}
      customPixelEventId={STORE_DRAWER_PIXEL_EVENT_ID}
      onSubmit={onSubmit}
      inputErrorMessage={inputErrorMessage}
      isLoading={isLoading}
    >
      <PickupSelectionWrapper
        isLoading={isLoading}
        onChange={onChange}
        onSubmit={onSubmit}
        inputErrorMessage={inputErrorMessage}
        selectedZipCode={selectedZipCode}
        zipCode={zipCode}
        pickups={pickups}
        selectedPickup={selectedPickup}
        onSelectPickup={onSelectPickup}
      />
    </ShippingOptionDrawer>
  )
}

export default PikcupDrawer
